
import { Question } from '@/types/department';

interface DepartmentQuestionsProps {
  questions: Question[];
}

const DepartmentQuestions = ({ questions }: DepartmentQuestionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium mb-6">Lista de Verificação</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dashboard-card-hover border-b border-dashboard-border">
              <th className="py-3 px-4 text-left font-medium">Item</th>
              <th className="py-3 px-4 text-left font-medium">Perguntas</th>
              <th className="py-3 px-4 text-left font-medium">É aplicável nessa unidade? SIM/NÃO</th>
              <th className="py-3 px-4 text-left font-medium">Forma de Aplicação</th>
              <th className="py-3 px-4 text-left font-medium">Evidências</th>
              <th className="py-3 px-4 text-left font-medium">Existe evidência? S/N</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((item) => (
              <tr key={item.item} className="border-b border-dashboard-border">
                <td className="py-4 px-4">{item.item}</td>
                <td className="py-4 px-4 max-w-md">
                  <div className="font-medium">{item.title}</div>
                  {item.question && <div className="text-dashboard-muted mt-1">{item.question}</div>}
                </td>
                <td className="py-4 px-4">{item.applicable}</td>
                <td className="py-4 px-4">
                  <ul className="list-disc pl-4">
                    {item.application.map((app, index) => (
                      <li key={index}>{app}</li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-4">{item.evidence}</td>
                <td className="py-4 px-4">{item.hasEvidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentQuestions;
