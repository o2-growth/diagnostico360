
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { questions } from '@/data/questions';
import { Radio } from '@/components/ui/radio-group';
import SidePanel from '@/components/SidePanel';
import { useToast } from '@/components/ui/use-toast';

const evaluationOptions = [
  "EXISTE E FUNCIONA PERFEITAMENTE",
  "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)",
  "NÃO EXISTE"
];

const Assessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  useEffect(() => {
    // Set current answer from stored answers if available
    if (answers[currentQuestion.item]) {
      setCurrentAnswer(answers[currentQuestion.item]);
    } else {
      setCurrentAnswer('');
    }
  }, [currentQuestionIndex, currentQuestion.item, answers]);

  const handleNext = () => {
    if (!currentAnswer) {
      toast({
        title: "Resposta necessária",
        description: "Por favor, selecione uma resposta antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    
    // Save current answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.item]: currentAnswer
    }));
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // All questions answered, redirect to dashboard
      toast({
        title: "Diagnóstico concluído!",
        description: "Todas as perguntas foram respondidas com sucesso.",
      });
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleTabChange = (value: string) => {
    // Tab change logic if needed
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
  };

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={handleTabChange} onMenuToggle={handleMenuToggle} />
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8 max-w-3xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-medium">Diagnóstico 360</h1>
              <div className="text-sm text-dashboard-muted">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </header>

          <div className="dashboard-card p-8 flex flex-col min-h-[400px]">
            {currentQuestion && (
              <div className="flex-1">
                <div className="mb-2 text-dashboard-accent3">
                  {currentQuestion.item} - {currentQuestion.title}
                </div>
                <h2 className="text-2xl font-medium mb-8">
                  {currentQuestion.question || currentQuestion.title}
                </h2>
                
                <div className="mt-8 space-y-4">
                  {evaluationOptions.map((option) => (
                    <div 
                      key={option} 
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        currentAnswer === option 
                          ? 'border-green-500 bg-green-500/10' 
                          : 'border-dashboard-border hover:border-dashboard-accent3'
                      }`}
                      onClick={() => handleAnswerChange(option)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          currentAnswer === option 
                            ? 'bg-green-500' 
                            : 'border border-dashboard-border'
                        }`} />
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {currentQuestion.evidence && (
                  <div className="mt-6 text-sm text-dashboard-muted">
                    <p>Evidências sugeridas:</p>
                    <p>{currentQuestion.evidence}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-gradient-to-r from-dashboard-accent3 to-green-400 hover:opacity-90"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
