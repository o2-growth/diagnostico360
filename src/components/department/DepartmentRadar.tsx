
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Question } from '@/types/department';

interface DepartmentRadarProps {
  questions: Question[];
}

const DepartmentRadar = ({ questions }: DepartmentRadarProps) => {
  const data = questions.map(question => ({
    subject: question.title,
    value: 0,
    target: 10
  }));

  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Resultado</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="rgba(0,0,0,0.2)" />
          <PolarAngleAxis 
            dataKey="subject" 
            stroke="#403E43"
            tickLine={false}
            fontSize={12}
          />
          <Radar
            name="Atual"
            dataKey="value"
            stroke="#4A67E3"
            fill="#4A67E3"
            fillOpacity={0.3}
          />
          <Radar
            name="Meta"
            dataKey="target"
            stroke="#1F3B28"
            fill="#1F3B28"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentRadar;
