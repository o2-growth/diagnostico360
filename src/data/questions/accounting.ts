
import type { Question } from '@/types/department';

export const accountingQuestions: Question[] = [
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
    evaluation: "EXISTE E FUNCIONA PERFEITAMENTE"
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
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
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
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  },
  {
    item: "8.4",
    title: "Precisão dos Registros e Conformidade",
    question: "",
    applicable: "SIM",
    application: [],
    evidence: "",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  },
  {
    item: "8.5",
    title: "Fechamento e Reporte",
    question: "",
    applicable: "SIM",
    application: [],
    evidence: "",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  },
  {
    item: "8.6",
    title: "Gestão de Tributos",
    question: "",
    applicable: "SIM",
    application: [],
    evidence: "",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  },
  {
    item: "8.7",
    title: "Planejamento",
    question: "É realizada reunião periódica com a contabilidade para obtenção de oportunides ou identificação de pontos de melhorias?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Cronograma de Reuniões, Atas",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  }
];
