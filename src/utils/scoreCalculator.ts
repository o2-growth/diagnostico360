import { questionGroups } from '@/data/questions';

const ANSWERS_STORAGE_KEY = 'departmentAnswers';

export interface DepartmentScores {
  [departmentId: string]: number;
}

export function calculateScores(): { departmentScores: DepartmentScores; overallScore: number } {
  try {
    const stored = localStorage.getItem(ANSWERS_STORAGE_KEY);
    if (!stored) return { departmentScores: {}, overallScore: 0 };
    const answers = JSON.parse(stored);

    const departmentScores: DepartmentScores = {};
    let totalScore = 0;
    let deptCount = 0;

    for (const group of questionGroups) {
      const questions = group.questions;
      if (questions.length === 0) continue;

      let score = 0;
      for (const q of questions) {
        const answer = answers[q.item];
        if (!answer) continue;
        const evaluation = answer.evaluation;
        if (evaluation === 'EXISTE E FUNCIONA PERFEITAMENTE') {
          score += 100;
        } else if (evaluation === 'EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)') {
          score += 50;
        }
        // NÃO EXISTE = 0
      }

      const deptScore = Math.round(score / questions.length);
      departmentScores[group.id] = deptScore;
      totalScore += deptScore;
      deptCount++;
    }

    const overallScore = deptCount > 0 ? Math.round(totalScore / deptCount) : 0;
    return { departmentScores, overallScore };
  } catch {
    return { departmentScores: {}, overallScore: 0 };
  }
}
