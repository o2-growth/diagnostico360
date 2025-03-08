
import { EvaluationStatus } from '@/types/department';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EvaluationSectionProps {
  evaluation: EvaluationStatus;
  score: number;
  isEditMode: boolean;
  itemId: string;
  onEvaluationChange: (item: string, value: EvaluationStatus) => void;
  onScoreChange: (item: string, value: string) => void;
}

const EvaluationSection = ({
  evaluation,
  score,
  isEditMode,
  itemId,
  onEvaluationChange,
  onScoreChange,
}: EvaluationSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg">
      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-2">Avaliação</div>
        <Select
          value={evaluation}
          onValueChange={(value: EvaluationStatus) => onEvaluationChange(itemId, value)}
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
          onChange={(e) => onScoreChange(itemId, e.target.value)}
          className="w-full"
          disabled={!isEditMode}
        />
      </div>
    </div>
  );
};

export default EvaluationSection;
