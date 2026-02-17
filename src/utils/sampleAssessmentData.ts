import { questionGroups } from '@/data/questions';
import type { EvaluationStatus } from '@/types/department';

const EVALUATIONS: { value: EvaluationStatus; weight: number }[] = [
  { value: "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)", weight: 40 },
  { value: "EXISTE E FUNCIONA PERFEITAMENTE", weight: 35 },
  { value: "NÃO EXISTE", weight: 25 },
];

function pickEvaluation(seed: number): EvaluationStatus {
  // Deterministic distribution based on seed
  const mod = seed % 100;
  if (mod < 35) return "EXISTE E FUNCIONA PERFEITAMENTE";
  if (mod < 75) return "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)";
  return "NÃO EXISTE";
}

export function generateSampleAnswers(): Record<string, Record<string, string>> {
  const answers: Record<string, Record<string, string>> = {};
  let seed = 7; // deterministic starting point

  for (const group of questionGroups) {
    for (const q of group.questions) {
      seed = (seed * 31 + 17) % 1000; // simple deterministic hash
      answers[q.item] = {
        evaluation: pickEvaluation(seed),
      };
    }
  }

  return answers;
}

export function generateSampleGates(): Record<string, string> {
  const gates: Record<string, string> = {};
  for (const group of questionGroups) {
    gates[group.id] = 'sim';
  }
  return gates;
}
