
import type { Question } from '@/types/department';

export const planningQuestions: Question[] = [
  {
    item: "2.1",
    title: "Planejamento Estratégico",
    question: "Existe um planejamento estratégico formal e documentado?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão;",
      "2) Solicitar Evidências"
    ],
    evidence: "Documento de planejamento estratégico, atas de reuniões",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "2.2",
    title: "Indicadores",
    question: "Existem indicadores de desempenho definidos e monitorados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão;",
      "2) Análise de dashboards"
    ],
    evidence: "Dashboards, relatórios de indicadores",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
