
import { useState } from 'react';
import { Question } from '@/types/department';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useRecommendations = (questions: Question[]) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem('departmentRecommendations');
    return stored ? JSON.parse(stored) : {};
  });
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState<Record<string, boolean>>({});
  const [editedRecommendations, setEditedRecommendations] = useState<Record<string, boolean>>({});
  const [aiGeneratedItems, setAiGeneratedItems] = useState<Record<string, boolean>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const criticalItems = questions.filter(question => 
    question.evaluation === "NÃO EXISTE" || 
    question.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  );

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

  const handleRecommendationChange = (itemId: string, value: string) => {
    setRecommendations(prev => ({
      ...prev,
      [itemId]: value
    }));
    setEditedRecommendations(prev => ({ ...prev, [itemId]: true }));
    setAiGeneratedItems(prev => ({ ...prev, [itemId]: false }));
  };

  const saveRecommendation = (itemId: string) => {
    setIsEditMode(prev => ({ ...prev, [itemId]: false }));
    setEditedRecommendations(prev => ({ ...prev, [itemId]: false }));
    
    const storedRecommendations = localStorage.getItem('departmentRecommendations') || '{}';
    const parsedRecommendations = JSON.parse(storedRecommendations);
    
    const updatedRecommendations = {
      ...parsedRecommendations,
      [itemId]: recommendations[itemId]
    };
    
    localStorage.setItem('departmentRecommendations', JSON.stringify(updatedRecommendations));
    
    toast({
      title: "Recomendação salva",
      description: "A recomendação foi salva com sucesso."
    });
  };

  const cancelRecommendation = (itemId: string) => {
    const storedRecommendations = localStorage.getItem('departmentRecommendations') || '{}';
    const parsedRecommendations = JSON.parse(storedRecommendations);
    
    setRecommendations(prev => ({ 
      ...prev, 
      [itemId]: parsedRecommendations[itemId] || '' 
    }));
    
    setIsEditMode(prev => ({ ...prev, [itemId]: false }));
    setEditedRecommendations(prev => ({ ...prev, [itemId]: false }));
  };

  const generateAIRecommendations = async (departmentName: string) => {
    setIsGeneratingAI(true);
    try {
      const items = criticalItems.map(q => ({
        item: q.item,
        title: q.title,
        question: q.question,
        evaluation: q.evaluation
      }));

      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { departmentName, criticalItems: items }
      });

      if (error) throw error;

      const aiRecs = data.recommendations || data;
      const newRecs: Record<string, string> = {};
      const newAiFlags: Record<string, boolean> = {};
      const newExpanded: string[] = [];

      for (const [itemId, rec] of Object.entries(aiRecs)) {
        if (typeof rec === 'string') {
          newRecs[itemId] = rec;
          newAiFlags[itemId] = true;
          newExpanded.push(itemId);
        }
      }

      setRecommendations(prev => ({ ...prev, ...newRecs }));
      setAiGeneratedItems(prev => ({ ...prev, ...newAiFlags }));
      setExpandedItems(prev => [...new Set([...prev, ...newExpanded])]);

      // Save to localStorage
      const stored = localStorage.getItem('departmentRecommendations') || '{}';
      const parsed = JSON.parse(stored);
      localStorage.setItem('departmentRecommendations', JSON.stringify({ ...parsed, ...newRecs }));

      toast({
        title: "Recomendações geradas",
        description: `${Object.keys(newRecs).length} recomendações foram geradas com IA.`
      });
    } catch (error: any) {
      console.error('AI recommendation error:', error);
      toast({
        title: "Erro ao gerar recomendações",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return {
    recommendations,
    expandedItems,
    isEditMode,
    editedRecommendations,
    aiGeneratedItems,
    isGeneratingAI,
    criticalItems,
    toggleItem,
    toggleEditMode,
    handleRecommendationChange,
    saveRecommendation,
    cancelRecommendation,
    generateAIRecommendations
  };
};
