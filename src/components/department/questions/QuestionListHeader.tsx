
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface QuestionListHeaderProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const QuestionListHeader = ({ onImageUpload }: QuestionListHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-medium">Lista de Verificação</h3>
      <div>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="hidden"
          onChange={onImageUpload}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('imageUpload')?.click()}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Carregar Imagem
        </Button>
      </div>
    </div>
  );
};

export default QuestionListHeader;
