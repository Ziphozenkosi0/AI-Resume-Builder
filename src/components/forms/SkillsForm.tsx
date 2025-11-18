import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skill } from "@/types/resume";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<Skill["level"]>("intermediate");

  const addSkill = () => {
    if (newSkill.trim()) {
      onChange([...data, { name: newSkill.trim(), level: newLevel }]);
      setNewSkill("");
      setNewLevel("intermediate");
    }
  };

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="skillName">Add Skills</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="skillName"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., JavaScript, Project Management"
              className="flex-1"
            />
            <Select value={newLevel} onValueChange={(value: Skill["level"]) => setNewLevel(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addSkill} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {data.length > 0 && (
          <div className="space-y-2">
            <Label>Your Skills</Label>
            <div className="flex flex-wrap gap-2">
              {data.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm"
                >
                  <span className="mr-2">{skill.name}</span>
                  <span className="text-xs text-muted-foreground mr-2">
                    ({skill.level})
                  </span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Add at least 5 relevant skills to improve your ATS score
      </p>
    </div>
  );
};

export default SkillsForm;
