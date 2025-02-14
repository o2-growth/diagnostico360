
import type { Question } from '@/types/department';

export const technologyQuestions: Question[] = [
  {
    item: "3.1",
    title: "Infraestrutura de TI",
    question: "A empresa possui infraestrutura de TI adequada e segura?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e TI;",
      "2) Solicitar Evidências"
    ],
    evidence: "Documentação de infraestrutura, políticas de segurança",
    hasEvidence: "SIM",
    maxScore: 10
  },
  {
    item: "3.2",
    title: "Sistemas e Softwares",
    question: "Os sistemas e softwares utilizados são adequados e atualizados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e TI;",
      "2) Análise dos sistemas"
    ],
    evidence: "Licenças de software, documentação de sistemas",
    hasEvidence: "SIM",
    maxScore: 10
  }
];
