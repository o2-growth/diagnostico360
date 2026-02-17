
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerRequests from '@/components/CustomerRequests';
import MetricCard from '@/components/MetricCard';
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { questions } from '@/data/questions';
import { useAuth } from '@/hooks/useAuth';
import { generateSampleAnswers, generateSampleGates } from '@/utils/sampleAssessmentData';
import { calculateScores } from '@/utils/scoreCalculator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DashboardContent = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [filling, setFilling] = useState(false);
  
  const calculateDepartmentScore = (deptId: string) => {
    const deptQuestions = questions.filter(q => q.item.startsWith(
      deptId === 'financeiro' ? '5' :
      deptId === 'tecnologia' ? '2' :
      deptId === 'planejamento' ? '10' :
      deptId === 'contabil' ? '8' :
      deptId === 'controladoria' ? '6' :
      deptId === 'fiscal' ? '7' :
      deptId === 'comercial' ? '3' :
      deptId === 'marketing' ? '4' :
      deptId === 'societario' ? '1' :
      deptId === 'capital-humano' ? '9' : ''
    ));

    if (!deptQuestions || deptQuestions.length === 0) return 0;
    
    const totalAnswered = deptQuestions.filter(q => 
      q.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE" || 
      q.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
    ).length;
    
    return Math.round((totalAnswered / deptQuestions.length) * 100);
  };

  const areas = [
    { id: 'financeiro', title: 'Financeiro', color: '#7EBF8E' },
    { id: 'tecnologia', title: 'Tecnologia', color: '#8989DE' },
    { id: 'planejamento', title: 'Planejamento', color: '#61AAF2' },
    { id: 'contabil', title: 'Contábil', color: '#F97316' },
    { id: 'controladoria', title: 'Controladoria', color: '#9b87f5' },
    { id: 'fiscal', title: 'Fiscal', color: '#0EA5E9' },
    { id: 'comercial', title: 'Comercial', color: '#EC4899' },
    { id: 'marketing', title: 'Marketing', color: '#F59E0B' },
    { id: 'societario', title: 'Societário', color: '#10B981' },
    { id: 'capital-humano', title: 'Capital Humano', color: '#6366F1' },
  ];

  const handleCardClick = (areaId: string) => {
    navigate(`/department/${areaId}`);
  };

  const handleQuickFill = async () => {
    if (!user) return;
    setFilling(true);
    try {
      const sampleAnswers = generateSampleAnswers();
      const sampleGates = generateSampleGates();

      localStorage.setItem('departmentAnswers', JSON.stringify(sampleAnswers));
      localStorage.setItem('departmentGates', JSON.stringify(sampleGates));

      const { departmentScores, overallScore } = calculateScores();

      await supabase.from('assessment_snapshots').insert({
        user_id: user.id,
        overall_score: overallScore,
        department_scores: departmentScores,
      });

      toast({
        title: "Teste rápido preenchido!",
        description: "Dados simulados foram inseridos com sucesso. A página será recarregada.",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      toast({ title: "Erro", description: "Falha ao preencher dados de teste.", variant: "destructive" });
    } finally {
      setFilling(false);
    }
  };

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium mb-2">Resultado</h1>
          <p className="text-dashboard-muted">Acompanhe o nível de excelência atual de cada área</p>
        </div>
        {isAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Zap className="h-4 w-4" />
                Preencher Teste Rápido
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Preencher dados de teste?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso irá substituir todas as respostas atuais do diagnóstico por dados simulados de uma empresa fictícia e salvar um snapshot. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleQuickFill} disabled={filling}>
                  {filling ? 'Preenchendo...' : 'Confirmar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </header>

      <div className="flex flex-col gap-6">
        <CustomerRequests />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {areas.map((area) => (
            <div 
              key={area.id}
              onClick={() => handleCardClick(area.id)}
              className="cursor-pointer"
            >
              <MetricCard
                title={area.title}
                value={calculateDepartmentScore(area.id)}
                color={area.color}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
