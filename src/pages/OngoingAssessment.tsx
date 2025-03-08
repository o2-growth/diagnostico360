
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { questions } from '@/data/questions';
import { Radio, RadioGroup, RadioItem } from '@/components/ui/radio-group';
import SidePanel from '@/components/SidePanel';
import { useToast } from '@/components/ui/use-toast';
import { EvaluationStatus } from '@/types/department';

const OngoingAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((answeredQuestions.length) / questions.length) * 100;
  
  // Load answered questions from localStorage
  useEffect(() => {
    try {
      const storedAnswers = localStorage.getItem('departmentAnswers');
      if (storedAnswers) {
        const parsedAnswers = JSON.parse(storedAnswers);
        const answeredQuestionIds = Object.keys(parsedAnswers);
        setAnsweredQuestions(answeredQuestionIds);
        
        // Find first unanswered question
        if (answeredQuestionIds.length > 0 && answeredQuestionIds.length < questions.length) {
          const unansweredIndex = questions.findIndex(q => !answeredQuestionIds.includes(q.item));
          if (unansweredIndex !== -1) {
            setCurrentQuestionIndex(unansweredIndex);
          }
        }
      }
    } catch (error) {
      console.error("Error loading stored answers:", error);
      toast({
        title: "Erro ao carregar respostas",
        description: "Não foi possível carregar suas respostas anteriores.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Update current answer when question changes
  useEffect(() => {
    if (!currentQuestion) return;
    
    try {
      const storedAnswers = localStorage.getItem('departmentAnswers');
      if (storedAnswers) {
        const parsedAnswers = JSON.parse(storedAnswers);
        if (parsedAnswers[currentQuestion.item] && parsedAnswers[currentQuestion.item].evaluation) {
          setCurrentAnswer(parsedAnswers[currentQuestion.item].evaluation || '');
        } else {
          setCurrentAnswer('');
        }
      } else {
        setCurrentAnswer('');
      }
    } catch (error) {
      console.error("Error loading answer for current question:", error);
      setCurrentAnswer('');
    }
  }, [currentQuestionIndex, currentQuestion]);

  const evaluationOptions = [
    "EXISTE E FUNCIONA PERFEITAMENTE",
    "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)",
    "NÃO EXISTE"
  ];

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
    saveAnswer();
    
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
      // Save current answer before navigating
      if (currentAnswer) {
        saveAnswer();
      }
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const saveAnswer = () => {
    if (!currentQuestion || !currentAnswer) return;
    
    try {
      // Add to answered questions if not already there
      if (!answeredQuestions.includes(currentQuestion.item)) {
        setAnsweredQuestions(prev => [...prev, currentQuestion.item]);
      }
      
      // Save to localStorage
      const storedAnswers = localStorage.getItem('departmentAnswers') || '{}';
      const parsedAnswers = JSON.parse(storedAnswers);
      
      parsedAnswers[currentQuestion.item] = {
        ...parsedAnswers[currentQuestion.item],
        evaluation: currentAnswer as EvaluationStatus,
        // Add other default properties if needed
        applicable: "SIM",
        hasEvidence: "NÃO",
        score: 0
      };
      
      localStorage.setItem('departmentAnswers', JSON.stringify(parsedAnswers));
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.item]: currentAnswer
      }));
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({
        title: "Erro ao salvar resposta",
        description: "Não foi possível salvar sua resposta.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleSaveAndExit = () => {
    if (currentAnswer) {
      saveAnswer();
    }
    
    toast({
      title: "Progresso salvo",
      description: `Você respondeu ${answeredQuestions.length} de ${questions.length} perguntas.`,
    });
    
    navigate('/');
  };

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

  const getDepartmentFromQuestion = (questionId: string): string | null => {
    const prefix = questionId.charAt(0);
    switch (prefix) {
      case '1': return 'societario';
      case '2': return 'tecnologia';
      case '3': return 'comercial';
      case '4': return 'marketing';
      case '5': return 'financeiro';
      case '6': return 'controladoria';
      case '7': return 'fiscal';
      case '8': return 'contabil';
      case '9': return 'capital-humano';
      case '0': 
        if (questionId.startsWith('10')) return 'planejamento';
        return null;
      default: return null;
    }
  };

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
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-medium">Diagnóstico em Andamento</h1>
              <div className="text-sm text-dashboard-muted">
                {answeredQuestions.length} de {questions.length} respondidas
              </div>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-3">
              <p className="text-sm text-dashboard-muted">
                Questão atual: {currentQuestionIndex + 1} de {questions.length}
              </p>
              <p className="text-sm text-dashboard-accent3 cursor-pointer hover:underline" onClick={goToDepartment}>
                Ver na área completa
              </p>
            </div>
          </header>

          <div className="dashboard-card p-8 flex flex-col min-h-[400px]">
            <div className="flex-1">
              <div className="mb-2 text-dashboard-accent3">
                {currentQuestion.item} - {currentQuestion.title}
              </div>
              <h2 className="text-2xl font-medium mb-8">
                {currentQuestion.question || currentQuestion.title}
              </h2>
              
              <div className="mt-8 space-y-4">
                <RadioGroup
                  value={currentAnswer}
                  onValueChange={handleAnswerChange}
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
              
              {currentQuestion.evidence && (
                <div className="mt-6 text-sm text-dashboard-muted">
                  <p>Evidências sugeridas:</p>
                  <p>{currentQuestion.evidence}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveAndExit}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar e Sair
                </Button>
              </div>
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

export default OngoingAssessment;
