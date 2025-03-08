
import { Question, EvaluationStatus } from '@/types/department';
import { Button } from "@/components/ui/button";
import QuestionEditForm from './QuestionEditForm';
import ApplicationList from './ApplicationList';
import ApplicableQuestion from './ApplicableQuestion';
import QuestionEvidence from './QuestionEvidence';
import EvaluationSection from './EvaluationSection';
import EditNotification from './EditNotification';

interface QuestionDetailsProps {
  item: Question;
  editingQuestion: string | null;
  questionText: string;
  isEditMode: boolean;
  isEdited: boolean;
  applicableAnswer: string;
  evidenceAnswer: string;
  evaluation: EvaluationStatus;
  score: number;
  onSetQuestionText: (text: string) => void;
  onEditClick: (item: string, currentQuestion: string) => void;
  onSaveEdit: (item: string) => void;
  onCancelEdit: () => void;
  onApplicableChange: (item: string, value: string) => void;
  onEvidenceChange: (item: string, value: string) => void;
  onEvaluationChange: (item: string, value: EvaluationStatus) => void;
  onScoreChange: (item: string, value: string) => void;
}

const QuestionDetails = ({
  item,
  editingQuestion,
  questionText,
  isEditMode,
  isEdited,
  applicableAnswer,
  evidenceAnswer,
  evaluation,
  score,
  onSetQuestionText,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  onApplicableChange,
  onEvidenceChange,
  onEvaluationChange,
  onScoreChange
}: QuestionDetailsProps) => {
  return (
    <div className="p-4 border-t border-dashboard-border space-y-4">
      <div>
        <div className="text-sm font-medium text-dashboard-muted mb-1">Pergunta</div>
        {editingQuestion === item.item ? (
          <QuestionEditForm
            questionText={questionText}
            onSetQuestionText={onSetQuestionText}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            itemId={item.item}
          />
        ) : (
          <div className="flex justify-between items-start gap-4">
            <div className="text-sm flex-1">{item.question}</div>
            {isEditMode && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditClick(item.item, item.question)}
              >
                Editar
              </Button>
            )}
          </div>
        )}
      </div>

      <ApplicableQuestion
        applicableAnswer={applicableAnswer}
        isEditMode={isEditMode}
        itemId={item.item}
        onApplicableChange={onApplicableChange}
      />

      <ApplicationList applications={item.application} />

      <QuestionEvidence
        evidence={item.evidence}
        evidenceAnswer={evidenceAnswer}
        isEditMode={isEditMode}
        itemId={item.item}
        onEvidenceChange={onEvidenceChange}
      />

      <EvaluationSection
        evaluation={evaluation}
        score={score}
        isEditMode={isEditMode}
        itemId={item.item}
        onEvaluationChange={onEvaluationChange}
        onScoreChange={onScoreChange}
      />
      
      <EditNotification isEdited={isEdited} isEditMode={isEditMode} />
    </div>
  );
};

export default QuestionDetails;
