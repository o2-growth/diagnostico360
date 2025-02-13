
import { Question } from '@/utils/areaData';

interface AreaDiagnosticProps {
  questions: Question[];
}

const AreaDiagnostic = ({ questions }: AreaDiagnosticProps) => {
  return (
    <div className="dashboard-card">
      <h2 className="text-xl font-medium mb-4">Diagnóstico da Área</h2>
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="glass-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="col-span-1 lg:col-span-2">
                <p className="font-medium">
                  {question.number}. {question.text}
                </p>
              </div>
              <div>
                <label className="block text-sm text-dashboard-muted mb-1">
                  É aplicável nessa unidade?
                </label>
                <select className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2">
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-dashboard-muted mb-1">
                  Forma de Aplicação
                </label>
                <p className="text-sm">{question.applicationForm}</p>
              </div>
              <div>
                <label className="block text-sm text-dashboard-muted mb-1">
                  Evidências
                </label>
                <p className="text-sm">{question.evidence}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaDiagnostic;
