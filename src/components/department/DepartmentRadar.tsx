
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Question } from '@/types/department';
import { useTheme } from '@/components/theme/theme-provider';

interface DepartmentRadarProps {
  questions: Question[];
}

const DepartmentRadar = ({ questions }: DepartmentRadarProps) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const data = questions.map(question => {
    let value = 0;
    if (question.evaluation === "EXISTE E FUNCIONA PERFEITAMENTE") {
      value = 10;
    } else if (question.evaluation === "EXISTE DE FORMA PADRONIZADA (MAS PODE SER MELHORADO)") {
      value = 5;
    }
    return {
      subject: question.title,
      value,
      target: 10
    };
  });

  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Resultado</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke={isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)"} />
          <PolarAngleAxis
            dataKey="subject"
            stroke={isLight ? "#333333" : "#828179"}
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
