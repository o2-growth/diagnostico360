
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, EvaluationStatus } from '@/types/department';
import { useToast } from '@/components/ui/use-toast';

export const useAssessment = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
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
  }, [toast, questions]);

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

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
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

  return {
    currentQuestion,
    currentQuestionIndex,
    currentAnswer,
    answeredQuestions,
    progress,
    handleNext,
    handlePrevious,
    handleAnswerChange,
    handleSaveAndExit,
    getDepartmentFromQuestion
  };
};
