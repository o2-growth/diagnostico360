
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { ChartBar, Server, Calendar, Calculator, DollarSign, Scale, ShoppingCart, Megaphone, Building2, User, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChart, setShowChart] = useState(true);
  const [activeTab, setActiveTab] = useState('areas');

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
            {
              number: '1',
              text: 'Como está o fluxo de caixa da empresa?',
              isApplicable: true,
              applicationForm: 'Análise mensal do fluxo de caixa',
              evidence: 'Relatórios de fluxo de caixa, extratos bancários',
              hasSolution: true
            },
            {
              number: '2',
              text: 'Qual é a margem de lucro atual?',
              isApplicable: true,
              applicationForm: 'Cálculo mensal das margens',
              evidence: 'DRE, relatórios gerenciais',
              hasSolution: true
            },
            {
              number: '3',
              text: 'Como está o controle de despesas?',
              isApplicable: true,
              applicationForm: 'Controle diário de despesas',
              evidence: 'Planilhas de controle, sistema financeiro',
              hasSolution: true
            },
            {
              number: '4',
              text: 'A empresa possui sistema de análise de custos implementado?',
              isApplicable: true,
              applicationForm: 'Sistema de custos integrado',
              evidence: 'Sistema ERP, relatórios de custos',
              hasSolution: true
            },
            {
              number: '5',
              text: 'Existe controle e acompanhamento da rentabilidade por produto/serviço?',
              isApplicable: true,
              applicationForm: 'Análise mensal de rentabilidade',
              evidence: 'Relatórios de rentabilidade por produto',
              hasSolution: true
            },
            {
              number: '6',
              text: 'Como está o processo de formação de preços?',
              isApplicable: true,
              applicationForm: 'Política de preços definida',
              evidence: 'Planilhas de formação de preços',
              hasSolution: true
            },
            {
              number: '7',
              text: 'Existe orçamento anual definido e aprovado?',
              isApplicable: true,
              applicationForm: 'Planejamento orçamentário anual',
              evidence: 'Documento de orçamento aprovado',
              hasSolution: true
            },
            {
              number: '8',
              text: 'Como está o acompanhamento periódico da execução orçamentária?',
              isApplicable: true,
              applicationForm: 'Reuniões mensais de acompanhamento',
              evidence: 'Atas de reunião, relatórios de execução',
              hasSolution: true
            },
            {
              number: '9',
              text: 'São realizadas previsões financeiras regularmente?',
              isApplicable: true,
              applicationForm: 'Previsões trimestrais',
              evidence: 'Relatórios de previsão financeira',
              hasSolution: true
            }
          ]
        };
      case 'tecnologia':
        return {
          name: 'Tecnologia',
          icon: <Server className="w-5 h-5 text-purple-400" />,
          description: 'Infraestrutura e sistemas',
          questions: [
            {
              number: '1',
              text: 'Os sistemas estão atualizados?',
              isApplicable: true,
              applicationForm: 'Verificação mensal de versões',
              evidence: 'Logs de atualização',
              hasSolution: true
            },
            {
              number: '2',
              text: 'Como está a segurança da informação?',
              isApplicable: true,
              applicationForm: 'Políticas de segurança',
              evidence: 'Documentação de segurança',
              hasSolution: true
            },
            {
              number: '3',
              text: 'Qual é o nível de automação dos processos?',
              isApplicable: true,
              applicationForm: 'Mapeamento de processos',
              evidence: 'Documentação de processos',
              hasSolution: true
            }
          ]
        };
      case 'planejamento':
        return {
          name: 'Planejamento',
          icon: <Calendar className="w-5 h-5 text-green-400" />,
          description: 'Estratégia e projetos',
          questions: [
            {
              number: '1',
              text: 'Existem metas claras definidas?',
              isApplicable: true,
              applicationForm: 'Definição anual de metas',
              evidence: 'Documento de metas',
              hasSolution: true
            },
            {
              number: '2',
              text: 'Como está o acompanhamento dos projetos?',
              isApplicable: true,
              applicationForm: 'Reuniões semanais',
              evidence: 'Relatórios de progresso',
              hasSolution: true
            },
            {
              number: '3',
              text: 'As estratégias estão alinhadas com o mercado?',
              isApplicable: true,
              applicationForm: 'Análise trimestral',
              evidence: 'Relatórios de mercado',
              hasSolution: true
            }
          ]
        };
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="col-span-1 lg:col-span-2">
                        <p className="font-medium">
                          {question.number}. {question.text}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm text-dashboard-muted mb-1">
                          É aplicável nessa unidade?
                        </label>
                        <select className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2">
                          <option value="">Selecione</option>
                          <option value="sim">Sim</option>
                          <option value="nao">Não</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-dashboard-muted mb-1">
                          Forma de Aplicação
                        </label>
                        <p className="text-sm">{question.applicationForm}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-dashboard-muted mb-1">
                          Evidências
                        </label>
                        <p className="text-sm">{question.evidence}</p>
                      </div>
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
