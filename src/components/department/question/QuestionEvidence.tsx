
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

interface QuestionEvidenceProps {
  evidence?: string;
  evidenceAnswer: string;
  isEditMode: boolean;
  itemId: string;
  onEvidenceChange: (item: string, value: string) => void;
}

const QuestionEvidence = ({
  evidence,
  evidenceAnswer,
  isEditMode,
  itemId,
  onEvidenceChange,
}: QuestionEvidenceProps) => {
  return (
    <>
      {evidence && (
        <div>
          <div className="text-sm font-medium text-dashboard-muted mb-1">Evidências</div>
          <div className="text-sm">{evidence}</div>
        </div>
      )}

      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-1">
          Existe evidência?
        </div>
        <RadioGroup 
          value={evidenceAnswer}
          onValueChange={(value) => onEvidenceChange(itemId, value)}
          className="flex space-x-4"
          disabled={!isEditMode}
        >
          <div className="flex items-center space-x-2">
            <RadioItem value="SIM" id={`evidencia-sim-${itemId}`} />
            <label htmlFor={`evidencia-sim-${itemId}`} className="text-sm">SIM</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioItem value="NÃO" id={`evidencia-nao-${itemId}`} />
            <label htmlFor={`evidencia-nao-${itemId}`} className="text-sm">NÃO</label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default QuestionEvidence;
