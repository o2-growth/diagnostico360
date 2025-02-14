
import type { Question } from '@/types/department';

export const planningQuestions: Question[] = [
  {
    item: "10.1",
    title: "Inovação",
    question: "Existe planejamento de criação de novos serviços ou novas fontes de receitas?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão;",
      "2) Solicitar Evidências"
    ],
    evidence: "Projetos, Cronograma de Reuniões, Atas, Comitê de Inovação",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  },
  {
    item: "10.2",
    title: "Crescimento e Expansão",
    question: "Existe um planejamento de médio e longo prazo para crescimento e expansão do negócio, construído de forma conjunta entre o conselho de administração e sócios da empresa e está registrado num plano de ação que é acompanhado consistentemente?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão;",
      "2) Solicitar Evidências"
    ],
    evidence: "Planejamento Estratégico de Crescimento e Expansão, Plano de Execução",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  },
  {
    item: "10.3",
    title: "Estratégia",
    question: "As estratégia de curto, médio e longo prazo são anualmente revisadas e construídas de forma estruturada através de um processo organizado de forma coletiva e aprovada pelo conselho de administração e sócios da organização? Elas são compartilhadas e desdobradas corretamente para todos os níveis da organização?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão;",
      "2) Solicitar Evidências"
    ],
    evidence: "Planejamento Estratégico, Mapa estratégico, BSC, Métrica e Indicadores",
    hasEvidence: "SIM",
    evaluation: "EXISTE E FUNCIONA PERFEITAMENTE"
  }
];
