
import type { Question } from '@/types/department';

export const questions: Question[] = [
  {
    item: "5.1",
    title: "Plano de Contas",
    question: "Existe um plano de contas gerencial financeiro, separandos os grupos de recebimentos (entradas) e pagamentos (saídas) aderente à operação da empresa?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatório do sistema de gestão financeiro",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.2",
    title: "Contas a Pagar",
    question: "Todas as movimentações relativas às obrigações com fornecedores estão devidamente registradas e controladas no sistema de gestão financeiro?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Processos documentados de CAP, relatórios diários / mensais, Checklist de Lançamentos e Processamentos Diários (com quantidade de NF de entrada e Saída processadas), Registro de Treinamento",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.3",
    title: "Contas a Receber",
    question: "Todas as movimentações relativas aos direitos das vendas aos clientes estão devidamente registradas e controladas no sistema de gestão financeiro?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Processos documentados de CAR, relatórios diários / mensais, Checklist de Lançamentos e Processamentos Diários (com quantidade de NF de entrada e Saída processadas), Registro de Treinamento",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.4",
    title: "Conciliação Bancária",
    question: "A conciliação bancária está em dia? Os saldos dos bancos (e caixa/fundo fixo) são devidamente atualizados no sistema diariamente?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatório do sistema de gestão financeiro",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.5",
    title: "Fluxo de Caixa",
    question: "A empresa possui um demonstrativo mensal dos recebimentos x pagamentos, permitindo analisar, projetar e tomar decisões baseadas em informação real e confiável?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatório do sistema de gestão financeiro",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.6",
    title: "Crédito e Cobrança",
    question: "Há uma política clara de fornecimento de crédito, forma de pagamento e acompanhamento da cobrança aos clientes?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Processos e Políticas Documentadas de Crédito, Cobrança, Limite de Crédito, Régua de Cobrança, Relatórios diários / Mensais",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.7",
    title: "Rentabilidade e Análise de Custo",
    question: "A empresa realiza análise de rentabilidade e custos periodicamente?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatórios de análise de rentabilidade e custos",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.8",
    title: "Controle Orçamentário e Previsão Financeira",
    question: "A empresa possui controle orçamentário e realiza previsões financeiras regulares?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatórios de controle orçamentário e previsões financeiras",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "5.9",
    title: "Relatórios",
    question: "Existem relatórios que deem suporte ao acompanhamento das movimentações financeiras periodicamente (diário, semanal e mensal)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e Financeiro;",
      "2) Solicitar Evidências"
    ],
    evidence: "Relatório do sistema de gestão financeiro",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
