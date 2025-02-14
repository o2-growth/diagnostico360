
import type { Question } from '@/types/department';

export const humanCapitalQuestions: Question[] = [
  {
    item: "9.1",
    title: "Plano de Cargos e Salários",
    question: "Existe plano de cargos e salários para a equipe de colaboradores? Existe um plano de cargos e salários escrito e documentado, é praticado e conhecido por todos os colaboradores nos seus respectivos níveis dentro da organização?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e RH/GP;",
      "2) Solicitar Evidências"
    ],
    evidence: "Plano de Cargos e Salários, Modelo de Remuneração Estratégica (PPLR), Registro de Treinamento",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)",
    maxScore: 10
  },
  {
    item: "9.2",
    title: "Benefícios",
    question: "Existe algum plano de benefícios na empresa (plano de saúde, odontológico, reembolso de academia, outro)?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e RH/GP;",
      "2) Solicitar Evidências"
    ],
    evidence: "Lista dos benefícios, juntamente com os comprovantes de pagamentos do último mês realizado",
    hasEvidence: "SIM",
    evaluation: "EXISTE E FUNCIONA PERFEITAMENTE",
    maxScore: 10
  },
  {
    item: "9.3",
    title: "Obrigações Trabalhistas",
    question: "A apuração e o recolhimento dos encargos sociais são pagos rigorosamente em dia?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e RH/GP;",
      "2) Solicitar Evidências"
    ],
    evidence: "Comprovantes do recolhimento dos encargos do último mês realizado",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)",
    maxScore: 10
  },
  {
    item: "9.4",
    title: "PLR",
    question: "Existe alguma iniciativa para premiação através de Participação nos Lucros e Resultados? E existe um Modelo de Remuneração Estratégica ou Participação nos Resultados?",
    applicable: "SIM",
    application: [
      "1) Entrevistas com gestão e RH/GP;",
      "2) Solicitar Evidências"
    ],
    evidence: "Plano de Cargos e Salários, Modelo de Remuneração Estratégica (PPLR), Registro de Treinamento",
    hasEvidence: "SIM",
    evaluation: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)",
    maxScore: 10
  }
];
