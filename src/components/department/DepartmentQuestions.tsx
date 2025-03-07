
import { Question } from '@/types/department';
import ImageUploader from './question/ImageUploader';
import QuestionItem from './question/QuestionItem';
import { useQuestions } from './question/useQuestions';

interface DepartmentQuestionsProps {
  questions: Question[];
}

const DepartmentQuestions = ({ questions }: DepartmentQuestionsProps) => {
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
        <ImageUploader />
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
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentQuestions;
