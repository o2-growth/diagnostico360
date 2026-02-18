
import type { Question } from '@/types/department';

export const technologyQuestions: Question[] = [
  {
    item: "2.1",
    title: "Sistemas",
    question: "A empresa possui sistema para dar suporte à gestão financeira, buscando simplificar e automatizar tarefas e ações operacionais?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e pessoal de TI",
      "(Conhecer Sistemas, Identificar Softwares, fazer breve descritivo das ferramentas e aplicações utilizadas com os seus respectivos módulos)"
    ],
    evidence: "Nome das ferramentas atualmente utilizadas",
    hasEvidence: "SIM",
  },
  {
    item: "2.2",
    title: "Suporte",
    question: "Há treinamento e suporte contínuo quanto ao uso do sistema de gestão financeira e outras tecnologias dentro da organização?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e pessoal de TI (Verificar Relatório de atendimento, chamados abertos e atendidos, contratos de suporte e SLA's com as Software Houses)"
    ],
    evidence: "Relatório de atendimento, chamados abertos e atendidos, contratos de suporte e SLA's com as Software Houses",
    hasEvidence: "SIM",
  },
  {
    item: "2.3",
    title: "Segurança e Backup",
    question: "Existe rotina periódica onde os dados financeiros estão protegidos?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e pessoal de TI;",
      "2) Solicitar Evidências"
    ],
    evidence: "Local onde é realizado o backup e periodicidade",
    hasEvidence: "SIM",
  },
  {
    item: "2.4",
    title: "Infraestrutura",
    question: "A empresa possui equipamentos suficientes que suportem ao bom funcionamento da gestão financeira?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e pessoal de TI;",
      "2) Solicitar Evidências"
    ],
    evidence: "Inventário dos equipamentos ou lista dos principais itens da infraestrutura",
    hasEvidence: "SIM",
  },
  {
    item: "2.5",
    title: "Integração de Sistemas",
    question: "Os sistemas utilizados pela empresa estão integrados entre si, permitindo o fluxo de informações entre as diferentes áreas sem necessidade de retrabalho manual?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e pessoal de TI;",
      "2) Solicitar Evidências"
    ],
    evidence: "Mapa de integrações entre sistemas, documentação de APIs e fluxos de dados",
    hasEvidence: "SIM",
  },
  {
    item: "2.6",
    title: "Inovação Tecnológica",
    question: "A empresa acompanha tendências tecnológicas e avalia periodicamente oportunidades de inovação para melhorar seus processos e competitividade?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e pessoal de TI;",
      "2) Solicitar Evidências"
    ],
    evidence: "Plano de inovação tecnológica, cronograma de atualizações, projetos de melhoria",
    hasEvidence: "SIM",
  },
  {
    item: "2.7",
    title: "Automação",
    question: "Existe integração entre a atividade fim do negócio e as atividades financeiras (faturamento, contas a receber, cobrança e contas a pagar)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e pessoal de TI"
    ],
    evidence: "",
    hasEvidence: "SIM",
  }
];
