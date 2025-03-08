
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

interface ApplicableQuestionProps {
  applicableAnswer: string;
  isEditMode: boolean;
  itemId: string;
  onApplicableChange: (item: string, value: string) => void;
}

const ApplicableQuestion = ({
  applicableAnswer,
  isEditMode,
  itemId,
  onApplicableChange,
}: ApplicableQuestionProps) => {
  return (
    <div>
      <div className="text-sm font-medium text-dashboard-muted mb-1">
        É aplicável nessa unidade?
      </div>
      <RadioGroup 
        value={applicableAnswer}
        onValueChange={(value) => onApplicableChange(itemId, value)}
        className="flex space-x-4"
        disabled={!isEditMode}
      >
        <div className="flex items-center space-x-2">
          <RadioItem value="SIM" id={`aplicavel-sim-${itemId}`} />
          <label htmlFor={`aplicavel-sim-${itemId}`} className="text-sm">SIM</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioItem value="NÃO" id={`aplicavel-nao-${itemId}`} />
          <label htmlFor={`aplicavel-nao-${itemId}`} className="text-sm">NÃO</label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ApplicableQuestion;
