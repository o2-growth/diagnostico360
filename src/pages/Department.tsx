import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SidePanel from '@/components/SidePanel';
import CustomerRequests from '@/components/CustomerRequests';
import DepartmentEvolution from '@/components/department/DepartmentEvolution';
import DepartmentOverview from '@/components/department/DepartmentOverview';
import DepartmentQuestions from '@/components/department/DepartmentQuestions';
import type { DepartmentData, Question } from '@/types/department';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const questions: Question[] = [
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

  return (
    <div className="min-h-screen">
      <SidePanel onMenuToggle={handleMenuToggle} />
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
            <DepartmentEvolution data={evolutionData} />
            <CustomerRequests />
          </div>

          <div className="mt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="questions">Perguntas</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <DepartmentOverview 
                  departmentInfo={departmentInfo}
                  calculateTotalCost={calculateTotalCost}
                />
              </TabsContent>
              <TabsContent value="questions">
                <DepartmentQuestions questions={questions} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
