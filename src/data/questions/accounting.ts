
import type { Question } from '@/types/department';

export const accountingQuestions: Question[] = [
  {
    item: "6.1",
    title: "Contabilidade",
    question: "A contabilidade está em dia e organizada?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com contabilidade;",
      "2) Análise de documentos"
    ],
    evidence: "Balancetes, demonstrações contábeis",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "6.2",
    title: "Conformidade",
    question: "A empresa está em conformidade com as normas contábeis?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com contabilidade;",
      "2) Análise de documentos"
    ],
    evidence: "Relatórios de auditoria, certidões",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
