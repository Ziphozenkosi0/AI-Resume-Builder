import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PersonalInfo } from "@/types/resume";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  onNext: () => void;
}

const PersonalInfoForm = ({ data, onChange, onNext }: PersonalInfoFormProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const generateSummary = async () => {
    if (!data.fullName) {
      toast({
        title: "Missing information",
        description: "Please enter your name first",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-content", {
        body: {
          type: "summary",
          personalInfo: data,
        },
      });

      if (error) throw error;

      if (result.summary) {
        handleChange("summary", result.summary);
        toast({
          title: "Summary generated!",
          description: "AI has created a professional summary for you",
        });
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          placeholder="Asonwabe Ntshiyantshiya"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="asonwabe.ntshiya@gmail.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+27 (73) 123-4567"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Durban,KwaZulu-Natal, SA"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="linkedin.com/in/Ziphozenkosi"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="Ziphozenkosi.com"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateSummary}
            disabled={generating}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {generating ? "Generating..." : "AI Generate"}
          </Button>
        </div>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="A brief professional summary highlighting your experience and skills"
          rows={4}
        />
      </div>

      <Button onClick={onNext} className="w-full">
        Next: Experience
      </Button>
    </div>
  );
};

export default PersonalInfoForm;
