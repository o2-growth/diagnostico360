
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Question } from "@/types/department";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ExportRecommendationsButtonProps {
  questions: Question[];
  recommendations: Record<string, string>;
  departmentName?: string;
}

const ExportRecommendationsButton = ({ 
  questions, 
  recommendations,
  departmentName 
}: ExportRecommendationsButtonProps) => {
  const { toast } = useToast();

  const exportRecommendationsAsPdf = async () => {
    try {
      const criticalItems = questions.filter(question => 
        question.evaluation === "NÃO EXISTE" || 
        question.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
      );
      
      if (criticalItems.length === 0) {
        toast({
          title: "Aviso",
          description: "Não há recomendações para exportar.",
        });
        return;
      }

      const pdf = new jsPDF();
      const title = `Recomendações - ${departmentName || 'Departamento'}`;
      
      pdf.setFontSize(18);
      pdf.text(title, 14, 20);
      
      let yPosition = 40;
      
      criticalItems.forEach((item, index) => {
        if (yPosition > 260) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(12);
        pdf.text(`${item.item} - ${item.title}`, 14, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.text(`Status: ${item.evaluation}`, 14, yPosition);
        yPosition += 12;
        
        if (recommendations[item.item]) {
          pdf.text("Recomendação:", 14, yPosition);
          yPosition += 6;
          
          const recommendationText = recommendations[item.item];
          const textLines = pdf.splitTextToSize(recommendationText, 180);
          pdf.text(textLines, 14, yPosition);
          yPosition += textLines.length * 6 + 10;
        } else {
          pdf.text("Sem recomendações registradas", 14, yPosition);
          yPosition += 16;
        }
        
        if (index < criticalItems.length - 1) {
          pdf.setDrawColor(200, 200, 200);
          pdf.line(14, yPosition - 6, 196, yPosition - 6);
        }
      });
      
      pdf.save(`recomendacoes-${departmentName || 'departamento'}.pdf`);
      
      toast({
        title: "Sucesso",
        description: "Recomendações exportadas com sucesso para PDF",
      });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar as recomendações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      onClick={exportRecommendationsAsPdf}
      className="gap-2"
    >
      <FileText className="h-4 w-4" />
      Exportar Recomendações
    </Button>
  );
};

export default ExportRecommendationsButton;
