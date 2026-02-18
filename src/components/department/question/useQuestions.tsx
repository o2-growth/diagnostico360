
import { useState, useEffect } from 'react';
import { Question, EvaluationStatus } from '@/types/department';
import { useToast } from "@/components/ui/use-toast";

export const useQuestions = (questions: Question[]) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [applicableAnswers, setApplicableAnswers] = useState<Record<string, string>>({});
  const [evidenceAnswers, setEvidenceAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationStatus>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [editedQuestions, setEditedQuestions] = useState<Record<string, boolean>>({});
  const [isEditMode, setIsEditMode] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Initialize state from localStorage (user's answers) falling back to question data
  useEffect(() => {
    let savedAnswers: Record<string, any> = {};
    try {
      const stored = localStorage.getItem('departmentAnswers');
      if (stored) savedAnswers = JSON.parse(stored);
    } catch {}

    setApplicableAnswers(
      questions.reduce((acc, q) => ({
        ...acc,
        [q.item]: savedAnswers[q.item]?.applicable || q.applicable || "SIM"
      }), {})
    );
    setEvidenceAnswers(
      questions.reduce((acc, q) => ({
        ...acc,
        [q.item]: savedAnswers[q.item]?.hasEvidence || q.hasEvidence || "NÃO"
      }), {})
    );
    setEvaluations(
      questions.reduce((acc, q) => ({
        ...acc,
        [q.item]: savedAnswers[q.item]?.evaluation || q.evaluation || "NÃO EXISTE"
      }), {} as Record<string, EvaluationStatus>)
    );
    setScores(
      questions.reduce((acc, q) => ({
        ...acc,
        [q.item]: savedAnswers[q.item]?.score || q.score || 0
      }), {})
    );
  }, [questions]);

  const toggleItem = (item: string) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const toggleEditMode = (item: string) => {
    setIsEditMode(prev => ({ ...prev, [item]: !prev[item] }));
    if (!isEditMode[item]) {
      setExpandedItems(prev => 
        prev.includes(item) ? prev : [...prev, item]
      );
    }
  };

  const handleApplicableChange = (item: string, value: string) => {
    setApplicableAnswers(prev => ({ ...prev, [item]: value }));
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
  };

  const handleEvidenceChange = (item: string, value: string) => {
    setEvidenceAnswers(prev => ({ ...prev, [item]: value }));
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
  };

  const handleEvaluationChange = (item: string, value: EvaluationStatus) => {
    setEvaluations(prev => ({ ...prev, [item]: value }));
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
  };

  const handleScoreChange = (item: string, value: string) => {
    const numValue = Math.min(Math.max(Number(value), 0), 10);
    setScores(prev => ({ ...prev, [item]: numValue }));
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
  };

  const saveChanges = (item: string) => {
    setIsEditMode(prev => ({ ...prev, [item]: false }));
    setEditedQuestions(prev => ({ ...prev, [item]: false }));
    
    // Save to localStorage
    const storedAnswers = localStorage.getItem('departmentAnswers') || '{}';
    const parsedAnswers = JSON.parse(storedAnswers);
    
    const updatedAnswers = {
      ...parsedAnswers,
      [item]: {
        applicable: applicableAnswers[item],
        hasEvidence: evidenceAnswers[item],
        evaluation: evaluations[item],
        score: scores[item]
      }
    };
    
    localStorage.setItem('departmentAnswers', JSON.stringify(updatedAnswers));
    
    toast({
      title: "Sucesso",
      description: "Respostas salvas com sucesso",
    });
  };

  const cancelChanges = (item: string) => {
    // Reset to original values from the questions array
    const originalQuestion = questions.find(q => q.item === item);
    if (originalQuestion) {
      setApplicableAnswers(prev => ({ 
        ...prev, 
        [item]: originalQuestion.applicable || "SIM" 
      }));
      setEvidenceAnswers(prev => ({ 
        ...prev, 
        [item]: originalQuestion.hasEvidence || "NÃO" 
      }));
      setEvaluations(prev => ({ 
        ...prev, 
        [item]: originalQuestion.evaluation || "NÃO EXISTE" 
      }));
      setScores(prev => ({ 
        ...prev, 
        [item]: originalQuestion.score || 0 
      }));
    }
    
    setIsEditMode(prev => ({ ...prev, [item]: false }));
    setEditedQuestions(prev => ({ ...prev, [item]: false }));
  };

  return {
    expandedItems,
    applicableAnswers,
    evidenceAnswers,
    evaluations,
    scores,
    editedQuestions,
    isEditMode,
    toggleItem,
    toggleEditMode,
    handleApplicableChange,
    handleEvidenceChange,
    handleEvaluationChange,
    handleScoreChange,
    saveChanges,
    cancelChanges
  };
};
