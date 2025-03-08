
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportQuestionsAsPdf } from "@/utils/exportToPdf";
import { Question } from "@/types/department";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  questions: Question[];
  departmentName?: string;
}

const ExportButton = ({ questions, departmentName }: ExportButtonProps) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      await exportQuestionsAsPdf(questions, departmentName);
      toast({
        title: "Sucesso",
        description: "Perguntas exportadas com sucesso para PDF",
      });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar as perguntas. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className="gap-2"
    >
      <FileText className="h-4 w-4" />
      Exportar PDF
    </Button>
  );
};

export default ExportButton;
