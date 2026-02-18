
import { ChartBar, Server, Calendar, Calculator, DollarSign, Scale, ShoppingCart, Megaphone, Building2, User } from 'lucide-react';
import DepartmentItem from './DepartmentItem';
import { calculateScores } from '@/utils/scoreCalculator';

interface DepartmentsListProps {
  onDepartmentClick: (deptId: string) => void;
}

const DepartmentsList = ({ onDepartmentClick }: DepartmentsListProps) => {
  const { departmentScores } = calculateScores();

  const departments = [
    { id: 'financeiro', icon: ChartBar, title: 'Financeiro', description: 'Gestão financeira', color: 'text-blue-400', progress: departmentScores['financeiro'] ?? 0 },
    { id: 'tecnologia', icon: Server, title: 'Tecnologia', description: 'Infraestrutura e sistemas', color: 'text-purple-400', progress: departmentScores['tecnologia'] ?? 0 },
    { id: 'planejamento', icon: Calendar, title: 'Planejamento', description: 'Estratégia e projetos', color: 'text-green-400', progress: departmentScores['planejamento'] ?? 0 },
    { id: 'contabil', icon: Calculator, title: 'Contábil', description: 'Contabilidade', color: 'text-yellow-400', progress: departmentScores['contabil'] ?? 0 },
    { id: 'controladoria', icon: DollarSign, title: 'Controladoria', description: 'Controle e auditoria', color: 'text-blue-400', progress: departmentScores['controladoria'] ?? 0 },
    { id: 'fiscal', icon: Scale, title: 'Fiscal', description: 'Gestão tributária', color: 'text-indigo-400', progress: departmentScores['fiscal'] ?? 0 },
    { id: 'comercial', icon: ShoppingCart, title: 'Comercial', description: 'Vendas e negócios', color: 'text-red-400', progress: departmentScores['comercial'] ?? 0 },
    { id: 'marketing', icon: Megaphone, title: 'Marketing', description: 'Comunicação e marca', color: 'text-orange-400', progress: departmentScores['marketing'] ?? 0 },
    { id: 'societario', icon: Building2, title: 'Societário', description: 'Gestão corporativa', color: 'text-teal-400', progress: departmentScores['societario'] ?? 0 },
    { id: 'capital-humano', icon: User, title: 'Capital Humano', description: 'Recursos humanos', color: 'text-pink-400', progress: departmentScores['capital-humano'] ?? 0 },
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Áreas</h1>
        <p className="text-dashboard-muted">Gerencie os diferentes setores da empresa</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <div className="space-y-3">
            {departments.slice(0, 5).map((dept) => (
              <DepartmentItem
                key={dept.id}
                icon={dept.icon}
                title={dept.title}
                description={dept.description}
                onClick={() => onDepartmentClick(dept.id)}
                iconColor={dept.color}
                progress={dept.progress}
              />
            ))}
          </div>
        </div>
        <div className="dashboard-card">
          <div className="space-y-3">
            {departments.slice(5).map((dept) => (
              <DepartmentItem
                key={dept.id}
                icon={dept.icon}
                title={dept.title}
                description={dept.description}
                onClick={() => onDepartmentClick(dept.id)}
                iconColor={dept.color}
                progress={dept.progress}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentsList;
