
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Question } from '@/types/department';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium mb-6">Lista de Verificação</h3>
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
                {item.question && (
                  <div>
                    <div className="text-sm font-medium text-dashboard-muted mb-1">Pergunta</div>
                    <div className="text-sm">{item.question}</div>
                  </div>
                )}

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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentQuestions;

