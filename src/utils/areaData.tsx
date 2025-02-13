import { ChartBar, Server, Calendar, Calculator, DollarSign, Scale, ShoppingCart, Megaphone, Building2, User } from 'lucide-react';

export interface Question {
  number: string;
  text: string;
  isApplicable: boolean;
  applicationForm: string;
  evidence: string;
  hasSolution: boolean;
}

export interface AreaInfo {
  name: string;
  icon: JSX.Element;
  description: string;
  questions: Question[];
}

export const getAreaInfo = (areaId: string | undefined): AreaInfo => {
  switch (areaId) {
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
        name: 'Área não encontrada',
        icon: <Building2 className="w-5 h-5 text-gray-400" />,
        description: '',
        questions: []
      };
  }
};

export const getAreaEvolutionData = (areaId: string | undefined) => {
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
