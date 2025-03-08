
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '@/data/questions';
import SidePanel from '@/components/SidePanel';
import ProgressHeader from '@/components/assessment/ProgressHeader';
import QuestionContent from '@/components/assessment/QuestionContent';
import NavigationButtons from '@/components/assessment/NavigationButtons';
import { useAssessment } from '@/hooks/useAssessment';
import { Skeleton } from '@/components/ui/skeleton';

const OngoingAssessment = () => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const navigate = useNavigate();
  
  const evaluationOptions = [
    "EXISTE E FUNCIONA PERFEITAMENTE",
    "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)",
    "NÃO EXISTE"
  ];
  
  const {
    currentQuestion,
    currentQuestionIndex,
    currentAnswer,
    answeredQuestions,
    progress,
    isLoading,
    handleNext,
    handlePrevious,
    handleAnswerChange,
    handleSaveAndExit,
    getDepartmentFromQuestion
  } = useAssessment(questions);

  const handleTabChange = (value: string) => {
    // Tab change logic if needed
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
  };

  const goToDepartment = () => {
    if (!currentQuestion) return;
    
    // Determine department from question ID
    const departmentId = getDepartmentFromQuestion(currentQuestion.item);
    if (departmentId) {
      navigate(`/department/${departmentId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <SidePanel onTabChange={handleTabChange} onMenuToggle={handleMenuToggle} />
        <div 
          className={`transition-all duration-300 ${
            isMenuExpanded ? 'pl-64' : 'pl-16'
          }`}
        >
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
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8 max-w-3xl mx-auto">
          <ProgressHeader
            currentQuestionIndex={answeredQuestions.length}
            totalQuestions={questions.length}
            progress={progress}
            questionId={currentQuestion.item}
            questionTitle={currentQuestion.title}
            onViewDepartment={goToDepartment}
          />

          <div className="dashboard-card p-8 flex flex-col min-h-[400px]">
            <QuestionContent
              questionId={currentQuestion.item}
              questionTitle={currentQuestion.title}
              question={currentQuestion.question}
              evidence={currentQuestion.evidence}
              currentAnswer={currentAnswer}
              onAnswerChange={handleAnswerChange}
              evaluationOptions={evaluationOptions}
            />

            <NavigationButtons
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSaveAndExit={handleSaveAndExit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OngoingAssessment;

