
import type { Question } from '@/types/department';

export const taxQuestions: Question[] = [
  {
    item: "7.1",
    title: "Planejamento Tributário",
    question: "A tributação da empresa está enquadrada no melhor regime tributário para a sua atividade econômica?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão, financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Regime fiscal de apuração dos tributos através da Contabilidade, Estudos de Impacto de Carga Tributária, Relatório de Acompanhamento mensal de Tributos, Relatório de Recolhimentos.",
    hasEvidence: "SIM",
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
    hasEvidence: "SIM",
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
    evidence: "Extrato de apuração dos tributos",
    hasEvidence: "SIM",
  },
  {
    item: "7.4",
    title: "Conformidade Fiscal e Tributária",
    question: "A empresa mantém todas as obrigações acessórias fiscais e tributárias em dia (SPED, EFD, DCTF, DIRF e demais declarações obrigatórias)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão, financeiro e contabilidade;",
      "2) Solicitar Evidências"
    ],
    evidence: "Comprovantes de envio das obrigações acessórias, certidões negativas de débitos",
    hasEvidence: "SIM",
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
    evidence: "",
    hasEvidence: "NÃO",
  }
];
