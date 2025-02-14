
import type { Question } from '@/types/department';

export const taxQuestions: Question[] = [
  {
    item: "8.1",
    title: "Gestão Fiscal",
    question: "A empresa possui gestão fiscal adequada?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com fiscal;",
      "2) Análise de documentos"
    ],
    evidence: "Documentação fiscal, certidões",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "8.2",
    title: "Conformidade Fiscal",
    question: "A empresa está em conformidade com as obrigações fiscais?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com fiscal;",
      "2) Análise de documentos"
    ],
    evidence: "Certidões negativas, comprovantes de entrega",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
