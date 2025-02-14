
import { Question, EvaluationStatus } from '@/types/department';
import { useToast } from "@/components/ui/use-toast";

export const useQuestionHandlers = (questions: Question[]) => {
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
  const [scores, setScores] = useState<Record<string, number>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: 0 }), {})
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

  const handleScoreChange = (item: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
      setScores(prev => ({ ...prev, [item]: numValue }));
    }
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

  return {
    expandedItems,
    applicableAnswers,
    evidenceAnswers,
    evaluations,
    scores,
    editingQuestion,
    questionText,
    setQuestionText,
    toggleItem,
    handleApplicableChange,
    handleEvidenceChange,
    handleEvaluationChange,
    handleScoreChange,
    handleEditClick,
    handleSaveEdit,
  };
};

