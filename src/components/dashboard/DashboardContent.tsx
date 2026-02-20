
import { useNavigate } from 'react-router-dom';
import CustomerRequests from '@/components/CustomerRequests';
import MetricCard from '@/components/MetricCard';
import { calculateScores } from '@/utils/scoreCalculator';
import { Button } from '@/components/ui/button';
import { FileText, MessageCircle } from 'lucide-react';

const DashboardContent = () => {
  const navigate = useNavigate();

  const { departmentScores, overallScore } = calculateScores();
  const hasCompletedAssessment = overallScore > 0;

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

  return (
    <>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-medium mb-2">Resultado</h1>
          <p className="text-dashboard-muted">Acompanhe o nível de excelência atual de cada área</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/report')} variant="outline" size="sm" className="gap-2 border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300">
            <FileText className="h-4 w-4" />
            Ver Relatório Completo
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {hasCompletedAssessment && (
          <div className="dashboard-card flex items-center justify-between">
            <div>
              <p className="text-sm text-dashboard-muted mb-1">Score Geral</p>
              <span
                className="text-4xl font-bold"
                style={{
                  color: overallScore <= 25 ? '#EF4444'
                    : overallScore <= 50 ? '#F97316'
                    : overallScore <= 75 ? '#EAB308'
                    : '#7EBF8E',
                }}
              >
                {overallScore}%
              </span>
            </div>
            <div className="w-48 h-2 rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${overallScore}%`,
                  backgroundColor: overallScore <= 25 ? '#EF4444'
                    : overallScore <= 50 ? '#F97316'
                    : overallScore <= 75 ? '#EAB308'
                    : '#7EBF8E',
                }}
              />
            </div>
          </div>
        )}

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
                value={departmentScores[area.id] ?? 0}
                color={area.color}
              />
            </div>
          ))}
        </div>

        {hasCompletedAssessment && (
          <>
            <div className="dashboard-card p-6 flex items-center justify-between rounded-xl" style={{
              background: 'linear-gradient(135deg, rgba(126, 191, 142, 0.15), rgba(97, 170, 242, 0.12))',
              border: '1px solid rgba(126, 191, 142, 0.35)',
              boxShadow: '0 0 20px rgba(126, 191, 142, 0.08)',
            }}>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full p-2" style={{ background: 'rgba(126, 191, 142, 0.15)' }}>
                  <MessageCircle className="h-5 w-5" style={{ color: '#7EBF8E' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Transforme seus resultados em ação</h3>
                  <p className="text-dashboard-muted text-sm">
                    Nossos especialistas já ajudaram <strong>+2000 empresas</strong> a evoluir. Seu score é <strong>{overallScore}%</strong> — vamos melhorar juntos.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                  `Olá! Fiz o Diagnóstico 360 e meu score geral foi ${overallScore}%. Gostaria de falar com um especialista.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base whitespace-nowrap transition-all duration-300 hover:scale-110 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #7EBF8E, #4CAF50)',
                  color: '#fff',
                  boxShadow: '0 0 18px rgba(126, 191, 142, 0.45), 0 4px 12px rgba(0,0,0,0.2)',
                  animation: 'cta-glow 2s ease-in-out infinite alternate',
                }}
              >
                <MessageCircle className="h-5 w-5" />
                Falar com Especialista
              </a>
            </div>
            <style>{`
              @keyframes cta-glow {
                0% { box-shadow: 0 0 12px rgba(126, 191, 142, 0.3), 0 4px 12px rgba(0,0,0,0.2); }
                100% { box-shadow: 0 0 24px rgba(126, 191, 142, 0.6), 0 4px 16px rgba(0,0,0,0.25); }
              }
            `}</style>
          </>
        )}
      </div>
    </>
  );
};

export default DashboardContent;
