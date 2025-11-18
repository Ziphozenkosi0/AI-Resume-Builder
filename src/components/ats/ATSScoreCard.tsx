import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/types/resume";
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ATSScoreCardProps {
  resumeData: ResumeData;
}

const ATSScoreCard = ({ resumeData }: ATSScoreCardProps) => {
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    calculateScore();
  }, [resumeData]);

  const calculateScore = () => {
    let totalScore = 0;
    const newSuggestions: string[] = [];

    // Check personal info completeness (20 points)
    const { personalInfo } = resumeData;
    if (personalInfo.fullName && personalInfo.email && personalInfo.phone) {
      totalScore += 20;
    } else {
      newSuggestions.push("Complete all required personal information");
    }

    // Check professional summary (15 points)
    if (personalInfo.summary && personalInfo.summary.length > 50) {
      totalScore += 15;
    } else {
      newSuggestions.push("Add a professional summary (at least 50 characters)");
    }

    // Check experience section (30 points)
    if (resumeData.experiences.length >= 2) {
      totalScore += 30;
    } else if (resumeData.experiences.length === 1) {
      totalScore += 20;
      newSuggestions.push("Add more work experience entries for better ATS score");
    } else {
      newSuggestions.push("Add at least one work experience entry");
    }

    // Check experience details (10 points)
    const hasDetailedExperience = resumeData.experiences.some(
      (exp) => exp.description && exp.description.length > 100
    );
    if (hasDetailedExperience) {
      totalScore += 10;
    } else {
      newSuggestions.push("Add detailed descriptions to your work experience");
    }

    // Check education (15 points)
    if (resumeData.education.length > 0) {
      totalScore += 15;
    } else {
      newSuggestions.push("Add your education history");
    }

    // Check skills (10 points)
    if (resumeData.skills.length >= 5) {
      totalScore += 10;
    } else if (resumeData.skills.length > 0) {
      totalScore += 5;
      newSuggestions.push(`Add more skills (currently ${resumeData.skills.length}/5)`);
    } else {
      newSuggestions.push("Add relevant skills to improve your ATS score");
    }

    setScore(totalScore);
    setSuggestions(newSuggestions);
  };

  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = () => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent", icon: CheckCircle2 };
    if (score >= 60) return { variant: "secondary" as const, text: "Good", icon: TrendingUp };
    return { variant: "destructive" as const, text: "Needs Work", icon: AlertCircle };
  };

  const badge = getScoreBadge();
  const BadgeIcon = badge.icon;

  return (
    <Card className="p-6 shadow-lg border-0">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">ATS Compatibility Score</h3>
          <Badge variant={badge.variant} className="flex items-center gap-1">
            <BadgeIcon className="h-3 w-3" />
            {badge.text}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${getScoreColor()}`}>
              {score}%
            </span>
            <span className="text-sm text-muted-foreground">
              {score < 60 ? "Keep improving" : score < 80 ? "Almost there!" : "Great job!"}
            </span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Improvement Suggestions
            </h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            ATS (Applicant Tracking System) compatibility measures how well your
            resume can be parsed by automated systems used by employers.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ATSScoreCard;
