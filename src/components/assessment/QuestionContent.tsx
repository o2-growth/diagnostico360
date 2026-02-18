
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface QuestionContentProps {
  questionId: string;
  questionTitle: string;
  question: string;
  evidence?: string;
  currentAnswer: string;
  onAnswerChange: (value: string) => void;
  evaluationOptions: string[];
  isGateQuestion?: boolean;
}

const QuestionContent = ({
  questionId,
  questionTitle,
  question,
  evidence,
  currentAnswer,
  onAnswerChange,
  evaluationOptions,
  isGateQuestion = false,
}: QuestionContentProps) => {
  return (
    <div className="flex-1">
      <div className="mb-2 text-sm font-medium text-dashboard-accent3 tracking-wide">
        {isGateQuestion ? `Área: ${questionTitle}` : `${questionId} - ${questionTitle}`}
      </div>
      <h2 className="text-2xl font-medium mb-8">
        {question || questionTitle}
      </h2>

      <div className="mt-8 space-y-3">
        <RadioGroup
          value={currentAnswer}
          onValueChange={onAnswerChange}
          className="space-y-3"
        >
          {evaluationOptions.map((option) => (
            <div
              key={option}
              onClick={() => onAnswerChange(option)}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                currentAnswer === option
                  ? 'border-dashboard-accent3 bg-dashboard-accent3/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center">
                <RadioGroupItem value={option} id={`option-${option}`} className="mr-3" />
                <label htmlFor={`option-${option}`} className="cursor-pointer w-full">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {evidence && (
        <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm font-medium text-dashboard-muted mb-1">Evidências sugeridas:</p>
          <p className="text-sm text-dashboard-text">{evidence}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionContent;
