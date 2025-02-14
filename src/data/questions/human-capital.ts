
import type { Question } from '@/types/department';

export const humanCapitalQuestions: Question[] = [
  {
    item: "11.1",
    title: "Gestão de Pessoas",
    question: "Existe um processo estruturado de gestão de pessoas?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com RH;",
      "2) Análise de processos"
    ],
    evidence: "Políticas de RH, procedimentos",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "11.2",
    title: "Desenvolvimento",
    question: "Existem programas de desenvolvimento e treinamento?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com RH;",
      "2) Análise de documentos"
    ],
    evidence: "Plano de treinamentos, avaliações",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
