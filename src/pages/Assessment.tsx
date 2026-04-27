
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ACTIVE_CLIENT_STORAGE_KEY } from '@/constants/client';
import { clearAssessmentState, clearInProgressAssessment } from '@/utils/clientAssessmentState';
import { useAuth } from '@/hooks/useAuth';

const Assessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const activeClientId = localStorage.getItem(ACTIVE_CLIENT_STORAGE_KEY);
    if (!activeClientId) {
      toast({
        title: 'Selecione um cliente',
        description: 'Cadastre ou selecione um cliente antes de iniciar um diagnóstico.',
        variant: 'destructive',
      });
      navigate('/', { replace: true });
      return;
    }

    clearAssessmentState();
    if (user) {
      clearInProgressAssessment(user.id, activeClientId);
    }

    toast({
      title: "Novo diagnóstico iniciado",
      description: "Responda as perguntas para avaliar cada área do cliente selecionado.",
    });

    // Redirect to the full assessment with gates
    navigate('/ongoing-assessment', { replace: true });
  }, [loading, navigate, toast, user]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};

export default Assessment;
