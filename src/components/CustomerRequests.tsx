
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/components/theme/theme-provider';
import { calculateScores } from '@/utils/scoreCalculator';

const AREA_CONFIG: Record<string, string> = {
  'financeiro': 'Financeiro',
  'tecnologia': 'Tecnologia',
  'planejamento': 'Planejamento',
  'contabil': 'Contábil',
  'controladoria': 'Controladoria',
  'fiscal': 'Fiscal',
  'comercial': 'Comercial',
  'marketing': 'Marketing',
  'societario': 'Societário',
  'capital-humano': 'Capital Humano',
};

const CustomerRequests = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { departmentScores } = calculateScores();

  const data = Object.entries(AREA_CONFIG).map(([id, name]) => ({
    subject: name,
    value: departmentScores[id] ?? 0,
    target: 100,
  }));

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

export default CustomerRequests;
