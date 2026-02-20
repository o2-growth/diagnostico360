
import { useState } from 'react';
import { Question } from '@/types/department';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { questionGroups } from '@/data/questions/index';

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

  const generateFallbackText = (q: Question): string => {
    if (q.evaluation === "NÃO EXISTE") {
      return `**Prioridade Alta - Implementar ${q.title}**\n\n` +
        `A empresa atualmente não possui estrutura para: "${q.question}"\n\n` +
        `**Plano de Ação Sugerido:**\n` +
        `1. Realizar diagnóstico detalhado da situação atual\n` +
        `2. Definir responsável e prazo para implementação\n` +
        `3. Estabelecer processos e documentação necessários\n` +
        `4. Implementar controles e indicadores de acompanhamento\n` +
        `5. Realizar revisão periódica dos resultados`;
    }
    return `**Prioridade Média - Otimizar ${q.title}**\n\n` +
      `O processo existe mas precisa de melhorias: "${q.question}"\n\n` +
      `**Plano de Ação Sugerido:**\n` +
      `1. Mapear o processo atual e identificar gargalos\n` +
      `2. Padronizar procedimentos e criar documentação\n` +
      `3. Definir KPIs e metas de melhoria\n` +
      `4. Implementar ciclo de melhoria contínua (PDCA)\n` +
      `5. Capacitar equipe envolvida`;
  };

  const resolveDepartmentName = (departmentId: string): string => {
    const group = questionGroups.find(g => g.id === departmentId);
    return group?.name || departmentId;
  };

  const generateAIRecommendations = async (departmentId: string) => {
    setIsGeneratingAI(true);
    try {
      const departmentName = resolveDepartmentName(departmentId);

      const itemsPayload = criticalItems.map(q => ({
        item: q.item,
        title: q.title,
        question: q.question,
        evaluation: q.evaluation,
      }));

      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { departmentName, criticalItems: itemsPayload },
      });

      if (error) {
        const status = (error as any)?.status || (error as any)?.context?.status;
        if (status === 429) {
          toast({ title: "Limite de requisições", description: "Tente novamente em alguns minutos.", variant: "destructive" });
        } else if (status === 402) {
          toast({ title: "Créditos insuficientes", description: "Adicione créditos de IA na sua conta.", variant: "destructive" });
        } else {
          throw error;
        }
        return;
      }

      // Check for error in response body
      if (data?.error) {
        toast({ title: "Erro", description: data.error, variant: "destructive" });
        return;
      }

      const aiRecs: Record<string, string> = data?.recommendations || {};

      const newRecs: Record<string, string> = {};
      const newAiFlags: Record<string, boolean> = {};

      for (const q of criticalItems) {
        if (aiRecs[q.item]) {
          newRecs[q.item] = aiRecs[q.item];
          newAiFlags[q.item] = true;
        }
      }

      if (Object.keys(newRecs).length === 0) {
        toast({ title: "Erro", description: "A IA não retornou recomendações. Tente novamente.", variant: "destructive" });
        return;
      }

      setRecommendations(prev => ({ ...prev, ...newRecs }));
      setAiGeneratedItems(prev => ({ ...prev, ...newAiFlags }));

      const stored = localStorage.getItem('departmentRecommendations') || '{}';
      const parsed = JSON.parse(stored);
      localStorage.setItem('departmentRecommendations', JSON.stringify({ ...parsed, ...newRecs }));

      toast({
        title: "Recomendações geradas com IA",
        description: `${Object.keys(newRecs).length} recomendações personalizadas foram geradas.`
      });
    } catch (error: any) {
      console.error('AI recommendation error:', error);

      // Fallback to local templates
      const newRecs: Record<string, string> = {};
      for (const q of criticalItems) {
        newRecs[q.item] = generateFallbackText(q);
      }
      setRecommendations(prev => ({ ...prev, ...newRecs }));

      const stored = localStorage.getItem('departmentRecommendations') || '{}';
      const parsed = JSON.parse(stored);
      localStorage.setItem('departmentRecommendations', JSON.stringify({ ...parsed, ...newRecs }));

      toast({
        title: "Recomendações geradas (modo offline)",
        description: "Não foi possível usar IA. Recomendações genéricas foram aplicadas.",
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
