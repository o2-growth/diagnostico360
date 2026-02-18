
import { useState } from 'react';
import { ChevronDown, ChevronRight, Save, X, Check, Pen } from 'lucide-react';
import { Question, EvaluationStatus } from '@/types/department';
import { Button } from "@/components/ui/button";
import QuestionDetails from './QuestionDetails';

interface QuestionItemProps {
  item: Question;
  isEditMode: boolean;
  isExpanded: boolean;
  isEdited: boolean;
  applicableAnswer: string;
  evidenceAnswer: string;
  evaluation: EvaluationStatus;
  score: number;
  onToggleExpand: (item: string) => void;
  onToggleEditMode: (item: string) => void;
  onSaveChanges: (item: string) => void;
  onCancelChanges: (item: string) => void;
  onApplicableChange: (item: string, value: string) => void;
  onEvidenceChange: (item: string, value: string) => void;
  onEvaluationChange: (item: string, value: EvaluationStatus) => void;
  onScoreChange: (item: string, value: string) => void;
  isAdmin?: boolean;
}

const QuestionItem = ({
  item,
  isEditMode,
  isExpanded,
  isEdited,
  applicableAnswer,
  evidenceAnswer,
  evaluation,
  score,
  onToggleExpand,
  onToggleEditMode,
  onSaveChanges,
  onCancelChanges,
  onApplicableChange,
  onEvidenceChange,
  onEvaluationChange,
  onScoreChange,
  isAdmin
}: QuestionItemProps) => {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");

  const handleEditClick = (itemId: string, currentQuestion: string) => {
    setEditingQuestion(itemId);
    setQuestionText(currentQuestion);
  };

  const handleSaveEdit = (itemId: string) => {
    setEditingQuestion(null);
    // In the original code this was simply showing a toast notification
  };

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
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSaveChanges(item.item)}
                  className="flex items-center gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCancelChanges(item.item)}
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
        )}
      </div>

      {isExpanded && (
        <QuestionDetails
          item={item}
          editingQuestion={editingQuestion}
          questionText={questionText}
          isEditMode={isEditMode}
          isEdited={isEdited}
          applicableAnswer={applicableAnswer}
          evidenceAnswer={evidenceAnswer}
          evaluation={evaluation}
          score={score}
          onSetQuestionText={setQuestionText}
          onEditClick={handleEditClick}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => setEditingQuestion(null)}
          onApplicableChange={onApplicableChange}
          onEvidenceChange={onEvidenceChange}
          onEvaluationChange={onEvaluationChange}
          onScoreChange={onScoreChange}
        />
      )}
    </div>
  );
};

export default QuestionItem;
