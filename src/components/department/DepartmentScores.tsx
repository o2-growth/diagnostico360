
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Question } from '@/types/department';

interface DepartmentScoresProps {
  questions: Question[];
}

const DepartmentScores = ({ questions }: DepartmentScoresProps) => {
  const data = questions.map(question => ({
    name: question.title,
    score: Number(question.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE" ? 100 : 
           question.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)" ? 70 : 0),
    remaining: Number(question.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE" ? 0 : 
               question.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)" ? 30 : 100)
  }));

  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Scores por Item</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, bottom: 5, left: 180 }}
          barSize={30}
          stackOffset="expand"
        >
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tick={{ fill: '#828179' }}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            width={160}
            tick={{ fill: '#828179', fontSize: 13 }}
            interval={0}
          />
          <Bar 
            dataKey="score" 
            fill="#1F3B28"
            stackId="stack"
          />
          <Bar 
            dataKey="remaining" 
            fill="#7EBF8E" 
            stackId="stack"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentScores;
