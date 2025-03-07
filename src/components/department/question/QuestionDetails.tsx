
import { Question, EvaluationStatus } from '@/types/department';
import { Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

interface QuestionDetailsProps {
  item: Question;
  editingQuestion: string | null;
  questionText: string;
  isEditMode: boolean;
  isEdited: boolean;
  applicableAnswer: string;
  evidenceAnswer: string;
  evaluation: EvaluationStatus;
  score: number;
  onSetQuestionText: (text: string) => void;
  onEditClick: (item: string, currentQuestion: string) => void;
  onSaveEdit: (item: string) => void;
  onCancelEdit: () => void;
  onApplicableChange: (item: string, value: string) => void;
  onEvidenceChange: (item: string, value: string) => void;
  onEvaluationChange: (item: string, value: EvaluationStatus) => void;
  onScoreChange: (item: string, value: string) => void;
}

const QuestionDetails = ({
  item,
  editingQuestion,
  questionText,
  isEditMode,
  isEdited,
  applicableAnswer,
  evidenceAnswer,
  evaluation,
  score,
  onSetQuestionText,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  onApplicableChange,
  onEvidenceChange,
  onEvaluationChange,
  onScoreChange
}: QuestionDetailsProps) => {
  return (
    <div className="p-4 border-t border-dashboard-border space-y-4">
      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-1">Pergunta</div>
        {editingQuestion === item.item ? (
          <div className="space-y-2">
            <Textarea
              value={questionText}
              onChange={(e) => onSetQuestionText(e.target.value)}
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
            {isEditMode && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditClick(item.item, item.question)}
              >
                Editar
              </Button>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-1">
          É aplicável nessa unidade?
        </div>
        <RadioGroup 
          value={applicableAnswer}
          onValueChange={(value) => onApplicableChange(item.item, value)}
          className="flex space-x-4"
          disabled={!isEditMode}
        >
          <div className="flex items-center space-x-2">
            <RadioItem value="SIM" id={`aplicavel-sim-${item.item}`} />
            <label htmlFor={`aplicavel-sim-${item.item}`} className="text-sm">SIM</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioItem value="NÃO" id={`aplicavel-nao-${item.item}`} />
            <label htmlFor={`aplicavel-nao-${item.item}`} className="text-sm">NÃO</label>
          </div>
        </RadioGroup>
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
        <RadioGroup 
          value={evidenceAnswer}
          onValueChange={(value) => onEvidenceChange(item.item, value)}
          className="flex space-x-4"
          disabled={!isEditMode}
        >
          <div className="flex items-center space-x-2">
            <RadioItem value="SIM" id={`evidencia-sim-${item.item}`} />
            <label htmlFor={`evidencia-sim-${item.item}`} className="text-sm">SIM</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioItem value="NÃO" id={`evidencia-nao-${item.item}`} />
            <label htmlFor={`evidencia-nao-${item.item}`} className="text-sm">NÃO</label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg">
        <div>
          <div className="text-sm font-medium text-dashboard-muted mb-2">Avaliação</div>
          <Select
            value={evaluation}
            onValueChange={(value: EvaluationStatus) => onEvaluationChange(item.item, value)}
            disabled={!isEditMode}
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
            min={0}
            max={10}
            value={score}
            onChange={(e) => onScoreChange(item.item, e.target.value)}
            className="w-full"
            disabled={!isEditMode}
          />
        </div>
      </div>
      
      {isEdited && isEditMode && (
        <div className="bg-green-500/10 p-2 rounded text-sm mt-4">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            <span>Alterações pendentes. Clique em Salvar para confirmar.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
