
import { Question } from '@/types/department';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

interface DepartmentRecommendationsProps {
  questions: Question[];
}

const DepartmentRecommendations = ({ questions }: DepartmentRecommendationsProps) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<Record<string, string>>({});

  const criticalItems = questions.filter(question => 
    question.evaluation === "NÃO EXISTE" || 
    question.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  );

  const handleRecommendationChange = (itemId: string, value: string) => {
    setRecommendations(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleSaveRecommendation = (itemId: string) => {
    toast({
      title: "Recomendação salva",
      description: "A recomendação foi salva com sucesso."
    });
  };

  if (criticalItems.length === 0) {
    return (
      <div className="dashboard-card">
        <p className="text-dashboard-muted">Não há itens críticos nesta área.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {criticalItems.map((item) => (
        <div key={item.item} className="dashboard-card">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="text-dashboard-muted text-sm mb-2">Item {item.item}</p>
              <p className="text-dashboard-muted">{item.question}</p>
            </div>
            
            <div className="p-4 bg-red-500/10 rounded-lg">
              <p className="text-red-500 font-medium">
                Status: {item.evaluation}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor={`recommendation-${item.item}`} className="block text-sm font-medium">
                Recomendações de Melhoria
              </label>
              <Textarea
                id={`recommendation-${item.item}`}
                placeholder="Digite suas recomendações para melhorar este item..."
                value={recommendations[item.item] || ''}
                onChange={(e) => handleRecommendationChange(item.item, e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={() => handleSaveRecommendation(item.item)}
                disabled={!recommendations[item.item]}
              >
                Salvar Recomendação
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentRecommendations;
