import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User, Trash2, RotateCcw, Shield, Info, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { questionGroups } from '@/data/questions';
import { generateSampleAnswers, generateSampleGates } from '@/utils/sampleAssessmentData';
import { calculateScores } from '@/utils/scoreCalculator';
import { supabase } from '@/integrations/supabase/client';
import { ACTIVE_CLIENT_STORAGE_KEY } from '@/constants/client';
import { STORAGE_KEYS } from '@/constants/storage';
import { clearAssessmentState } from '@/utils/clientAssessmentState';
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

const SAMPLE_CLIENT_NAME = 'Cliente Fictício - Teste Diagnóstico 360';

const getOrCreateSampleClient = async (userId: string) => {
  const { data: existingClient, error: lookupError } = await (supabase as any)
    .from('clients')
    .select('id')
    .eq('owner_id', userId)
    .eq('name', SAMPLE_CLIENT_NAME)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (existingClient?.id) return existingClient.id as string;

  const { data: newClient, error: createError } = await (supabase as any)
    .from('clients')
    .insert({
      owner_id: userId,
      name: SAMPLE_CLIENT_NAME,
      company_name: 'Empresa fictícia para testes',
      email: null,
      phone: null,
      notes: 'Cliente criado automaticamente para validar diagnósticos de demonstração sem misturar com clientes reais.',
    })
    .select('id')
    .single();

  if (createError) throw createError;
  return newClient.id as string;
};

const SettingsContent = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filling, setFilling] = useState(false);

  const storedAnswers = localStorage.getItem('departmentAnswers');
  const answers: Record<string, unknown> = storedAnswers ? JSON.parse(storedAnswers) : {};
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questionGroups.reduce((acc, g) => acc + g.questions.length, 0);
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleClearData = () => {
    localStorage.removeItem('departmentAnswers');
    localStorage.removeItem('departmentGates');
    localStorage.removeItem('departmentRecommendations');
    toast({ title: 'Dados limpos', description: 'Todos os dados do diagnóstico foram removidos.' });
    window.location.reload();
  };

  const handleNewDiagnosis = () => {
    localStorage.removeItem('departmentAnswers');
    localStorage.removeItem('departmentGates');
    localStorage.removeItem('departmentRecommendations');
    toast({ title: 'Novo diagnóstico', description: 'Dados anteriores foram limpos. Iniciando novo diagnóstico.' });
    setTimeout(() => navigate('/'), 500);
  };

  const handleQuickFill = async () => {
    if (!user) return;
    if (filling) return;
    setFilling(true);
    try {
      const sampleClientId = await getOrCreateSampleClient(user.id);
      const sampleAnswers = generateSampleAnswers();
      const sampleGates = generateSampleGates();

      clearAssessmentState();
      localStorage.setItem(ACTIVE_CLIENT_STORAGE_KEY, sampleClientId);
      localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(sampleAnswers));
      localStorage.setItem(STORAGE_KEYS.GATES, JSON.stringify(sampleGates));

      const { overallScore, departmentScores } = calculateScores();
      const { error } = await supabase.from('assessment_snapshots').insert({
        user_id: user.id,
        overall_score: overallScore,
        department_scores: departmentScores,
        answers: sampleAnswers,
        gates: sampleGates,
        client_id: sampleClientId,
      } as any);

      if (error) throw error;

      toast({ title: 'Teste rápido criado', description: 'Um diagnóstico foi salvo no cliente fictício desta conta.' });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Falha ao preencher dados de teste.';
      toast({ title: 'Erro', description, variant: 'destructive' });
    } finally {
      setFilling(false);
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Configurações</h1>
        <p className="text-dashboard-muted">Gerencie sua conta e dados do diagnóstico</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Minha Conta */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[#7EBF8E]" />
            <h2 className="text-xl font-medium">Minha Conta</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-dashboard-muted">Email</p>
              <p className="font-medium">{user?.email ?? 'Não identificado'}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-dashboard-muted">Perfil:</p>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#7EBF8E]/20 text-[#7EBF8E]">
                  <Shield className="w-3 h-3" />
                  Administrador
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                  Usuário
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Diagnóstico Atual */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-[#8989DE]" />
            <h2 className="text-xl font-medium">Diagnóstico Atual</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-dashboard-muted">Progresso</p>
              <p className="font-medium">{answeredCount} de {totalQuestions} perguntas respondidas</p>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPercent}%`, backgroundColor: '#7EBF8E' }}
              />
            </div>
            <p className="text-sm text-dashboard-muted">{progressPercent}% concluído</p>
          </div>
        </div>

        {/* Ações */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <RotateCcw className="w-5 h-5 text-[#F97316]" />
            <h2 className="text-xl font-medium">Ações</h2>
          </div>
          <div className="space-y-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 text-red-400 hover:text-red-300">
                  <Trash2 className="h-4 w-4" />
                  Limpar Dados do Diagnóstico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar todos os dados?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá remover todas as respostas do diagnóstico atual. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Iniciar Novo Diagnóstico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Iniciar novo diagnóstico?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Os dados do diagnóstico atual serão removidos e você será redirecionado para a página inicial. Deseja continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleNewDiagnosis}>Confirmar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Admin Tools */}
        {isAdmin && (
          <div className="dashboard-card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-[#9b87f5]" />
              <h2 className="text-xl font-medium">Administrador</h2>
            </div>
            <div className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Zap className="h-4 w-4" />
                    Preencher Teste Rápido
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Preencher dados de teste?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Isso cria ou reutiliza um cliente fictício desta conta e salva apenas um diagnóstico simulado vinculado a ele, sem misturar com clientes reais.
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
            </div>
          </div>
        )}

        {/* Sobre */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-5 h-5 text-[#61AAF2]" />
            <h2 className="text-xl font-medium">Sobre</h2>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-dashboard-muted leading-relaxed">
              O Diagnóstico 360 avalia 10 áreas estratégicas da sua empresa,
              identificando pontos fortes, oportunidades de melhoria e áreas críticas
              que necessitam de atenção imediata.
            </p>
            <p className="text-sm text-dashboard-muted leading-relaxed">
              Cada área é analisada através de perguntas específicas que medem o nível
              de maturidade dos processos, permitindo uma visão completa da saúde
              organizacional.
            </p>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-dashboard-muted">
                Áreas avaliadas: {questionGroups.map(g => g.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsContent;
