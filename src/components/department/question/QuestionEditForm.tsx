
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface QuestionEditFormProps {
  questionText: string;
  onSetQuestionText: (text: string) => void;
  onSaveEdit: (item: string) => void;
  onCancelEdit: () => void;
  itemId: string;
}

const QuestionEditForm = ({
  questionText,
  onSetQuestionText,
  onSaveEdit,
  onCancelEdit,
  itemId,
}: QuestionEditFormProps) => {
  return (
    <div className="space-y-2">
      <Textarea
        value={questionText}
        onChange={(e) => onSetQuestionText(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSaveEdit(itemId)}>
          Salvar
        </Button>
        <Button size="sm" variant="outline" onClick={onCancelEdit}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default QuestionEditForm;
