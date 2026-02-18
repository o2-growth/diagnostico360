
import { useState } from 'react';
import { Question } from '@/types/department';
import { useToast } from '@/hooks/use-toast';

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

  const generateRecommendationText = (q: Question): string => {
    if (q.evaluation === "NÃO EXISTE") {
      return `**Prioridade Alta - Implementar ${q.title}**\n\n` +
        `A empresa atualmente não possui estrutura para: "${q.question}"\n\n` +
        `**Plano de Ação Sugerido:**\n` +
        `1. Realizar diagnóstico detalhado da situação atual\n` +
        `2. Definir responsável e prazo para implementação\n` +
        `3. Estabelecer processos e documentação necessários\n` +
        `4. Implementar controles e indicadores de acompanhamento\n` +
        `5. Realizar revisão periódica dos resultados\n\n` +
        `**Evidências necessárias:** ${q.evidence || 'Documentação de processos, atas de reunião, indicadores'}`;
    }
    return `**Prioridade Média - Otimizar ${q.title}**\n\n` +
      `O processo existe mas precisa de melhorias: "${q.question}"\n\n` +
      `**Plano de Ação Sugerido:**\n` +
      `1. Mapear o processo atual e identificar gargalos\n` +
      `2. Padronizar procedimentos e criar documentação\n` +
      `3. Definir KPIs e metas de melhoria\n` +
      `4. Implementar ciclo de melhoria contínua (PDCA)\n` +
      `5. Capacitar equipe envolvida\n\n` +
      `**Evidências necessárias:** ${q.evidence || 'Documentação atualizada, relatórios de acompanhamento'}`;
  };

  const generateAIRecommendations = async (_departmentName: string) => {
    setIsGeneratingAI(true);
    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const newRecs: Record<string, string> = {};
      const newAiFlags: Record<string, boolean> = {};
      const newExpanded: string[] = [];

      for (const q of criticalItems) {
        newRecs[q.item] = generateRecommendationText(q);
        newAiFlags[q.item] = true;
        newExpanded.push(q.item);
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
        description: `${Object.keys(newRecs).length} recomendações foram geradas com sucesso.`
      });
    } catch (error: any) {
      console.error('Recommendation generation error:', error);
      toast({
        title: "Erro ao gerar recomendações",
        description: "Tente novamente em alguns instantes.",
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
