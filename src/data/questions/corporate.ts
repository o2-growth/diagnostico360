
import type { Question } from '@/types/department';

export const corporateQuestions: Question[] = [
  {
    item: "10.1",
    title: "Governança Corporativa",
    question: "Existem práticas de governança corporativa implementadas?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com direção;",
      "2) Análise de documentos"
    ],
    evidence: "Estatuto, políticas de governança",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "10.2",
    title: "Compliance",
    question: "A empresa possui programa de compliance?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com compliance;",
      "2) Análise de documentos"
    ],
    evidence: "Código de conduta, políticas de compliance",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
