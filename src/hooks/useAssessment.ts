import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, EvaluationStatus } from '@/types/department';
import { questionGroups, QuestionGroup } from '@/data/questions';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateScores } from '@/utils/scoreCalculator';

export type GateAnswer = 'sim' | 'parcialmente' | 'nao' | null;

interface AssessmentStep {
  type: 'gate' | 'question';
  group: QuestionGroup;
  question?: Question; // only for type 'question'
}

const GATE_STORAGE_KEY = 'departmentGates';
const ANSWERS_STORAGE_KEY = 'departmentAnswers';

function loadGates(): Record<string, GateAnswer> {
  try {
    const stored = localStorage.getItem(GATE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveGates(gates: Record<string, GateAnswer>) {
  localStorage.setItem(GATE_STORAGE_KEY, JSON.stringify(gates));
}

function buildSteps(gates: Record<string, GateAnswer>): AssessmentStep[] {
  const steps: AssessmentStep[] = [];
  for (const group of questionGroups) {
    steps.push({ type: 'gate', group });
    // Only include individual questions if gate wasn't 'nao'
    if (gates[group.id] !== 'nao') {
      for (const q of group.questions) {
        steps.push({ type: 'question', group, question: q });
      }
    }
  }
  return steps;
}

export const useAssessment = (allQuestions: Question[]) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [gates, setGates] = useState<Record<string, GateAnswer>>(loadGates);
  const [isLoading, setIsLoading] = useState(true);
  const [skippedMessage, setSkippedMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = useMemo(() => buildSteps(gates), [gates]);
  const currentStep = steps[currentStepIndex];
  const totalQuestions = allQuestions.length;

  // Count all answered + skipped questions for progress
  const answeredCount = useMemo(() => {
    const answered = new Set(answeredQuestions);
    // Add skipped groups' questions
    for (const group of questionGroups) {
      if (gates[group.id] === 'nao') {
        group.questions.forEach(q => answered.add(q.item));
      }
    }
    return answered.size;
  }, [answeredQuestions, gates]);

  const progress = (answeredCount / totalQuestions) * 100;

  // Build a "currentQuestion" compatible object for the UI
  const currentQuestion = currentStep?.type === 'question' 
    ? currentStep.question! 
    : currentStep?.type === 'gate' 
      ? { 
          item: `gate-${currentStep.group.id}`,
          title: currentStep.group.name,
          question: `A empresa possui a área de ${currentStep.group.name} estruturada?`,
          applicable: 'SIM',
          application: [],
          evidence: '',
          hasEvidence: 'NÃO',
        } as Question
      : null;

  const isGateQuestion = currentStep?.type === 'gate';
  const currentGroup = currentStep?.group;

  // Load initial state
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedAnswers = localStorage.getItem(ANSWERS_STORAGE_KEY);
      if (storedAnswers) {
        const parsed = JSON.parse(storedAnswers);
        setAnsweredQuestions(Object.keys(parsed));
      }
      
      const storedGates = loadGates();
      setGates(storedGates);
      
      // Find first unanswered step
      const currentSteps = buildSteps(storedGates);
      const storedAnswersParsed = storedAnswers ? JSON.parse(storedAnswers) : {};
      const answeredIds = Object.keys(storedAnswersParsed);
      
      let startIndex = 0;
      for (let i = 0; i < currentSteps.length; i++) {
        const step = currentSteps[i];
        if (step.type === 'gate') {
          if (storedGates[step.group.id] == null) {
            startIndex = i;
            break;
          }
        } else if (step.type === 'question') {
          if (!answeredIds.includes(step.question!.item)) {
            startIndex = i;
            break;
          }
        }
        startIndex = i + 1; // all answered, go to end
      }
      
      setCurrentStepIndex(Math.min(startIndex, currentSteps.length - 1));
    } catch (error) {
      console.error("Error loading stored state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update current answer when step changes
  useEffect(() => {
    if (!currentStep) return;
    setSkippedMessage(null);
    
    if (currentStep.type === 'gate') {
      const gateVal = gates[currentStep.group.id];
      if (gateVal === 'sim') setCurrentAnswer('Sim, possui estruturada');
      else if (gateVal === 'parcialmente') setCurrentAnswer('Possui parcialmente');
      else if (gateVal === 'nao') setCurrentAnswer('Não possui');
      else setCurrentAnswer('');
    } else {
      try {
        const stored = localStorage.getItem(ANSWERS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const answer = parsed[currentStep.question!.item];
          setCurrentAnswer(answer?.evaluation || '');
        } else {
          setCurrentAnswer('');
        }
      } catch { setCurrentAnswer(''); }
    }
  }, [currentStepIndex, currentStep]);

  const handleAnswerChange = (value: string) => {
    setCurrentAnswer(value);
  };

  const skipGroupQuestions = (group: QuestionGroup) => {
    try {
      const stored = localStorage.getItem(ANSWERS_STORAGE_KEY) || '{}';
      const parsed = JSON.parse(stored);
      
      const skippedItems: string[] = [];
      for (const q of group.questions) {
        parsed[q.item] = {
          evaluation: "NÃO EXISTE" as EvaluationStatus,
          applicable: "SIM",
          hasEvidence: "NÃO",
          score: 0,
          skippedByGate: true,
        };
        skippedItems.push(q.item);
      }
      
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(parsed));
      setAnsweredQuestions(prev => [...new Set([...prev, ...skippedItems])]);
    } catch (error) {
      console.error("Error skipping group:", error);
    }
  };

  const saveQuestionAnswer = () => {
    if (!currentStep || currentStep.type !== 'question' || !currentAnswer) return;
    const q = currentStep.question!;
    
    try {
      if (!answeredQuestions.includes(q.item)) {
        setAnsweredQuestions(prev => [...prev, q.item]);
      }
      
      const stored = localStorage.getItem(ANSWERS_STORAGE_KEY) || '{}';
      const parsed = JSON.parse(stored);
      parsed[q.item] = {
        ...parsed[q.item],
        evaluation: currentAnswer as EvaluationStatus,
        applicable: "SIM",
        hasEvidence: "NÃO",
        score: 0,
      };
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.error("Error saving answer:", error);
      toast({ title: "Erro ao salvar resposta", variant: "destructive" });
    }
  };

  const saveSnapshotToDb = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Erro ao salvar snapshot", description: "Usuário não autenticado.", variant: "destructive" });
        return;
      }
      const { departmentScores, overallScore } = calculateScores();
      const { error } = await supabase.from('assessment_snapshots').insert({
        user_id: user.id,
        overall_score: overallScore,
        department_scores: departmentScores,
      } as any);
      if (error) {
        console.error('Snapshot insert error:', error);
        toast({ title: "Erro ao salvar snapshot", description: error.message, variant: "destructive" });
      }
    } catch (error) {
      console.error('Error saving snapshot:', error);
      toast({ title: "Erro ao salvar snapshot", description: "Falha inesperada ao salvar o diagnóstico.", variant: "destructive" });
    }
  };

  const handleNext = async () => {
    if (!currentAnswer) {
      toast({ title: "Resposta necessária", description: "Por favor, selecione uma resposta antes de continuar.", variant: "destructive" });
      return;
    }

    if (currentStep.type === 'gate') {
      const group = currentStep.group;
      let gateValue: GateAnswer;
      
      if (currentAnswer === 'Sim, possui estruturada') gateValue = 'sim';
      else if (currentAnswer === 'Possui parcialmente') gateValue = 'parcialmente';
      else gateValue = 'nao';
      
      const newGates = { ...gates, [group.id]: gateValue };
      setGates(newGates);
      saveGates(newGates);

      if (gateValue === 'nao') {
        skipGroupQuestions(group);
        setSkippedMessage(`Área de ${group.name} marcada como inexistente. Pulando para a próxima área.`);
        
        // Rebuild steps and find next gate or end
        const newSteps = buildSteps(newGates);
        const currentGateIdx = newSteps.findIndex(
          s => s.type === 'gate' && s.group.id === group.id
        );
        
        // Find next step after this gate (which would be the next gate since questions were removed)
        const nextIdx = currentGateIdx + 1;
        if (nextIdx < newSteps.length) {
          // Use setTimeout to show the skip message briefly
          setTimeout(() => {
            setCurrentStepIndex(nextIdx);
            setSkippedMessage(null);
          }, 1500);
        } else {
          // All done
          await saveSnapshotToDb();
          setTimeout(() => {
            toast({ title: "Diagnóstico concluído!", description: "Todas as perguntas foram respondidas com sucesso." });
            navigate('/dashboard');
          }, 1500);
        }
        return;
      }
      
      // For 'sim' or 'parcialmente', just move to next step (first question of this group)
      const newSteps = buildSteps(newGates);
      const currentGateIdx = newSteps.findIndex(
        s => s.type === 'gate' && s.group.id === group.id
      );
      setCurrentStepIndex(currentGateIdx + 1);
      return;
    }

    // Regular question
    saveQuestionAnswer();
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      await saveSnapshotToDb();
      toast({ title: "Diagnóstico concluído!", description: "Todas as perguntas foram respondidas com sucesso." });
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      if (currentAnswer && currentStep?.type === 'question') {
        saveQuestionAnswer();
      }
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSaveAndExit = () => {
    if (currentAnswer && currentStep?.type === 'question') {
      saveQuestionAnswer();
    }
    toast({ title: "Progresso salvo", description: `Você respondeu ${answeredCount} de ${totalQuestions} perguntas.` });
    navigate('/');
  };

  const getDepartmentFromQuestion = (questionId: string): string | null => {
    if (questionId.startsWith('gate-')) return questionId.replace('gate-', '');
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

  const hasOngoingAssessment = (): boolean => {
    try {
      const storedAnswers = localStorage.getItem(ANSWERS_STORAGE_KEY);
      const storedGates = localStorage.getItem(GATE_STORAGE_KEY);
      if (!storedAnswers && !storedGates) return false;
      
      const parsedAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};
      const parsedGates = storedGates ? JSON.parse(storedGates) : {};
      return Object.keys(parsedAnswers).length > 0 || Object.keys(parsedGates).length > 0;
    } catch { return false; }
  };

  // Keep backward-compatible currentQuestionIndex
  const currentQuestionIndex = currentStepIndex;

  return {
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
    hasOngoingAssessment,
    totalSteps: steps.length,
    answeredCount,
    totalQuestions,
  };
};
