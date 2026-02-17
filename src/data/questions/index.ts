
import { marketingQuestions } from './marketing';
import { financialQuestions } from './financial';
import { technologyQuestions } from './technology';
import { planningQuestions } from './planning';
import { accountingQuestions } from './accounting';
import { controllingQuestions } from './controlling';
import { taxQuestions } from './tax';
import { commercialQuestions } from './commercial';
import { corporateQuestions } from './corporate';
import { humanCapitalQuestions } from './human-capital';
import type { Question } from '@/types/department';

export interface QuestionGroup {
  id: string;
  name: string;
  prefix: string;
  questions: Question[];
}

export const questionGroups: QuestionGroup[] = [
  { id: 'societario', name: 'Societário', prefix: '1', questions: corporateQuestions },
  { id: 'tecnologia', name: 'Tecnologia', prefix: '2', questions: technologyQuestions },
  { id: 'comercial', name: 'Comercial', prefix: '3', questions: commercialQuestions },
  { id: 'marketing', name: 'Marketing', prefix: '4', questions: marketingQuestions },
  { id: 'financeiro', name: 'Financeiro', prefix: '5', questions: financialQuestions },
  { id: 'controladoria', name: 'Controladoria', prefix: '6', questions: controllingQuestions },
  { id: 'fiscal', name: 'Fiscal', prefix: '7', questions: taxQuestions },
  { id: 'contabil', name: 'Contábil', prefix: '8', questions: accountingQuestions },
  { id: 'capital-humano', name: 'Capital Humano', prefix: '9', questions: humanCapitalQuestions },
  { id: 'planejamento', name: 'Planejamento', prefix: '10', questions: planningQuestions },
];

export const questions = questionGroups.flatMap(g => g.questions);
