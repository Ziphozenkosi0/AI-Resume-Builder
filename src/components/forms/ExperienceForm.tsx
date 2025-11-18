import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Experience } from "@/types/resume";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
  onNext: () => void;
}

const ExperienceForm = ({ data, onChange, onNext }: ExperienceFormProps) => {
  const { toast } = useToast();
  const [generating, setGenerating] = useState<string | null>(null);

  const addExperience = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: [],
      },
    ]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const enhanceDescription = async (id: string) => {
    const experience = data.find((exp) => exp.id === id);
    if (!experience || !experience.position || !experience.company) {
      toast({
        title: "Missing information",
        description: "Please fill in position and company first",
        variant: "destructive",
      });
      return;
    }

    setGenerating(id);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-content", {
        body: {
          type: "experience",
          experience: experience,
        },
      });

      if (error) throw error;

      if (result.description) {
        updateExperience(id, "description", result.description);
        if (result.achievements) {
          updateExperience(id, "achievements", result.achievements);
        }
        toast({
          title: "Content enhanced!",
          description: "AI has improved your experience description",
        });
      }
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast({
        title: "Enhancement failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-4">
      {data.map((exp) => (
        <Card key={exp.id} className="p-4 space-y-4 border-muted">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">Experience Entry</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company *</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                placeholder="Company Name"
                required
              />
            </div>
            <div>
              <Label>Position *</Label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                placeholder="Job Title"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date *</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                required
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                disabled={exp.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`current-${exp.id}`}
              checked={exp.current}
              onCheckedChange={(checked) =>
                updateExperience(exp.id, "current", checked)
              }
            />
            <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
              I currently work here
            </Label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => enhanceDescription(exp.id)}
                disabled={generating === exp.id}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {generating === exp.id ? "Enhancing..." : "AI Enhance"}
              </Button>
            </div>
            <Textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
              placeholder="Describe your responsibilities and achievements"
              rows={4}
            />
          </div>
        </Card>
      ))}

      <Button
        variant="outline"
        onClick={addExperience}
        className="w-full border-dashed"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>

      <Button onClick={onNext} className="w-full" disabled={data.length === 0}>
        Next: Education
      </Button>
    </div>
  );
};

export default ExperienceForm;
