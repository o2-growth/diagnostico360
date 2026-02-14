
import { Question } from '@/types/department';
import { useParams } from 'react-router-dom';
import { useRecommendations } from './recommendation/useRecommendations';
import RecommendationItem from './recommendation/RecommendationItem';
import ExportRecommendationsButton from './recommendation/ExportRecommendationsButton';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

interface DepartmentRecommendationsProps {
  questions: Question[];
}

const DepartmentRecommendations = ({ questions }: DepartmentRecommendationsProps) => {
  const { id: departmentId } = useParams();
  const {
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
  } = useRecommendations(questions);

  if (criticalItems.length === 0) {
    return (
      <div className="dashboard-card">
        <p className="text-dashboard-muted">Não há itens críticos nesta área.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">Recomendações de Melhoria</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => generateAIRecommendations(departmentId || '')}
            disabled={isGeneratingAI}
            className="flex items-center gap-2"
            variant="default"
          >
            {isGeneratingAI ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar Recomendações com IA
              </>
            )}
          </Button>
          <ExportRecommendationsButton 
            questions={questions} 
            recommendations={recommendations}
            departmentName={departmentId} 
          />
        </div>
      </div>
      <div className="space-y-4" data-recommendations>
        {criticalItems.map((item) => (
          <RecommendationItem
            key={item.item}
            item={item}
            isEditMode={isEditMode[item.item] || false}
            isExpanded={expandedItems.includes(item.item)}
            isEdited={editedRecommendations[item.item] || false}
            isAIGenerated={aiGeneratedItems[item.item] || false}
            recommendation={recommendations[item.item] || ''}
            onToggleExpand={toggleItem}
            onToggleEditMode={toggleEditMode}
            onSaveRecommendation={saveRecommendation}
            onCancelRecommendation={cancelRecommendation}
            onRecommendationChange={handleRecommendationChange}
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentRecommendations;
