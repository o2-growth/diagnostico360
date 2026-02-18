
import { Question } from '@/types/department';
import ImageUploader from './question/ImageUploader';
import QuestionItem from './question/QuestionItem';
import { useQuestions } from './question/useQuestions';
import ExportButton from './question/ExportButton';
import { useParams } from 'react-router-dom';

interface DepartmentQuestionsProps {
  questions: Question[];
  isAdmin?: boolean;
}

const DepartmentQuestions = ({ questions, isAdmin }: DepartmentQuestionsProps) => {
  const { id: departmentId } = useParams();
  const {
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
  } = useQuestions(questions);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">Lista de Verificação</h3>
        {isAdmin && (
          <div className="flex gap-2">
            <ExportButton questions={questions} departmentName={departmentId} />
            <ImageUploader />
          </div>
        )}
      </div>
      <div className="space-y-4">
        {questions.map((item) => (
          <QuestionItem
            key={item.item}
            item={item}
            isEditMode={isEditMode[item.item] || false}
            isExpanded={expandedItems.includes(item.item)}
            isEdited={editedQuestions[item.item] || false}
            applicableAnswer={applicableAnswers[item.item] || "SIM"}
            evidenceAnswer={evidenceAnswers[item.item] || "NÃO"}
            evaluation={evaluations[item.item] || "NÃO EXISTE"}
            score={scores[item.item] || 0}
            onToggleExpand={toggleItem}
            onToggleEditMode={toggleEditMode}
            onSaveChanges={saveChanges}
            onCancelChanges={cancelChanges}
            onApplicableChange={handleApplicableChange}
            onEvidenceChange={handleEvidenceChange}
            onEvaluationChange={handleEvaluationChange}
            onScoreChange={handleScoreChange}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentQuestions;
