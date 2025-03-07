
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Upload, Save, X, Check, Pen } from 'lucide-react';
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
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

interface DepartmentQuestionsProps {
  questions: Question[];
}

const DepartmentQuestions = ({ questions }: DepartmentQuestionsProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [applicableAnswers, setApplicableAnswers] = useState<Record<string, string>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: q.applicable || "SIM" }), {})
  );
  const [evidenceAnswers, setEvidenceAnswers] = useState<Record<string, string>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: q.hasEvidence || "NÃO" }), {})
  );
  const [evaluations, setEvaluations] = useState<Record<string, EvaluationStatus>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: q.evaluation || "NÃO EXISTE" }), {})
  );
  const [scores, setScores] = useState<Record<string, number>>(
    questions.reduce((acc, q) => ({ ...acc, [q.item]: q.score || 0 }), {})
  );
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [editedQuestions, setEditedQuestions] = useState<Record<string, boolean>>({});
  const [isEditMode, setIsEditMode] = useState<Record<string, boolean>>({});
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
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
  };

  const handleEvidenceChange = (item: string, value: string) => {
    setEvidenceAnswers(prev => ({ ...prev, [item]: value }));
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
  };

  const handleEvaluationChange = (item: string, value: EvaluationStatus) => {
    setEvaluations(prev => ({ ...prev, [item]: value }));
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
  };

  const handleScoreChange = (item: string, value: string) => {
    const numValue = Math.min(Math.max(Number(value), 0), 10);
    setScores(prev => ({ ...prev, [item]: numValue }));
    setEditedQuestions(prev => ({ ...prev, [item]: true }));
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

  const toggleEditMode = (item: string) => {
    setIsEditMode(prev => ({ ...prev, [item]: !prev[item] }));
    if (!isEditMode[item]) {
      setExpandedItems(prev => 
        prev.includes(item) ? prev : [...prev, item]
      );
    }
  };

  const saveChanges = (item: string) => {
    setIsEditMode(prev => ({ ...prev, [item]: false }));
    setEditedQuestions(prev => ({ ...prev, [item]: false }));
    toast({
      title: "Sucesso",
      description: "Respostas salvas com sucesso",
    });
  };

  const cancelChanges = (item: string) => {
    // Reset to original values if needed
    setIsEditMode(prev => ({ ...prev, [item]: false }));
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
            >
              <div 
                className="flex items-center gap-2 flex-1"
                onClick={() => toggleItem(item.item)}
              >
                {expandedItems.includes(item.item) ? (
                  <ChevronDown className="h-4 w-4 text-dashboard-muted" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-dashboard-muted" />
                )}
                <span className="font-medium">
                  {item.item} - {item.title}
                </span>
              </div>
              <div className="flex gap-2">
                {isEditMode[item.item] ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveChanges(item.item)}
                      className="flex items-center gap-1"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelChanges(item.item)}
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
                    onClick={() => toggleEditMode(item.item)}
                    className="flex items-center gap-1"
                  >
                    <Pen className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                )}
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
                      {isEditMode[item.item] && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(item.item, item.question)}
                        >
                          Editar
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium text-dashboard-muted mb-1">
                    É aplicável nessa unidade?
                  </div>
                  <RadioGroup 
                    value={applicableAnswers[item.item]}
                    onValueChange={(value) => handleApplicableChange(item.item, value)}
                    className="flex space-x-4"
                    disabled={!isEditMode[item.item]}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioItem value="SIM" id={`aplicavel-sim-${item.item}`} />
                      <label htmlFor={`aplicavel-sim-${item.item}`} className="text-sm">SIM</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioItem value="NÃO" id={`aplicavel-nao-${item.item}`} />
                      <label htmlFor={`aplicavel-nao-${item.item}`} className="text-sm">NÃO</label>
                    </div>
                  </RadioGroup>
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
                  <RadioGroup 
                    value={evidenceAnswers[item.item]}
                    onValueChange={(value) => handleEvidenceChange(item.item, value)}
                    className="flex space-x-4"
                    disabled={!isEditMode[item.item]}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioItem value="SIM" id={`evidencia-sim-${item.item}`} />
                      <label htmlFor={`evidencia-sim-${item.item}`} className="text-sm">SIM</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioItem value="NÃO" id={`evidencia-nao-${item.item}`} />
                      <label htmlFor={`evidencia-nao-${item.item}`} className="text-sm">NÃO</label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-dashboard-muted mb-2">Avaliação</div>
                    <Select
                      value={evaluations[item.item]}
                      onValueChange={(value: EvaluationStatus) => handleEvaluationChange(item.item, value)}
                      disabled={!isEditMode[item.item]}
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
                      disabled={!isEditMode[item.item]}
                    />
                  </div>
                </div>
                
                {editedQuestions[item.item] && isEditMode[item.item] && (
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
        ))}
      </div>
    </div>
  );
};

export default DepartmentQuestions;
