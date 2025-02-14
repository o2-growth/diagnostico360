
import type { Question } from '@/types/department';

export const controllingQuestions: Question[] = [
  {
    item: "6.1",
    title: "Capital de Giro",
    question: "A empresa possui capital de giro suficiente para cobrir pelo menos 4 meses da sua operação?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatório de Fluxo de Caixa Projetado",
    hasEvidence: "SIM"
  },
  {
    item: "6.2",
    title: "Meta Financeira",
    question: "A empresa possui clareza sobre a meta financeira necessária para atingir os objetivos empresariais e desejados pelos sócios?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Planejamento Orçamentário para os próximos 12 meses",
    hasEvidence: "SIM"
  },
  {
    item: "6.3",
    title: "Orçamento",
    question: "Existe planejamento orçamentário para projeção dos resultados financeiros a serem alcançados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Planejamento Orçamentário para os próximos 12 meses",
    hasEvidence: "SIM"
  },
  {
    item: "6.4",
    title: "Ponto de Equilíbrio",
    question: "A empresa sabe qual é o ponto de equilíbrio do negócio (receita mínima necessária para não ter geração de caixa negativa ou positiva = 0)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "",
    hasEvidence: "SIM"
  },
  {
    item: "6.5",
    title: "Gestão Orçamentária",
    question: "Existe acompanhamento do planejamento orçamentário com os resultados previstos sendo confrontados com os resultados realizados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatório de Fluxo de Caixa Orçado x Fluxo de Caixa Realizado",
    hasEvidence: "SIM"
  },
  {
    item: "6.6",
    title: "Gestão de Custos e Despesas",
    question: "Existe método para realizar uma gestão e controle efetivo de custos e despesas mensais?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatório de Fluxo de Caixa Realizado",
    hasEvidence: "SIM