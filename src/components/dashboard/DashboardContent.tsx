
import { useNavigate } from 'react-router-dom';
import CustomerRequests from '@/components/CustomerRequests';
import MetricCard from '@/components/MetricCard';
import { calculateScores } from '@/utils/scoreCalculator';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

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
          <div className="dashboard-card p-6 flex items-center justify-between" style={{
            background: 'linear-gradient(135deg, rgba(126, 191, 142, 0.08), rgba(97, 170, 242, 0.08))',
            border: '1px solid rgba(126, 191, 142, 0.2)',
          }}>
            <div>
              <h3 className="font-semibold text-lg mb-1">Precisa de ajuda com os resultados?</h3>
              <p className="text-dashboard-muted text-sm">
                Seu score geral é <strong>{overallScore}%</strong>. Fale com um especialista para melhorar seus pontos críticos.
              </p>
            </div>
            <a
              href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                `Olá! Fiz o Diagnóstico 360 e meu score geral foi ${overallScore}%. Gostaria de falar com um especialista.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm whitespace-nowrap transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #7EBF8E, #61AAF2)',
                color: '#fff',
              }}
            >
              Falar com Especialista
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardContent;
