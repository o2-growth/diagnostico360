
import { useState } from 'react';
import { Question, EvaluationStatus } from '@/types/department';
import { useToast } from "@/components/ui/use-toast";
import QuestionListHeader from './questions/QuestionListHeader';
import QuestionItem from './questions/QuestionItem';

interface DepartmentQuestionsProps {
  questions: Question[];
}

const DepartmentQuestions = ({ questions }: DepartmentQuestionsProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [applicableAnswers, setApplicableAnswers] = useState<Record<string, string>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: q.applicable }), {})
  );
  const [evidenceAnswers, setEvidenceAnswers] = useState<Record<string, string>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: q.hasEvidence }), {})
  );
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationStatus>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: q.evaluation || "NÃO EXISTE" }), {})
  );
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const { toast } = useToast();

  const toggleItem = (item: string) => {
    setExpandedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleApplicableChange = (item: string, value: string) => {
    setApplicableAnswers(prev => ({ ...prev, [item]: value }));
  };

  const handleEvidenceChange = (item: string, value: string) => {
    setEvidenceAnswers(prev => ({ ...prev, [item]: value }));
  };

  const handleEvaluationChange = (item: string, value: EvaluationStatus) => {
    setEvaluations(prev => ({ ...prev, [item]: value }));
  };

  const handleEditClick = (item: string, currentQuestion: string) => {
    setEditingQuestion(item);
    setQuestionText(currentQuestion);
  };

  const handleSaveEdit = (item: string) => {
    setEditingQuestion(null);
    toast({
      title: "Sucesso",
      description: "Questão atualizada com sucesso",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "Sucesso",
        description: "Imagem carregada com sucesso",
      });
    }
  };

  return (
    <div className="space-y-4">
      <QuestionListHeader onImageUpload={handleImageUpload} />
      <div className="space-y-4">
        {questions.map((item) => (
          <QuestionItem
            key={item.item}
            item={item}
            isExpanded={expandedItems.includes(item.item)}
            editingQuestion={editingQuestion}
            questionText={questionText}
            applicableAnswer={applicableAnswers[item.item]}
            evidenceAnswer={evidenceAnswers[item.item]}
            evaluation={evaluations[item.item]}
            onToggle={toggleItem}
            onEditToggle={handleEditClick}
            onQuestionTextChange={setQuestionText}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setEditingQuestion(null)}
            onApplicableChange={handleApplicableChange}
            onEvidenceChange={handleEvidenceChange}
            onEvaluationChange={handleEvaluationChange}
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentQuestions;
