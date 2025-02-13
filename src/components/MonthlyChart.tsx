
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { period: 'Jan/23', value: 75 },
  { period: 'Fev/23', value: 78 },
  { period: 'Mar/23', value: 76 },
  { period: 'Abr/23', value: 80 },
  { period: 'Mai/23', value: 82 },
  { period: 'Jun/23', value: 85 },
  { period: 'Jul/23', value: 83 },
  { period: 'Ago/23', value: 87 },
  { period: 'Set/23', value: 85 },
  { period: 'Out/23', value: 88 },
  { period: 'Nov/23', value: 90 },
  { period: 'Dez/23', value: 92 },
  { period: 'Jan/24', value: 91 },
  { period: 'Fev/24', value: 93 },
  { period: 'Mar/24', value: 95 },
  { period: 'Abr/24', value: 94 },
  { period: 'Mai/24', value: 96 },
  { period: 'Jun/24', value: 98 },
  { period: 'Jul/24', value: 97 },
  { period: 'Ago/24', value: 99 },
  { period: 'Set/24', value: 98 },
  { period: 'Out/24', value: 97 },
  { period: 'Nov/24', value: 99 },
  { period: 'Dez/24', value: 100 },
];

const MonthlyChart = () => {
  return (
    <div className="dashboard-card">
      <h2 className="text-xl font-medium mb-6">Resultado</h2>
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
            <Line
              type="monotone"
              dataKey="value"
              stroke="#7EBF8E"
              strokeWidth={2}
              dot={{ fill: '#7EBF8E' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;
