
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { ChartBar, Server, Calendar, Calculator, DollarSign, Scale, ShoppingCart, Megaphone, Building2, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/', { state: { activeTab: 'departments' } });
  };

  const getDepartmentInfo = (deptId: string | undefined) => {
    switch (deptId) {
      case 'financeiro':
        return {
          name: 'Financeiro',
          icon: <ChartBar className="w-5 h-5 text-blue-400" />,
          description: 'Gestão financeira',
          questions: [
            'Como está o fluxo de caixa da empresa?',
            'Qual é a margem de lucro atual?',
            'Como está o controle de despesas?'
          ]
        };
      case 'tecnologia':
        return {
          name: 'Tecnologia',
          icon: <Server className="w-5 h-5 text-purple-400" />,
          description: 'Infraestrutura e sistemas',
          questions: [
            'Os sistemas estão atualizados?',
            'Como está a segurança da informação?',
            'Qual é o nível de automação dos processos?'
          ]
        };
      case 'planejamento':
        return {
          name: 'Planejamento',
          icon: <Calendar className="w-5 h-5 text-green-400" />,
          description: 'Estratégia e projetos',
          questions: [
            'Existem metas claras definidas?',
            'Como está o acompanhamento dos projetos?',
            'As estratégias estão alinhadas com o mercado?'
          ]
        };
      // ... outros departamentos seguem o mesmo padrão
      default:
        return {
          name: 'Departamento não encontrado',
          icon: <Building2 className="w-5 h-5 text-gray-400" />,
          description: '',
          questions: []
        };
    }
  };

  const departmentInfo = getDepartmentInfo(id);

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={() => {}} />
      <div className="pl-64">
        <div className="p-8">
          <Button 
            variant="outline" 
            className="mb-6 flex items-center gap-2" 
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {departmentInfo.icon}
              <h1 className="text-3xl font-medium">{departmentInfo.name}</h1>
            </div>
            <p className="text-dashboard-muted">{departmentInfo.description}</p>
          </header>

          <div className="space-y-6">
            <div className="dashboard-card">
              <h2 className="text-xl font-medium mb-4">Diagnóstico do Departamento</h2>
              <div className="space-y-4">
                {departmentInfo.questions.map((question, index) => (
                  <div key={index} className="glass-card p-4">
                    <p className="font-medium">{question}</p>
                    <div className="mt-2">
                      <select className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2">
                        <option value="">Selecione uma resposta</option>
                        <option value="otimo">Ótimo</option>
                        <option value="bom">Bom</option>
                        <option value="regular">Regular</option>
                        <option value="ruim">Ruim</option>
                      </select>
                    </div>
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

export default Department;
