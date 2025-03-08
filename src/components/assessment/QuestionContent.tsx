
import { Radio, RadioGroup, RadioItem } from '@/components/ui/radio-group';
import { EvaluationStatus } from '@/types/department';

interface QuestionContentProps {
  questionId: string;
  questionTitle: string;
  question: string;
  evidence?: string;
  currentAnswer: string;
  onAnswerChange: (value: string) => void;
  evaluationOptions: string[];
}

const QuestionContent = ({
  questionId,
  questionTitle,
  question,
  evidence,
  currentAnswer,
  onAnswerChange,
  evaluationOptions
}: QuestionContentProps) => {
  return (
    <div className="flex-1">
      <div className="mb-2 text-dashboard-accent3">
        {questionId} - {questionTitle}
      </div>
      <h2 className="text-2xl font-medium mb-8">
        {question || questionTitle}
      </h2>
      
      <div className="mt-8 space-y-4">
        <RadioGroup
          value={currentAnswer}
          onValueChange={onAnswerChange}
          className="space-y-4"
        >
          {evaluationOptions.map((option) => (
            <div 
              key={option} 
              className={`p-4 border rounded-md cursor-pointer transition-all ${
                currentAnswer === option 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-dashboard-border hover:border-dashboard-accent3'
              }`}
            >
              <div className="flex items-center">
                <RadioItem value={option} id={`option-${option}`} className="mr-3" />
                <label htmlFor={`option-${option}`} className="cursor-pointer w-full">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      {evidence && (
        <div className="mt-6 text-sm text-dashboard-muted">
          <p>Evidências sugeridas:</p>
          <p>{evidence}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionContent;
