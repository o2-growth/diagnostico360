
import { useNavigate } from 'react-router-dom';
import CustomerRequests from '@/components/CustomerRequests';
import MetricCard from '@/components/MetricCard';
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { questions } from '@/data/questions';

const DashboardContent = () => {
  const navigate = useNavigate();
  
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

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Resultado</h1>
        <p className="text-dashboard-muted">Acompanhe o nível de excelência atual de cada área</p>
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

