
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Financeiro', value: 65, target: 100 },
  { subject: 'Tecnologia', value: 45, target: 100 },
  { subject: 'Planejamento', value: 35, target: 100 },
  { subject: 'Contábil', value: 55, target: 100 },
  { subject: 'Controladoria', value: 40, target: 100 },
  { subject: 'Fiscal', value: 60, target: 100 },
  { subject: 'Comercial', value: 70, target: 100 },
  { subject: 'Marketing', value: 50, target: 100 },
  { subject: 'Societário', value: 45, target: 100 },
  { subject: 'Capital Humano', value: 55, target: 100 }
];

const CustomerRequests = () => {
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

export default CustomerRequests;
