import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { ChartBar, Server, Calendar, Calculator, DollarSign, Scale, ShoppingCart, Megaphone, Building2, User, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChart, setShowChart] = useState(true);
  const [activeTab, setActiveTab] = useState('areas');

  const handleBack = () => {
    navigate('/', { state: { activeTab: 'areas' } });
  };

  const getDepartmentEvolutionData = (deptId: string | undefined) => {
    // Dados de exemplo - em uma aplicação real, estes dados viriam de uma API
    return [
      { period: 'Jan/23', value: 30 },
      { period: 'Fev/23', value: 32 },
      { period: 'Mar/23', value: 35 },
      { period: 'Abr/23', value: 38 },
      { period: 'Mai/23', value: 40 },
      { period: 'Jun/23', value: 42 },
      { period: 'Jul/23', value: 45 },
      { period: 'Ago/23', value: 47 },
      { period: 'Set/23', value: 48 },
      { period: 'Out/23', value: 50 },
      { period: 'Nov/23', value: 52 },
      { period: 'Dez/23', value: 55 },
    ];
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
  const evolutionData = getDepartmentEvolutionData(id);

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={setActiveTab} />
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Evolução do {departmentInfo.name}</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-dashboard-muted hover:text-white"
                  onClick={() => setShowChart(!showChart)}
                >
                  {showChart ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </Button>
              </div>
              
              {showChart && (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="period" 
                        stroke="#828179"
                        fontSize={12}
                        tickMargin={10}
                        interval={2}
                      />
                      <YAxis 
                        stroke="#828179"
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1A1A19',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px'
                        }}
                        labelStyle={{ color: '#C4C3BB' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8989DE"
                        strokeWidth={2}
                        dot={{ fill: '#8989DE' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

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
