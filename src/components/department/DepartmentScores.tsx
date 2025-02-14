
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

  // Custom tick component to handle text wrapping
  const CustomTick = (props: any) => {
    const { x, y, payload } = props;
    
    // Split text into multiple lines if longer than 25 characters
    const words = payload.value.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach((word: string) => {
      if (currentLine.length + word.length < 25) {
        currentLine += (currentLine.length === 0 ? '' : ' ') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, i) => (
          <text
            key={i}
            x={-6}
            y={i * 12}
            dy={4}
            textAnchor="end"
            fill="#828179"
            fontSize={12}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

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
            tick={<CustomTick />}
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

