import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResumeData } from "@/types/resume";
import { Download, FileText } from "lucide-react";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import { useToast } from "@/hooks/use-toast";

interface ResumePreviewProps {
  data: ResumeData;
  onTemplateChange?: (template: "modern" | "classic" | "minimal") => void;
}

const ResumePreview = ({ data, onTemplateChange }: ResumePreviewProps) => {
  const { toast } = useToast();

  const handleExport = async (format: "pdf" | "docx" | "html") => {
    toast({
      title: "Export started",
      description: `Generating ${format.toUpperCase()} file...`,
    });

    // This will be implemented with actual export functionality
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your resume has been downloaded as ${format.toUpperCase()}`,
      });
    }, 1500);
  };

  const renderTemplate = () => {
    switch (data.template) {
      case "modern":
        return <ModernTemplate data={data} />;
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <div className="p-4 border-b bg-muted/30 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Preview
          </h3>
          <Select
            value={data.template}
            onValueChange={(value: "modern" | "classic" | "minimal") => {
              onTemplateChange?.(value);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleExport("pdf")}
            size="sm"
            className="flex-1"
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button
            onClick={() => handleExport("docx")}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Export DOCX
          </Button>
        </div>
      </div>

      <div className="p-8 bg-white min-h-[800px] overflow-auto">
        {renderTemplate()}
      </div>
    </Card>
  );
};

export default ResumePreview;
