
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

export const questions = [
  ...marketingQuestions,
  ...financialQuestions,
  ...technologyQuestions,
  ...planningQuestions,
  ...accountingQuestions,
  ...controllingQuestions,
  ...taxQuestions,
  ...commercialQuestions,
  ...corporateQuestions,
  ...humanCapitalQuestions
];
