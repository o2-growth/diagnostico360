
import { useState } from 'react';
import { ChevronDown, ChevronRight, Upload } from 'lucide-react';
import { Question, EvaluationStatus } from '@/types/department';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

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
    const numValue = Math.min(Math.max(Number(value), 0), 10);
    setScores(prev => ({ ...prev, [item]: numValue }));
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
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-dashboard-card-hover"
              onClick={() => toggleItem(item.item)}
            >
              <div className="flex items-center gap-2">
                {expandedItems.includes(item.item) ? (
                  <ChevronDown className="h-4 w-4 text-dashboard-muted" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-dashboard-muted" />
                )}
                <span className="font-medium">
                  {item.item} - {item.title}
                </span>
              </div>
            </div>

            {expandedItems.includes(item.item) && (
              <div className="p-4 border-t border-dashboard-border space-y-4">
                <div>
                  <div className="text-sm font-medium text-dashboard-muted mb-1">Pergunta</div>
                  {editingQuestion === item.item ? (
                    <div className="space-y-2">
                      <Textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(item.item)}
                        >
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingQuestion(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4">
                      <div className="text-sm flex-1">{item.question}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(item.item, item.question)}
                      >
                        Editar
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium text-dashboard-muted mb-1">
                    É aplicável nessa unidade?
                  </div>
                  <ToggleGroup
                    type="single"
                    value={applicableAnswers[item.item]}
                    onValueChange={(value) => value && handleApplicableChange(item.item, value)}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="SIM">SIM</ToggleGroupItem>
                    <ToggleGroupItem value="NÃO">NÃO</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {item.application.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-dashboard-muted mb-1">
                      Forma de Aplicação
                    </div>
                    <ul className="list-disc pl-4 text-sm">
                      {item.application.map((app, index) => (
                        <li key={index}>{app}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.evidence && (
                  <div>
                    <div className="text-sm font-medium text-dashboard-muted mb-1">Evidências</div>
                    <div className="text-sm">{item.evidence}</div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-dashboard-muted mb-1">
                    Existe evidência?
                  </div>
                  <ToggleGroup
                    type="single"
                    value={evidenceAnswers[item.item]}
                    onValueChange={(value) => value && handleEvidenceChange(item.item, value)}
                    className="justify-start"
                  >
                    <ToggleGroupItem value="SIM">SIM</ToggleGroupItem>
                    <ToggleGroupItem value="NÃO">NÃO</ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-dashboard-muted mb-2">Avaliação</div>
                    <Select
                      value={evaluations[item.item]}
                      onValueChange={(value: EvaluationStatus) => handleEvaluationChange(item.item, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)">
                          EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)
                        </SelectItem>
                        <SelectItem value="NÃO EXISTE">
                          NÃO EXISTE
                        </SelectItem>
                        <SelectItem value="EXISTE E FUNCIONA PERFEITAMENTE">
                          EXISTE E FUNCIONA PERFEITAMENTE
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-dashboard-muted mb-2">Nota Avaliação</div>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={scores[item.item]}
                      onChange={(e) => handleScoreChange(item.item, e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentQuestions;

