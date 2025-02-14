
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface DepartmentEvolutionProps {
  data: Array<{ period: string; value: number }>;
}

const DepartmentEvolution = ({ data }: DepartmentEvolutionProps) => {
  return (
    <div className="dashboard-card">
      <h2 className="text-xl font-medium mb-6">Evolução da área</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="period"
              stroke="#828179"
              fontSize={12}
              tickMargin={10}
              interval={2}
            />
            <YAxis 
              stroke="#828179"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A19',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#C4C3BB' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8989DE"
              strokeWidth={2}
              dot={{ fill: '#8989DE' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentEvolution;
