
import type { Question } from '@/types/department';

export const controllingQuestions: Question[] = [
  {
    item: "7.1",
    title: "Controles Internos",
    question: "Existem controles internos implementados e documentados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com controladoria;",
      "2) Análise de processos"
    ],
    evidence: "Manuais de procedimentos, documentação de controles",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "7.2",
    title: "Gestão de Riscos",
    question: "Existe um processo formal de gestão de riscos?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com controladoria;",
      "2) Análise de documentos"
    ],
    evidence: "Matriz de riscos, relatórios de controles",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
