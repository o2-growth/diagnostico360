
import { useNavigate } from 'react-router-dom';
import CustomerRequests from '@/components/CustomerRequests';
import MetricCard from '@/components/MetricCard';
import MonthlyChart from '@/components/MonthlyChart';

const DashboardContent = () => {
  const navigate = useNavigate();
  const areas = [
    { id: 'financeiro', title: 'Financeiro', value: 65, color: '#7EBF8E' },
    { id: 'tecnologia', title: 'Tecnologia', value: 45, color: '#8989DE' },
    { id: 'planejamento', title: 'Planejamento', value: 35, color: '#61AAF2' },
    { id: 'contabil', title: 'Contábil', value: 55, color: '#F97316' },
    { id: 'controladoria', title: 'Controladoria', value: 40, color: '#9b87f5' },
    { id: 'fiscal', title: 'Fiscal', value: 60, color: '#0EA5E9' },
    { id: 'comercial', title: 'Comercial', value: 70, color: '#EC4899' },
    { id: 'marketing', title: 'Marketing', value: 50, color: '#F59E0B' },
    { id: 'societario', title: 'Societário', value: 45, color: '#10B981' },
    { id: 'capital-humano', title: 'Capital Humano', value: 55, color: '#6366F1' },
  ];

  const handleCardClick = (areaId: string) => {
    navigate(`/department/${areaId}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho e Gráfico de Resultado */}
      <div>
        <header className="mb-8">
          <h1 className="text-3xl font-medium mb-2">Resultado</h1>
          <p className="text-dashboard-muted">Acompanhe o nível de excelência atual de cada área</p>
        </header>
        
        {/* Gráfico de Resultado */}
        <MonthlyChart />
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {areas.map((area) => (
          <div 
            key={area.id}
            onClick={() => handleCardClick(area.id)}
            className="cursor-pointer"
          >
            <MetricCard
              title={area.title}
              value={area.value}
              color={area.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
