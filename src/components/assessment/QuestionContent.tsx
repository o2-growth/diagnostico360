
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

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

const gateIcons: Record<string, React.ReactNode> = {
  'Sim, possui estruturada': <CheckCircle2 className="h-5 w-5 text-green-500" />,
  'Possui parcialmente': <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  'Não possui': <XCircle className="h-5 w-5 text-red-500" />,
};

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
  if (isGateQuestion) {
    return (
      <div className="flex-1 flex flex-col items-center text-center">
        <div className="mb-4 p-4 rounded-full bg-primary/10">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">{questionTitle}</h2>
        <p className="text-muted-foreground mb-10 text-lg">
          {question}
        </p>
        
        <RadioGroup
          value={currentAnswer}
          onValueChange={onAnswerChange}
          className="w-full max-w-md space-y-3"
        >
          {evaluationOptions.map((option) => (
            <div 
              key={option} 
              className={`p-5 border-2 rounded-lg cursor-pointer transition-all ${
                currentAnswer === option 
                  ? option === 'Não possui'
                    ? 'border-red-500 bg-red-500/10'
                    : option === 'Possui parcialmente'
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-green-500 bg-green-500/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => onAnswerChange(option)}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={option} id={`gate-${option}`} />
                {gateIcons[option]}
                <label htmlFor={`gate-${option}`} className="cursor-pointer w-full text-left font-medium">
                  {option}
                </label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

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
              onClick={() => onAnswerChange(option)}
              className={`p-4 border rounded-md cursor-pointer transition-all ${
                currentAnswer === option 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-dashboard-border hover:border-dashboard-accent3'
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
        <div className="mt-6 text-sm text-dashboard-muted">
          <p>Evidências sugeridas:</p>
          <p>{evidence}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionContent;
