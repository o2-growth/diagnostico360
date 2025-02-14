
import { fiscalQuestions } from './fiscalQuestions';
import { contabilQuestions } from './contabilQuestions';
import { capitalHumanoQuestions } from './capitalHumanoQuestions';
import type { Question } from '@/types/department';

const getQuestionsByDepartment = (department: string): Question[] => {
  switch (department) {
    case 'fiscal':
      return fiscalQuestions;
    case 'contabil':
      return contabilQuestions;
    case 'capital-humano':
      return capitalHumanoQuestions;
    default:
      return [];
  }
};

export { getQuestionsByDepartment };
