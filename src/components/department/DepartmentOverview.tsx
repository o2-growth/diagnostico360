
import { DepartmentData } from "@/types/department";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import DepartmentRadar from './DepartmentRadar';
import MetricCard from '../MetricCard';

interface DepartmentOverviewProps {
  departmentInfo: DepartmentData;
  calculateTotalCost: () => number;
  evolutionData: any[];
  questions: any[];
}

const DepartmentOverview = ({ 
  departmentInfo, 
  calculateTotalCost, 
  questions
}: DepartmentOverviewProps) => {
  const calculateScore = () => {
    if (!questions || questions.length === 0) return 0;
    
    const totalAnswered = questions.filter(q => 
      q.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE" || 
      q.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
    ).length;
    
    return Math.round((totalAnswered / questions.length) * 100);
  };

  const score = calculateScore();

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h2 className="text-xl font-medium mb-6">Nota final</h2>
          <div className="flex justify-center">
            <MetricCard
              title={departmentInfo.name}
              value={score}
              color={departmentInfo.color || "#61AAF2"}
            />
          </div>
        </div>
        
        <DepartmentRadar questions={questions} />
      </div>

      <div className="dashboard-card">
        <h2 className="text-xl font-medium mb-6">Custos</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Custo Total Mensal</h3>
            <p className="text-2xl font-bold text-dashboard-primary">
              R$ {calculateTotalCost().toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-dashboard-muted mb-2">Equipe</h4>
              <div className="space-y-2">
                {departmentInfo.team.map((member, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{member.role}</span>
                    <span>R$ {(member.salary + member.benefits).toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-dashboard-muted mb-2">Ferramentas</h4>
              <div className="space-y-2">
                {departmentInfo.tools.map((tool, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{tool.name}</span>
                    <span>R$ {tool.monthlyCost.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentOverview;

