
import type { Question } from '@/types/department';

export const commercialQuestions: Question[] = [
  {
    item: "9.1",
    title: "Gestão Comercial",
    question: "Existe um processo comercial estruturado?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com comercial;",
      "2) Análise de processos"
    ],
    evidence: "Manual de vendas, CRM",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "9.2",
    title: "Metas e Resultados",
    question: "Existem metas comerciais definidas e monitoradas?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com comercial;",
      "2) Análise de indicadores"
    ],
    evidence: "Relatórios de vendas, dashboards",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
