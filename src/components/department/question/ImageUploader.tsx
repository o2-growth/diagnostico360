
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ImageUploader = () => {
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Sucesso",
        description: "Imagem carregada com sucesso",
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
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
  );
};

export default ImageUploader;
