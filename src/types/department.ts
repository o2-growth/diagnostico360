
export interface DepartmentData {
  title: string;
  name: string;
  color: string;
  description: string;
}

export type EvaluationStatus =
  | "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)"
  | "NÃO EXISTE"
  | "EXISTE E FUNCIONA PERFEITAMENTE";

export interface Question {
  item: string;
  title: string;
  question: string;
  applicable: string;
  application: string[];
  evidence: string;
  hasEvidence: string;
  evaluation?: EvaluationStatus;
  score?: number;
  maxScore?: number;
}
