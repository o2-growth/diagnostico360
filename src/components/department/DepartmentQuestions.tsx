
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Question } from '@/types/department';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuestionHandlers } from '@/utils/questionHandlers';
import QuestionHeader from './QuestionHeader';
import QuestionContent from './QuestionContent';

interface DepartmentQuestionsProps {
  questions: Question[];
}

const DepartmentQuestions = ({ questions }: DepartmentQuestionsProps) => {
  const { toast } = useToast();
  const {
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
  } = useQuestionHandlers(questions);

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
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium">Lista de Verificação</h3>
        <div>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('imageUpload')?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Carregar Imagem
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {questions.map((item) => (
          <div key={item.item} className="border border-dashboard-border rounded-lg">
            <QuestionHeader
              isExpanded={expandedItems.includes(item.item)}
              itemId={item.item}
              title={item.title}
              onToggle={() => toggleItem(item.item)}
            />

            {expandedItems.includes(item.item) && (
              <QuestionContent
                item={item}
                editingQuestion={editingQuestion}
                questionText={questionText}
                applicableAnswer={applicableAnswers[item.item]}
                evidenceAnswer={evidenceAnswers[item.item]}
                evaluation={evaluations[item.item]}
                score={scores[item.item]}
                onQuestionTextChange={setQuestionText}
                onApplicableChange={(value) => handleApplicableChange(item.item, value)}
                onEvidenceChange={(value) => handleEvidenceChange(item.item, value)}
                onEvaluationChange={(value) => handleEvaluationChange(item.item, value)}
                onScoreChange={(value) => handleScoreChange(item.item, value)}
                onEdit={() => handleEditClick(item.item, item.question)}
                onSave={() => handleSaveEdit(item.item)}
                onCancel={() => setQuestionText("")}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentQuestions;

