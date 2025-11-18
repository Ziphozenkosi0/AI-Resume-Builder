import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, personalInfo, experience } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    let prompt = "";
    let systemPrompt = "You are a professional resume writer and career consultant with expertise in creating ATS-optimized content.";

    if (type === "summary") {
      prompt = `Write a professional resume summary for ${personalInfo.fullName}. 
      Keep it concise (3-4 sentences), highlight key strengths and career goals. 
      Make it ATS-friendly with relevant keywords. 
      Output only the summary text, no additional formatting or explanations.`;
    } else if (type === "experience") {
      prompt = `Enhance this work experience entry:
      Position: ${experience.position}
      Company: ${experience.company}
      
      Create:
      1. A compelling job description (2-3 sentences) that highlights responsibilities and impact
      2. 3-5 bullet points of specific achievements with quantifiable results where possible
      
      Use action verbs and industry-specific keywords for ATS optimization.
      
      Respond in JSON format:
      {
        "description": "your description here",
        "achievements": ["achievement 1", "achievement 2", "achievement 3"]
      }`;
    }

    console.log("Generating content with prompt:", prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    console.log("Generated content:", content);

    let result: any = {};

    if (type === "summary") {
      result.summary = content.trim();
    } else if (type === "experience") {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(content);
        result = parsed;
      } catch {
        // If not valid JSON, extract manually
        result.description = content.trim();
        result.achievements = [];
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-content function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
