
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question, EvaluationStatus } from '@/types/department';

interface QuestionItemProps {
  item: Question;
  isExpanded: boolean;
  editingQuestion: string | null;
  questionText: string;
  applicableAnswer: string;
  evidenceAnswer: string;
  evaluation: EvaluationStatus;
  onToggle: (item: string) => void;
  onEditToggle: (item: string, question: string) => void;
  onQuestionTextChange: (text: string) => void;
  onSaveEdit: (item: string) => void;
  onCancelEdit: () => void;
  onApplicableChange: (item: string, value: string) => void;
  onEvidenceChange: (item: string, value: string) => void;
  onEvaluationChange: (item: string, value: EvaluationStatus) => void;
}

const QuestionItem = ({
  item,
  isExpanded,
  editingQuestion,
  questionText,
  applicableAnswer,
  evidenceAnswer,
  evaluation,
  onToggle,
  onEditToggle,
  onQuestionTextChange,
  onSaveEdit,
  onCancelEdit,
  onApplicableChange,
  onEvidenceChange,
  onEvaluationChange,
}: QuestionItemProps) => {
  const getScoreForEvaluation = (evaluation: EvaluationStatus): number => {
    switch (evaluation) {
      case "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)":
        return 7;
      case "EXISTE E FUNCIONA PERFEITAMENTE":
        return 10;
      case "NÃO EXISTE":
      default:
        return 0;
    }
  };

  return (
    <div className="border border-dashboard-border rounded-lg">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-dashboard-card-hover"
        onClick={() => onToggle(item.item)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-dashboard-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-dashboard-muted" />
          )}
          <span className="font-medium">
            {item.item} - {item.title}
          </span>
        </div>
      </div>

      {isExpanded && (
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
                  <Button
                    size="sm"
                    onClick={() => onSaveEdit(item.item)}
                  >
                    Salvar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancelEdit}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-4">
                <div className="text-sm flex-1">{item.question}</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditToggle(item.item, item.question)}
                >
                  Editar
                </Button>
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
              onValueChange={(value) => value && onApplicableChange(item.item, value)}
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
              onValueChange={(value) => value && onEvidenceChange(item.item, value)}
              className="justify-start"
            >
              <ToggleGroupItem value="SIM">SIM</ToggleGroupItem>
              <ToggleGroupItem value="NÃO">NÃO</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-secondary/20 p-4 rounded-lg">
            <div>
              <div className="text-sm font-medium text-dashboard-muted mb-2">Avaliação</div>
              <Select
                value={evaluation}
                onValueChange={(value: EvaluationStatus) => onEvaluationChange(item.item, value)}
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
              <div className="h-10 px-3 flex items-center border rounded-md bg-background">
                {getScoreForEvaluation(evaluation)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-dashboard-muted mb-2">Nota Máxima</div>
              <div className="h-10 px-3 flex items-center border rounded-md bg-background">
                10
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
