
import { Users } from 'lucide-react';
import { DepartmentData } from '@/types/department';

interface DepartmentOverviewProps {
  departmentInfo: DepartmentData;
  calculateTotalCost: () => number;
}

const DepartmentOverview = ({ departmentInfo, calculateTotalCost }: DepartmentOverviewProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-medium mb-4">Sobre a área</h3>
        <p className="text-dashboard-muted">
          {departmentInfo.title} é uma área estratégica que desempenha um papel fundamental 
          na estrutura organizacional da empresa. Com foco em excelência e inovação, a área 
          busca constantemente aprimorar seus processos e entregar resultados de alta qualidade.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="font-medium">Responsável pela área</h4>
          <p className="text-dashboard-muted">{departmentInfo.leader}</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium">Colaboradores</h4>
          <div className="flex items-center gap-2 text-dashboard-muted">
            <Users className="h-4 w-4" />
            <span>{departmentInfo.employees}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">Equipe</h3>
          <p className="text-dashboard-muted">
            Custo Total: R$ {calculateTotalCost().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-dashboard-card-hover border-b border-dashboard-border">
                <th className="py-3 px-4 text-left font-medium">Nome</th>
                <th className="py-3 px-4 text-left font-medium">Função</th>
                <th className="py-3 px-4 text-left font-medium">Remuneração</th>
                <th className="py-3 px-4 text-left font-medium">Benefícios</th>
                <th className="py-3 px-4 text-left font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {departmentInfo.team.map((employee, index) => (
                <tr key={index} className="border-b border-dashboard-border">
                  <td className="py-4 px-4">{employee.name}</td>
                  <td className="py-4 px-4">{employee.role}</td>
                  <td className="py-4 px-4">R$ {employee.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-4 px-4">R$ {employee.benefits.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-4 px-4">R$ {(employee.salary + employee.benefits).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-medium">Ferramentas</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-dashboard-card-hover border-b border-dashboard-border">
                <th className="py-3 px-4 text-left font-medium">Ferramenta</th>
                <th className="py-3 px-4 text-left font-medium">Plano</th>
                <th className="py-3 px-4 text-left font-medium">Responsável</th>
                <th className="py-3 px-4 text-left font-medium">Objetivo</th>
                <th className="py-3 px-4 text-left font-medium">Custo Mensal</th>
                <th className="py-3 px-4 text-left font-medium">Custo Anual</th>
              </tr>
            </thead>
            <tbody>
              {departmentInfo.tools.map((tool, index) => (
                <tr key={index} className="border-b border-dashboard-border">
                  <td className="py-4 px-4">{tool.name}</td>
                  <td className="py-4 px-4">{tool.plan}</td>
                  <td className="py-4 px-4">{tool.responsible}</td>
                  <td className="py-4 px-4">{tool.purpose}</td>
                  <td className="py-4 px-4">R$ {tool.monthlyCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-4 px-4">R$ {tool.annualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Principais responsabilidades</h4>
        <ul className="list-disc pl-6 space-y-2 text-dashboard-muted">
          <li>Desenvolvimento e implementação de estratégias</li>
          <li>Gestão e otimização de recursos</li>
          <li>Análise e monitoramento de indicadores</li>
          <li>Coordenação de projetos estratégicos</li>
          <li>Implementação de melhorias contínuas</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Objetivos e metas</h4>
        <ul className="list-disc pl-6 space-y-2 text-dashboard-muted">
          <li>Aumentar a eficiência operacional</li>
          <li>Desenvolver e capacitar a equipe</li>
          <li>Otimizar processos internos</li>
          <li>Garantir conformidade com normas e regulamentos</li>
          <li>Promover inovação e melhoria contínua</li>
        </ul>
      </div>
    </div>
  );
};

export default DepartmentOverview;
