
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import { ChevronLeft, Users, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import CustomerRequests from '@/components/CustomerRequests';

interface Employee {
  name: string;
  role: string;
  salary: number;
  benefits: number;
}

interface Tool {
  name: string;
  plan: string;
  responsible: string;
  purpose: string;
  monthlyCost: number;
  annualCost: number;
}

interface DepartmentData {
  title: string;
  description: string;
  image: string;
  leader: string;
  employees: number;
  team: Employee[];
  tools: Tool[];
}

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [departmentInfo, setDepartmentInfo] = useState<DepartmentData>(() => {
    const departments: Record<string, DepartmentData> = {
      'financeiro': {
        title: 'Financeiro',
        description: 'Gestão financeira',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        leader: 'Maria Silva',
        employees: 12,
        team: [
          { name: 'João Silva', role: 'Analista Financeiro', salary: 5000, benefits: 1500 },
          { name: 'Maria Santos', role: 'Coordenadora Financeira', salary: 8000, benefits: 2000 },
          { name: 'Pedro Oliveira', role: 'Assistente Financeiro', salary: 3500, benefits: 1200 },
        ],
        tools: [
          { 
            name: 'SAP',
            plan: 'Enterprise',
            responsible: 'Maria Silva',
            purpose: 'Gestão financeira e contábil',
            monthlyCost: 5000,
            annualCost: 60000
          },
          {
            name: 'Conta Azul',
            plan: 'Business',
            responsible: 'João Silva',
            purpose: 'Controle de contas',
            monthlyCost: 500,
            annualCost: 6000
          }
        ]
      },
      // ... keep existing code (other departments)
    };
    return departments[id as keyof typeof departments] || {
      title: 'Área não encontrada',
      description: 'Esta área não existe',
      image: '',
      leader: '',
      employees: 0,
      team: [],
      tools: []
    };
  });

  const evolutionData = [
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
    { period: 'Jan/24', value: 57 },
    { period: 'Fev/24', value: 58 },
    { period: 'Mar/24', value: 60 },
    { period: 'Abr/24', value: 62 },
    { period: 'Mai/24', value: 65 },
    { period: 'Jun/24', value: 67 },
    { period: 'Jul/24', value: 70 },
    { period: 'Ago/24', value: 72 },
    { period: 'Set/24', value: 75 },
    { period: 'Out/24', value: 77 },
    { period: 'Nov/24', value: 80 },
    { period: 'Dez/24', value: 82 },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
  };

  const calculateTotalCost = () => {
    const employeeCost = departmentInfo.team.reduce((acc, emp) => 
      acc + (emp.salary + emp.benefits), 0);
    const toolsCost = departmentInfo.tools.reduce((acc, tool) => 
      acc + tool.monthlyCost, 0);
    return employeeCost + toolsCost;
  };

  const questions = [
    {
      item: "5.1",
      title: "Plano de Contas",
      question: "Existe um plano de contas gerencial financeiro, separando-os os grupos de recebimentos (entradas) e pagamentos (saídas) aderente à operação da empresa?",
      applicable: "SIM",
      application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
      evidence: "Relatório do sistema de gestão financeiro",
      hasEvidence: "SIM"
    },
    {
      item: "5.2",
      title: "Contas a Pagar",
      question: "Todas as movimentações relativas às obrigações com fornecedores estão devidamente registradas e controladas no sistema de gestão financeira?",
      applicable: "SIM",
      application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
      evidence: "Processos documentados de CAP, relatórios diários / mensais, Checklist de Lançamentos e Processamentos Diários (com quantidade de NF de entrada e Saída processadas), Registro de Treinamento",
      hasEvidence: "SIM"
    },
    {
      item: "5.3",
      title: "Contas a Receber",
      question: "Todas as movimentações relativas aos direitos das vendas aos clientes estão devidamente registradas e controladas no sistema de gestão financeira?",
      applicable: "SIM",
      application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
      evidence: "Processos documentados de CAR, relatórios diários / mensais, Checklist de Lançamentos e Processamentos Diários (com quantidade de NF de entrada e Saída processadas), Registro de Treinamento",
      hasEvidence: "SIM"
    },
    {
      item: "5.4",
      title: "Conciliação Bancária",
      question: "A conciliação bancária está em dia? Os saldos dos bancos (e caixa/fundo fixo) são devidamente atualizados no sistema diariamente?",
      applicable: "SIM",
      application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
      evidence: "Relatório do sistema de gestão financeiro",
      hasEvidence: "SIM"
    },
    {
      item: "5.5",
      title: "Fluxo de Caixa",
      question: "A empresa possui um demonstrativo mensal dos recebimentos x pagamentos, permitindo analisar, projetar e tomar decisões baseadas em informação real e confiável?",
      applicable: "SIM",
      application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
      evidence: "Relatório do sistema de gestão financeiro",
      hasEvidence: "SIM"
    },
    {
      item: "5.6",
      title: "Crédito e Cobrança",
      question: "Há uma política clara de fornecimento de crédito, forma de pagamento e acompanhamento da cobrança dos clientes?",
      applicable: "SIM",
      application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
      evidence: "Processos e Políticas Documentadas de Crédito, Cobrança, Limite de Crédito, Régua de Cobrança, Relatórios diários / Mensais",
      hasEvidence: "SIM"
    },
    {
      item: "5.7",
      title: "Rentabilidade e Análise de Custo",
      question: "",
      applicable: "SIM",
      application: [],
      evidence: "",
      hasEvidence: "SIM"
    },
    {
      item: "5.8",
      title: "Controle Orçamentário e Previsão Financeira",
      question: "",
      applicable: "SIM",
      application: [],
      evidence: "",
      hasEvidence: "SIM"
    },
    {
      item: "5.9",
      title: "Relatórios",
      question: "Existem relatórios que deem suporte ao acompanhamento das movimentações financeiras periodicamente (diário, semanal e mensal)?",
      applicable: "SIM",
      application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
      evidence: "Relatório do sistema de gestão financeiro",
      hasEvidence: "SIM"
    }
  ];

  return (
    <div className="min-h-screen">
      <SidePanel 
        onTabChange={handleTabChange} 
        onMenuToggle={handleMenuToggle}
      />
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/', { state: { activeTab: 'areas' } })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-medium mb-2">{departmentInfo.title}</h1>
              <p className="text-dashboard-muted">{departmentInfo.description}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {isEditing ? 'Salvar' : 'Editar'}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="dashboard-card">
              <h2 className="text-xl font-medium mb-6">Evolução da {departmentInfo.title}</h2>
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
            </div>

            <CustomerRequests />
          </div>

          <div className="mt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
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
              </TabsContent>
              <TabsContent value="questions">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium mb-6">Lista de Verificação</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-dashboard-card-hover border-b border-dashboard-border">
                          <th className="py-3 px-4 text-left font-medium">Item</th>
                          <th className="py-3 px-4 text-left font-medium">Perguntas</th>
                          <th className="py-3 px-4 text-left font-medium">É aplicável nessa unidade? SIM/NÃO</th>
                          <th className="py-3 px-4 text-left font-medium">Forma de Aplicação</th>
                          <th className="py-3 px-4 text-left font-medium">Evidências</th>
                          <th className="py-3 px-4 text-left font-medium">Existe evidência? S/N</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((item) => (
                          <tr key={item.item} className="border-b border-dashboard-border">
                            <td className="py-4 px-4">{item.item}</td>
                            <td className="py-4 px-4 max-w-md">
                              <div className="font-medium">{item.title}</div>
                              {item.question && <div className="text-dashboard-muted mt-1">{item.question}</div>}
                            </td>
                            <td className="py-4 px-4">{item.applicable}</td>
                            <td className="py-4 px-4">
                              <ul className="list-disc pl-4">
                                {item.application.map((app, index) => (
                                  <li key={index}>{app}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="py-4 px-4">{item.evidence}</td>
                            <td className="py-4 px-4">{item.hasEvidence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;

