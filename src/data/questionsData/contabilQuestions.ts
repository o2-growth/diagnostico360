
import type { Question } from '@/types/department';

export const contabilQuestions: Question[] = [
  {
    item: "8.1",
    title: "Balancete e DRE",
    question: "A empresa recebe mensalmente o balancete e DRE da contabilidade (até o dia 10 de cada mês, pelo menos)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Balancete mensal, preferencialmente dos últimos 3 meses realizados",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "8.2",
    title: "Automação",
    question: "Existe integração contábil (movimentações de débitos e créditos) com as atividades financeiras (faturamento, contas a receber, cobrança e contas a pagar)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "1) Visita com demonstração e relato",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "8.3",
    title: "Documentação",
    question: "Os documentos das movimentações de entradas e saídas (notas fiscais, cupons fiscais, recibos, comprovantes de pagamentos, contratos) estão devidamente organizados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Extratos bancários, comprovantes de pagamentos (notas fiscais e/ou cupons fiscais)",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "8.4",
    title: "Precisão dos Registros e Conformidade",
    question: "A empresa mantém registros contábeis precisos e em conformidade com as normas?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Registros contábeis e documentação de suporte",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "8.5",
    title: "Fechamento e Reporte",
    question: "A empresa realiza fechamento contábil mensal completo e gera relatórios adequados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatórios de fechamento mensal",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "8.6",
    title: "Gestão de Tributos",
    question: "A empresa possui sistema eficiente de gestão tributária?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Sistema de gestão tributária e relatórios",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "8.7",
    title: "Planejamento",
    question: "É realizada reunião periódica com a contabilidade para obtenção de oportunides ou identificação de pontos de melhoria?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Cronograma de Reuniões, Atas",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
