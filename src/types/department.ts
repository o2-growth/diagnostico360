
export interface Employee {
  name: string;
  role: string;
  salary: number;
  benefits: number;
}

export interface Tool {
  name: string;
  plan: string;
  responsible: string;
  purpose: string;
  monthlyCost: number;
  annualCost: number;
}

export interface DepartmentData {
  title: string;
  name: string;
  color: string;
  description: string;
  image: string;
  leader: string;
  employees: number;
  team: Employee[];
  tools: Tool[];
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
