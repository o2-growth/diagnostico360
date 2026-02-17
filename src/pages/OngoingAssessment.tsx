
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '@/data/questions';
import SidePanel from '@/components/SidePanel';
import ProgressHeader from '@/components/assessment/ProgressHeader';
import QuestionContent from '@/components/assessment/QuestionContent';
import NavigationButtons from '@/components/assessment/NavigationButtons';
import { useAssessment } from '@/hooks/useAssessment';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';

const OngoingAssessment = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const navigate = useNavigate();
  
  const evaluationOptions = [
    "EXISTE E FUNCIONA PERFEITAMENTE",
    "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)",
    "NÃO EXISTE"
  ];

  const gateOptions = [
    "Sim, possui estruturada",
    "Possui parcialmente",
    "Não possui"
  ];
  
  const {
    currentQuestion,
    currentQuestionIndex,
    currentAnswer,
    answeredQuestions,
    progress,
    isLoading,
    isGateQuestion,
    currentGroup,
    skippedMessage,
    handleNext,
    handlePrevious,
    handleAnswerChange,
    handleSaveAndExit,
    getDepartmentFromQuestion,
    answeredCount,
    totalQuestions,
  } = useAssessment(questions);

  const handleTabChange = (value: string) => {};
  const handleMenuToggle = (isOpen: boolean) => setIsMenuExpanded(isOpen);

  const goToDepartment = () => {
    if (!currentQuestion) return;
    const departmentId = getDepartmentFromQuestion(currentQuestion.item);
    if (departmentId) navigate(`/department/${departmentId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <SidePanel onTabChange={handleTabChange} onMenuToggle={handleMenuToggle} />
        <div className={`transition-all duration-300 ${isMenuExpanded ? 'pl-64' : 'pl-16'}`}>
          <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-4" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between mt-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="dashboard-card p-8 flex flex-col min-h-[400px]">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-10 w-3/4 mb-8" />
              <div className="mt-8 space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-dashboard-muted">Carregando diagnóstico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={handleTabChange} onMenuToggle={handleMenuToggle} />
      <div className={`transition-all duration-300 ${isMenuExpanded ? 'pl-64' : 'pl-16'}`}>
        <div className="p-8 max-w-3xl mx-auto">
          <ProgressHeader
            currentQuestionIndex={answeredCount}
            totalQuestions={totalQuestions}
            progress={progress}
            questionId={currentQuestion.item}
            questionTitle={currentQuestion.title}
            onViewDepartment={goToDepartment}
          />

          {/* Skipped message overlay */}
          {skippedMessage && (
            <div className="dashboard-card p-8 flex flex-col items-center justify-center min-h-[400px] text-center animate-in fade-in">
              <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">{skippedMessage}</p>
            </div>
          )}

          {!skippedMessage && (
            <div className="dashboard-card p-8 flex flex-col min-h-[400px]">
              <QuestionContent
                questionId={currentQuestion.item}
                questionTitle={currentQuestion.title}
                question={currentQuestion.question}
                evidence={currentQuestion.evidence}
                currentAnswer={currentAnswer}
                onAnswerChange={handleAnswerChange}
                evaluationOptions={isGateQuestion ? gateOptions : evaluationOptions}
                isGateQuestion={isGateQuestion}
              />

              <NavigationButtons
                isFirstQuestion={currentQuestionIndex === 0}
                isLastQuestion={false}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSaveAndExit={handleSaveAndExit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OngoingAssessment;
