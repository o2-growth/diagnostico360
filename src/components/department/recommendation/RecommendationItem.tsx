
import { Save, X, Pen, Sparkles, MessageSquarePlus } from 'lucide-react';
import { Question } from '@/types/department';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from 'lucide-react';

interface RecommendationItemProps {
  item: Question;
  isEditMode: boolean;
  isEdited: boolean;
  isAIGenerated: boolean;
  recommendation: string;
  onToggleEditMode: (item: string) => void;
  onSaveRecommendation: (item: string) => void;
  onCancelRecommendation: (item: string) => void;
  onRecommendationChange: (item: string, value: string) => void;
}

const RecommendationItem = ({
  item,
  isEditMode,
  isEdited,
  isAIGenerated,
  recommendation,
  onToggleEditMode,
  onSaveRecommendation,
  onCancelRecommendation,
  onRecommendationChange
}: RecommendationItemProps) => {
  const isInexistent = item.evaluation === "NÃO EXISTE";
  const borderColor = isInexistent
    ? 'border-l-destructive'
    : 'border-l-yellow-500';

  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 ${borderColor}`}>
      {/* Header: Badges + Edit button */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isInexistent ? (
            <Badge variant="destructive" className="text-xs">
              Inexistente
            </Badge>
          ) : (
            <Badge className="text-xs bg-yellow-500/15 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/20">
              Pode melhorar
            </Badge>
          )}
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

      {/* Title + Question */}
      <div className="px-5 pt-4 space-y-1">
        <h4 className="font-semibold text-base">
          {item.item} - {item.title}
        </h4>
        <p className="text-sm text-muted-foreground">{item.question}</p>
      </div>

      <div className="px-5 pt-4">
        <Separator />
      </div>

      {/* Recommendation content */}
      <div className="p-5 space-y-3">
        <span className="text-sm font-medium text-muted-foreground">Recomendação</span>

        {isEditMode ? (
          <>
            <Textarea
              id={`recommendation-${item.item}`}
              placeholder="Digite suas recomendações para melhorar este item..."
              value={recommendation || ''}
              onChange={(e) => onRecommendationChange(item.item, e.target.value)}
              className="min-h-[120px]"
            />
            {isEdited && (
              <div className="bg-green-500/10 p-2 rounded text-sm">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Alterações pendentes. Clique em Salvar para confirmar.</span>
                </div>
              </div>
            )}
          </>
        ) : recommendation ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{recommendation}</p>
        ) : (
          <div className="flex items-center gap-3 py-4 text-muted-foreground">
            <MessageSquarePlus className="h-5 w-5" />
            <span className="text-sm">Clique em Editar para adicionar uma recomendação ou gere com IA.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationItem;
