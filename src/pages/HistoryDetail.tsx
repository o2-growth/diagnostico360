import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { questionGroups } from '@/data/questions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidePanel from '@/components/SidePanel';

interface SnapshotDetail {
  id: string;
  completed_at: string;
  overall_score: number;
  department_scores: Record<string, number>;
  answers: Record<string, { evaluation?: string; observation?: string }>;
  gates: Record<string, string>;
}

const AREA_CONFIG: Record<string, { name: string; color: string }> = {
  'financeiro': { name: 'Financeiro', color: '#7EBF8E' },
  'tecnologia': { name: 'Tecnologia', color: '#8989DE' },
  'planejamento': { name: 'Planejamento', color: '#61AAF2' },
  'contabil': { name: 'Contábil', color: '#F97316' },
  'controladoria': { name: 'Controladoria', color: '#9b87f5' },
  'fiscal': { name: 'Fiscal', color: '#0EA5E9' },
  'comercial': { name: 'Comercial', color: '#EC4899' },
  'marketing': { name: 'Marketing', color: '#F59E0B' },
  'societario': { name: 'Societário', color: '#10B981' },
  'capital-humano': { name: 'Capital Humano', color: '#6366F1' },
};

function getEvaluationLabel(evaluation?: string) {
  if (!evaluation) return 'Não respondida';
  if (evaluation === 'EXISTE E FUNCIONA PERFEITAMENTE') return 'Funciona Perfeitamente';
  if (evaluation === 'EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)') return 'Pode ser Melhorado';
  if (evaluation === 'NÃO EXISTE') return 'Não Existe';
  return evaluation;
}

function getEvaluationColor(evaluation?: string) {
  if (evaluation === 'EXISTE E FUNCIONA PERFEITAMENTE') return 'text-green-400';
  if (evaluation === 'EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)') return 'text-yellow-400';
  if (evaluation === 'NÃO EXISTE') return 'text-red-400';
  return 'text-muted-foreground';
}

const HistoryDetail = () => {
  const { snapshotId } = useParams<{ snapshotId: string }>();
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState<SnapshotDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    const fetchSnapshot = async () => {
      if (!snapshotId) return;
      const { data, error } = await supabase
        .from('assessment_snapshots')
        .select('*')
        .eq('id', snapshotId)
        .single();

      if (!error && data) {
        setSnapshot(data as unknown as SnapshotDetail);
      }
      setLoading(false);
    };
    fetchSnapshot();
  }, [snapshotId]);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-dashboard-dark">
        <SidePanel onTabChange={() => {}} onMenuToggle={setMenuOpen} />
        <div className={`flex-1 transition-all duration-300 ${menuOpen ? 'ml-64' : 'ml-16'} p-8`}>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="min-h-screen flex bg-dashboard-dark">
        <SidePanel onTabChange={() => {}} onMenuToggle={setMenuOpen} />
        <div className={`flex-1 transition-all duration-300 ${menuOpen ? 'ml-64' : 'ml-16'} p-8`}>
          <p className="text-muted-foreground">Diagnóstico não encontrado.</p>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
      </div>
    );
  }

  const answers = snapshot.answers || {};
  const deptScores = snapshot.department_scores || {};

  return (
    <div className="min-h-screen flex bg-dashboard-dark">
      <SidePanel onTabChange={() => {}} onMenuToggle={setMenuOpen} />
      <div className={`flex-1 transition-all duration-300 ${menuOpen ? 'ml-64' : 'ml-16'} p-8`}>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>

        <header className="mb-8">
          <h1 className="text-3xl font-medium mb-2">
            Diagnóstico de {format(new Date(snapshot.completed_at), "dd/MM/yyyy", { locale: ptBR })}
          </h1>
          <p className="text-dashboard-muted">
            Concluído em {format(new Date(snapshot.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </header>

        {/* Score geral */}
        <div className="dashboard-card mb-6">
          <h2 className="text-xl font-medium mb-4">Score Geral</h2>
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-bold ${snapshot.overall_score >= 70 ? 'text-green-400' : snapshot.overall_score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {snapshot.overall_score}%
            </div>
            <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${snapshot.overall_score}%`,
                  backgroundColor: snapshot.overall_score >= 70 ? '#7EBF8E' : snapshot.overall_score >= 40 ? '#F59E0B' : '#EF4444',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scores por departamento */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Object.entries(AREA_CONFIG).map(([id, config]) => {
            const score = deptScores[id] ?? 0;
            return (
              <div key={id} className="dashboard-card text-center">
                <p className="text-xs text-dashboard-muted mb-1">{config.name}</p>
                <p className="text-2xl font-bold" style={{ color: config.color }}>{score}%</p>
              </div>
            );
          })}
        </div>

        {/* Detalhes por área */}
        {questionGroups.map((group) => {
          const gate = snapshot.gates?.[group.id];
          return (
            <div key={group.id} className="dashboard-card mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium" style={{ color: AREA_CONFIG[group.id]?.color }}>
                  {group.name}
                </h3>
                <span className="text-sm text-dashboard-muted">
                  Score: {deptScores[group.id] ?? 0}%
                </span>
              </div>
              {gate === 'nao' ? (
                <p className="text-sm text-red-400">Área marcada como inexistente neste diagnóstico.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2 text-dashboard-muted font-medium w-16">Item</th>
                      <th className="text-left py-2 px-2 text-dashboard-muted font-medium">Pergunta</th>
                      <th className="text-left py-2 px-2 text-dashboard-muted font-medium w-48">Avaliação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.questions.map((q) => {
                      const answer = answers[q.item] as { evaluation?: string } | undefined;
                      return (
                        <tr key={q.item} className="border-b border-white/5">
                          <td className="py-2 px-2 text-dashboard-muted">{q.item}</td>
                          <td className="py-2 px-2">{q.question}</td>
                          <td className={`py-2 px-2 font-medium ${getEvaluationColor(answer?.evaluation)}`}>
                            {getEvaluationLabel(answer?.evaluation)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryDetail;
