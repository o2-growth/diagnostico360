
import { ChevronDown, ChevronRight, Save, X, Check, Pen, Sparkles } from 'lucide-react';
import { Question } from '@/types/department';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface RecommendationItemProps {
  item: Question;
  isEditMode: boolean;
  isExpanded: boolean;
  isEdited: boolean;
  isAIGenerated: boolean;
  recommendation: string;
  onToggleExpand: (item: string) => void;
  onToggleEditMode: (item: string) => void;
  onSaveRecommendation: (item: string) => void;
  onCancelRecommendation: (item: string) => void;
  onRecommendationChange: (item: string, value: string) => void;
}

const RecommendationItem = ({
  item,
  isEditMode,
  isExpanded,
  isEdited,
  isAIGenerated,
  recommendation,
  onToggleExpand,
  onToggleEditMode,
  onSaveRecommendation,
  onCancelRecommendation,
  onRecommendationChange
}: RecommendationItemProps) => {
  return (
    <div key={item.item} className="border border-dashboard-border rounded-lg">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-dashboard-card-hover"
      >
        <div 
          className="flex items-center gap-2 flex-1"
          onClick={() => onToggleExpand(item.item)}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-dashboard-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-dashboard-muted" />
          )}
          <span className="font-medium">
            {item.item} - {item.title}
          </span>
          {isAIGenerated && (
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Sparkles className="h-3 w-3" />
              Gerado por IA
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSaveRecommendation(item.item)}
                className="flex items-center gap-1"
                disabled={!recommendation}
              >
                <Save className="h-3.5 w-3.5" />
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancelRecommendation(item.item)}
                className="flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggleEditMode(item.item)}
              className="flex items-center gap-1"
            >
              <Pen className="h-3.5 w-3.5" />
              Editar
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-dashboard-border space-y-4">
          <div>
            <div className="text-sm font-medium text-dashboard-muted mb-1">Item</div>
            <p className="text-sm">{item.question}</p>
          </div>
          
          <div className="p-4 bg-red-500/10 rounded-lg">
            <p className="text-red-500 font-medium">
              Status: {item.evaluation}
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor={`recommendation-${item.item}`} className="block text-sm font-medium text-dashboard-muted">
              Recomendações de Melhoria
            </label>
            <Textarea
              id={`recommendation-${item.item}`}
              placeholder="Digite suas recomendações para melhorar este item..."
              value={recommendation || ''}
              onChange={(e) => onRecommendationChange(item.item, e.target.value)}
              className="min-h-[100px]"
              disabled={!isEditMode}
            />
          </div>
          
          {isEdited && isEditMode && (
            <div className="bg-green-500/10 p-2 rounded text-sm mt-4">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span>Alterações pendentes. Clique em Salvar para confirmar.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendationItem;
