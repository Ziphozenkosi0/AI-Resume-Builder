import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeData } from "@/types/resume";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ResumePreview from "./preview/ResumePreview";
import ATSScoreCard from "./ats/ATSScoreCard";
import { useToast } from "@/hooks/use-toast";
import { loadResumeData, saveResumeData } from "@/utils/localStorage";

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const saved = loadResumeData();
    return saved || {
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      experiences: [],
      education: [],
      skills: [],
      template: "modern",
    };
  });

  useEffect(() => {
    saveResumeData(resumeData);
  }, [resumeData]);

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleNext = () => {
    const tabs = ["personal", "experience", "education", "skills"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Resume Builder
          </h1>
          <p className="text-muted-foreground">
            Create ATS-optimized resumes with intelligent suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="shadow-lg border-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="p-6">
                  <PersonalInfoForm
                    data={resumeData.personalInfo}
                    onChange={(data) => updateResumeData("personalInfo", data)}
                    onNext={handleNext}
                  />
                </TabsContent>

                <TabsContent value="experience" className="p-6">
                  <ExperienceForm
                    data={resumeData.experiences}
                    onChange={(data) => updateResumeData("experiences", data)}
                    onNext={handleNext}
                  />
                </TabsContent>

                <TabsContent value="education" className="p-6">
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => updateResumeData("education", data)}
                    onNext={handleNext}
                  />
                </TabsContent>

                <TabsContent value="skills" className="p-6">
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) => updateResumeData("skills", data)}
                  />
                </TabsContent>
              </Tabs>
            </Card>

            <ATSScoreCard resumeData={resumeData} />
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <ResumePreview 
              data={resumeData} 
              onTemplateChange={(template) => updateResumeData("template", template)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
