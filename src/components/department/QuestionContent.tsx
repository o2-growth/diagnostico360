
import { Question, EvaluationStatus } from '@/types/department';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionContentProps {
  item: Question;
  editingQuestion: string | null;
  questionText: string;
  applicableAnswer: string;
  evidenceAnswer: string;
  evaluation: EvaluationStatus;
  score: number;
  onQuestionTextChange: (value: string) => void;
  onApplicableChange: (value: string) => void;
  onEvidenceChange: (value: string) => void;
  onEvaluationChange: (value: EvaluationStatus) => void;
  onScoreChange: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const QuestionContent = ({
  item,
  editingQuestion,
  questionText,
  applicableAnswer,
  evidenceAnswer,
  evaluation,
  score,
  onQuestionTextChange,
  onApplicableChange,
  onEvidenceChange,
  onEvaluationChange,
  onScoreChange,
  onEdit,
  onSave,
  onCancel,
}: QuestionContentProps) => {
  return (
    <div className="p-4 border-t border-dashboard-border space-y-4">
      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-1">Pergunta</div>
        {editingQuestion === item.item ? (
          <div className="space-y-2">
            <Textarea
              value={questionText}
              onChange={(e) => onQuestionTextChange(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onSave}>Salvar</Button>
              <Button size="sm" variant="outline" onClick={onCancel}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start gap-4">
            <div className="text-sm flex-1">{item.question}</div>
            <Button size="sm" variant="outline" onClick={onEdit}>Editar</Button>
          </div>
        )}
      </div>

      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-1">
          É aplicável nessa unidade?
        </div>
        <ToggleGroup
          type="single"
          value={applicableAnswer}
          onValueChange={(value) => value && onApplicableChange(value)}
          className="justify-start"
        >
          <ToggleGroupItem value="SIM">SIM</ToggleGroupItem>
          <ToggleGroupItem value="NÃO">NÃO</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {item.application.length > 0 && (
        <div>
          <div className="text-sm font-medium text-dashboard-muted mb-1">
            Forma de Aplicação
          </div>
          <ul className="list-disc pl-4 text-sm">
            {item.application.map((app, index) => (
              <li key={index}>{app}</li>
            ))}
          </ul>
        </div>
      )}

      {item.evidence && (
        <div>
          <div className="text-sm font-medium text-dashboard-muted mb-1">Evidências</div>
          <div className="text-sm">{item.evidence}</div>
        </div>
      )}

      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-1">
          Existe evidência?
        </div>
        <ToggleGroup
          type="single"
          value={evidenceAnswer}
          onValueChange={(value) => value && onEvidenceChange(value)}
          className="justify-start"
        >
          <ToggleGroupItem value="SIM">SIM</ToggleGroupItem>
          <ToggleGroupItem value="NÃO">NÃO</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg">
        <div>
          <div className="text-sm font-medium text-dashboard-muted mb-2">Avaliação</div>
          <Select
            value={evaluation}
            onValueChange={(value: EvaluationStatus) => onEvaluationChange(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)">
                EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)
              </SelectItem>
              <SelectItem value="NÃO EXISTE">
                NÃO EXISTE
              </SelectItem>
              <SelectItem value="EXISTE E FUNCIONA PERFEITAMENTE">
                EXISTE E FUNCIONA PERFEITAMENTE
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-sm font-medium text-dashboard-muted mb-2">Nota Avaliação</div>
          <Input
            type="number"
            min="0"
            max="10"
            value={score}
            onChange={(e) => onScoreChange(e.target.value)}
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionContent;

