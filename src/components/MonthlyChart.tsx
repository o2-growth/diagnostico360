
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { period: '2024/T1', value: 35 },
  { period: '2024/T2', value: 43 },
  { period: '2024/T3', value: 44 },
  { period: '2024/T4', value: 47 },
];

const MonthlyChart = () => {
  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Nível de Excelência</h2>
      <div className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="period" 
              stroke="#828179"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              stroke="#828179"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              fontSize={12}
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

export default MonthlyChart;
