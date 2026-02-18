import { DepartmentData, Question } from "@/types/department";
import DepartmentRadar from './DepartmentRadar';
import DepartmentScores from './DepartmentScores';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface DepartmentOverviewProps {
  departmentInfo: DepartmentData;
  questions: Question[];
}

const DepartmentOverview = ({
  departmentInfo,
  questions
}: DepartmentOverviewProps) => {
  const calculateScore = () => {
    if (!questions || questions.length === 0) return 0;

    let totalScore = 0;
    for (const q of questions) {
      if (q.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE") {
        totalScore += 100;
      } else if (q.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)") {
        totalScore += 50;
      }
    }

    return Math.round(totalScore / questions.length);
  };

  const score = calculateScore();

  const perfect = questions.filter(q => q.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE");
  const needsImprovement = questions.filter(q => q.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)");
  const doesNotExist = questions.filter(q => q.evaluation === "NÃO EXISTE");
  const unanswered = questions.filter(q => !q.evaluation);

  return (
    <div className="flex flex-col gap-6" data-department={departmentInfo.name}>
      <div className="dashboard-card flex items-center justify-between">
        <div>
          <p className="text-sm text-dashboard-muted mb-1">Score Geral do Departamento</p>
          <span className="text-4xl font-bold" style={{ color: score <= 25 ? '#EF4444' : score <= 50 ? '#F97316' : score <= 75 ? '#EAB308' : '#7EBF8E' }}>{score}%</span>
        </div>
        <div className="w-32 h-2 rounded-full overflow-hidden bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: score <= 25 ? '#EF4444' : score <= 50 ? '#F97316' : score <= 75 ? '#EAB308' : '#7EBF8E' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div data-chart="Radar">
          <DepartmentRadar questions={questions} />
        </div>
        <div data-chart="Scores">
          <DepartmentScores questions={questions} />
        </div>
      </div>

      {/* Question Status Breakdown */}
      <div className="dashboard-card">
        <h2 className="text-xl font-medium mb-6">Status das Questões</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-green-500">{perfect.length}</p>
              <p className="text-sm text-dashboard-muted">Funciona perfeitamente</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-yellow-500">{needsImprovement.length}</p>
              <p className="text-sm text-dashboard-muted">Pode ser melhorado</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <p className="text-2xl font-bold text-red-500">{doesNotExist.length}</p>
              <p className="text-sm text-dashboard-muted">Não existe</p>
            </div>
          </div>
          {unanswered.length > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="h-5 w-5 rounded-full border-2 border-dashboard-muted shrink-0" />
              <div>
                <p className="text-2xl font-bold text-dashboard-muted">{unanswered.length}</p>
                <p className="text-sm text-dashboard-muted">Não respondida</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Findings - Critical items that need attention */}
      {doesNotExist.length > 0 && (
        <div className="dashboard-card">
          <h2 className="text-xl font-medium mb-4">Pontos Críticos</h2>
          <p className="text-sm text-dashboard-muted mb-4">
            Itens que não existem na sua empresa e precisam de atenção imediata:
          </p>
          <div className="space-y-2">
            {doesNotExist.map((q) => (
              <div key={q.item} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">{q.title}</p>
                  <p className="text-xs text-dashboard-muted mt-0.5">{q.question}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {needsImprovement.length > 0 && (
        <div className="dashboard-card">
          <h2 className="text-xl font-medium mb-4">Oportunidades de Melhoria</h2>
          <p className="text-sm text-dashboard-muted mb-4">
            Itens que existem mas podem ser aprimorados:
          </p>
          <div className="space-y-2">
            {needsImprovement.map((q) => (
              <div key={q.item} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">{q.title}</p>
                  <p className="text-xs text-dashboard-muted mt-0.5">{q.question}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentOverview;
