
import { Progress } from '@/components/ui/progress';

interface ProgressHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
  questionId: string;
  questionTitle: string;
  onViewDepartment: () => void;
}

const ProgressHeader = ({
  currentQuestionIndex,
  totalQuestions,
  progress,
  questionId,
  questionTitle,
  onViewDepartment
}: ProgressHeaderProps) => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-medium">Diagnóstico em Andamento</h1>
        <div className="text-sm text-dashboard-muted">
          {currentQuestionIndex} de {totalQuestions} respondidas
        </div>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between mt-3">
        <p className="text-sm text-dashboard-muted">
          Questão atual: {currentQuestionIndex + 1} de {totalQuestions}
        </p>
        <p className="text-sm text-dashboard-accent3 cursor-pointer hover:underline" onClick={onViewDepartment}>
          Ver na área completa
        </p>
      </div>
    </header>
  );
};

export default ProgressHeader;
