
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { STORAGE_KEYS } from '@/constants/storage';
import { ACTIVE_CLIENT_STORAGE_KEY } from '@/constants/client';

const Assessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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

    // Clear previous assessment data for a fresh start
    localStorage.removeItem(STORAGE_KEYS.ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.GATES);
    localStorage.removeItem(STORAGE_KEYS.RECOMMENDATIONS);

    toast({
      title: "Novo diagnóstico iniciado",
      description: "Responda as perguntas para avaliar cada área do cliente selecionado.",
    });

    // Redirect to the full assessment with gates
    navigate('/ongoing-assessment', { replace: true });
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};

export default Assessment;
