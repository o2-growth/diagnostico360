
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Question } from '@/types/department';

interface DepartmentRadarProps {
  questions: Question[];
}

const DepartmentRadar = ({ questions }: DepartmentRadarProps) => {
  const data = questions.map(question => ({
    subject: question.title,
    value: 0, // Valor inicial, deve ser atualizado conforme a avaliação
    target: 10 // Default maxScore is 10 if not specified
  }));

  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Resultado</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            stroke="#828179" 
            tickLine={false}
            fontSize={12}
          />
          <Radar
            name="Atual"
            dataKey="value"
            stroke="#61AAF2"
            fill="#61AAF2"
            fillOpacity={0.3}
          />
          <Radar
            name="Meta"
            dataKey="target"
            stroke="#7EBF8E"
            fill="#7EBF8E"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentRadar;
