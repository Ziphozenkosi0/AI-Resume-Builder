import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Education } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
  onNext: () => void;
}

const EducationForm = ({ data, onChange, onNext }: EducationFormProps) => {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <div className="space-y-4">
      {data.map((edu) => (
        <Card key={edu.id} className="p-4 space-y-4 border-muted">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">Education Entry</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label>Institution *</Label>
            <Input
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
              placeholder="University Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                placeholder="Bachelor of Science"
                required
              />
            </div>
            <div>
              <Label>Field of Study *</Label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                placeholder="ICT"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Start Year *</Label>
              <Input
                type="number"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                placeholder="2018"
                min="1950"
                max="2030"
                required
              />
            </div>
            <div>
              <Label>End Year *</Label>
              <Input
                type="number"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                placeholder="2022"
                min="1950"
                max="2030"
                required
              />
            </div>
            <div>
              <Label>GPA (Optional)</Label>
              <Input
                value={edu.gpa || ""}
                onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                placeholder="3.8"
              />
            </div>
          </div>
        </Card>
      ))}

      <Button
        variant="outline"
        onClick={addEducation}
        className="w-full border-dashed"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Education
      </Button>

      <Button onClick={onNext} className="w-full" disabled={data.length === 0}>
        Next: Skills
      </Button>
    </div>
  );
};

export default EducationForm;
