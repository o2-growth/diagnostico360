
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Question } from '@/types/department';

interface DepartmentScoresProps {
  questions: Question[];
}

const DepartmentScores = ({ questions }: DepartmentScoresProps) => {
  const data = questions.map(question => ({
    name: question.title,
    score: Number(question.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE" ? 100 : 
           question.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)" ? 70 : 0)
  }));

  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Scores por Item</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, bottom: 20, left: 200 }}
        >
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={180}
            tick={{ 
              fill: '#828179', 
              fontSize: 12,
              width: 170,
              wordWrap: 'break-word'
            }}
            interval={0}
          />
          <Bar 
            dataKey="score" 
            fill="#61AAF2" 
            background={{ fill: 'rgba(255,255,255,0.1)' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentScores;
