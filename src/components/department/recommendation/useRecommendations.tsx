
import { useState } from 'react';
import { Question } from '@/types/department';
import { useToast } from '@/hooks/use-toast';

export const useRecommendations = (questions: Question[]) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Record<string, string>>({});
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState<Record<string, boolean>>({});
  const [editedRecommendations, setEditedRecommendations] = useState<Record<string, boolean>>({});

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
  };

  const saveRecommendation = (itemId: string) => {
    setIsEditMode(prev => ({ ...prev, [itemId]: false }));
    setEditedRecommendations(prev => ({ ...prev, [itemId]: false }));
    
    // Save to localStorage
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
    // Reset to original values from localStorage
    const storedRecommendations = localStorage.getItem('departmentRecommendations') || '{}';
    const parsedRecommendations = JSON.parse(storedRecommendations);
    
    setRecommendations(prev => ({ 
      ...prev, 
      [itemId]: parsedRecommendations[itemId] || '' 
    }));
    
    setIsEditMode(prev => ({ ...prev, [itemId]: false }));
    setEditedRecommendations(prev => ({ ...prev, [itemId]: false }));
  };

  return {
    recommendations,
    expandedItems,
    isEditMode,
    editedRecommendations,
    criticalItems,
    toggleItem,
    toggleEditMode,
    handleRecommendationChange,
    saveRecommendation,
    cancelRecommendation
  };
};
