
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MonthlyChart from '@/components/MonthlyChart';
import MetricCard from '@/components/MetricCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Snapshot {
  id: string;
  completed_at: string;
  overall_score: number;
  department_scores: Record<string, number>;
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

const EvolutionContent = () => {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSnapshots = async () => {
      const { data, error } = await supabase
        .from('assessment_snapshots')
        .select('*')
        .order('completed_at', { ascending: true });

      if (!error && data) {
        setSnapshots(data as unknown as Snapshot[]);
      }
      setLoading(false);
    };
    fetchSnapshots();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground text-lg text-center">
          Nenhum diagnóstico concluído ainda.<br />
          Complete um diagnóstico para acompanhar sua evolução.
        </p>
        <Button onClick={() => navigate('/assessment')}>Iniciar Diagnóstico</Button>
      </div>
    );
  }

  const chartData = snapshots.map((s) => ({
    period: format(new Date(s.completed_at), "dd/MM/yy", { locale: ptBR }),
    value: s.overall_score,
  }));

  const latestScore = snapshots[snapshots.length - 1].overall_score;

  const areaChartData = Object.entries(AREA_CONFIG).map(([id, config]) => ({
    id,
    name: config.name,
    color: config.color,
    data: snapshots.map((s) => ({
      period: format(new Date(s.completed_at), "dd/MM", { locale: ptBR }),
      value: s.department_scores[id] ?? 0,
    })),
  }));

  const AreaChart = ({ data, color, title }: { data: { period: string; value: number }[]; color: string; title: string }) => (
    <div className="dashboard-card h-[250px]">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="period" stroke="#828179" fontSize={12} />
          <YAxis stroke="#828179" fontSize={12} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A19',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Histórico de Diagnósticos</h1>
        <p className="text-dashboard-muted">Acompanhe a evolução do nível de excelência ao longo do tempo</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <MonthlyChart data={chartData} />
          <MetricCard
            title="Nível de Excelência Atual"
            value={latestScore}
            color="#8989DE"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areaChartData.map((area) => (
            <AreaChart
              key={area.id}
              data={area.data}
              color={area.color}
              title={area.name}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default EvolutionContent;
