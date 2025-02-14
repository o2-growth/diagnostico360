import type { Question } from '@/types/department';

export const questions: Question[] = [
  {
    item: "7.1",
    title: "Planejamento Tributário",
    question: "A tributação da empresa está enquadrada no melhor regime tributário para a sua atividade econômica?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão, financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Regime fiscal de apuração dos tributos através da Contabilidade, Estudos de Impacto de Carga Tributária, Relatório de Acompanhamento mensal de Tributos, Relatório de Recolhimentos",
    hasEvidence: "SIM"
  },
  {
    item: "7.2",
    title: "Recolhimento de Tributos",
    question: "Os impostos e taxas são pagos rigorosamente em dia?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão, financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Comprovante de regularidade fiscal: Federal, Estadual e Municipal",
    hasEvidence: "SIM"
  },
  {
    item: "7.3",
    title: "Apuração Fiscal",
    question: "A empresa realiza apuração de 100% das suas vendas?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão, financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Extrato da apuração dos tributos",
    hasEvidence: "SIM"
  },
  {
    item: "7.4",
    title: "Conformidade Fiscal e Tributária",
    question: "A empresa mantém toda a documentação fiscal atualizada e organizada?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão, financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Documentação fiscal organizada e atualizada",
    hasEvidence: "SIM"
  },
  {
    item: "7.5",
    title: "Automação",
    question: "Existe integração fiscal (faturamento) com as atividades financeiras (faturamento, contas a receber, cobrança e contas a pagar)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão, financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Sistema integrado de gestão fiscal e financeira",
    hasEvidence: "NÃO"
  },
  {
    item: "6.1",
    title: "Capital de Giro",
    question: "A empresa possui capital de giro suficiente para cobrir pelo menos 4 meses de sua operação?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Relatório de Fluxo de Caixa Projetado",
    hasEvidence: "SIM"
  },
  {
    item: "6.2",
    title: "Meta Financeira",
    question: "A empresa possui clareza sobre a meta financeira necessária para atingir os objetivos empresariais e desejados pelos sócios?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Planejamento Orçamentário para os próximos 12 meses",
    hasEvidence: "SIM"
  },
  {
    item: "6.3",
    title: "Orçamento",
    question: "Existe planejamento orçamentário para projeção dos resultados financeiros a serem alcançados?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Planejamento Orçamentário para os próximos 12 meses",
    hasEvidence: "SIM"
  },
  {
    item: "6.4",
    title: "Ponto de Equilíbrio",
    question: "A empresa sabe qual é o ponto de equilíbrio do negócio (receita mínima necessária para não ter geração de caixa negativa ou positiva = 0)?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Relatório de análise do ponto de equilíbrio",
    hasEvidence: "SIM"
  },
  {
    item: "6.5",
    title: "Gestão Orçamentária",
    question: "Existe acompanhamento do planejamento orçamentário com os resultados previstos sendo confrontados com os resultados realizados?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Relatório de Fluxo de Caixa Orçado x Fluxo de Caixa Realizado",
    hasEvidence: "SIM"
  },
  {
    item: "6.6",
    title: "Gestão de Custos e Despesas",
    question: "Existe método para realizar uma gestão e controle efetivo de custos e despesas mensais?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Relatório de Fluxo de Caixa Realizado",
    hasEvidence: "SIM"
  },
  {
    item: "6.7",
    title: "Análise Vertical / Horizontal",
    question: "Existe análise dos grupos de contas (recebimentos e pagamentos) relativos ao mês anterior?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Relatório de Fluxo de Caixa Realizado",
    hasEvidence: "SIM"
  },
  {
    item: "6.8",
    title: "Indicadores",
    question: "Existem indicadores econômicos e financeiros (como margem de contribuição, margem líquida, geração de caixa, outro)?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e Financeiro;", "2) Solicitar Evidências"],
    evidence: "Relatório do sistema de gestão financeiro",
    hasEvidence: "SIM"
  },
  {
    item: "6.9",
    title: "Relatórios",
    question: "Existem relatórios que deem suporte ao acompanhamento dos resultados mensais?",
    applicable: "SIM",
    application: ["1) Entrevistas com gestão e manutenção;", "2) Solicitar Evidências"],
    evidence: "Relatório do sistema de gestão financeiro",
    hasEvidence: "SIM"
  }
];
