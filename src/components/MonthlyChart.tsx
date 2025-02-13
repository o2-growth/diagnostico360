
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { period: 'Jan/23', value: 30 },
  { period: 'Fev/23', value: 32 },
  { period: 'Mar/23', value: 35 },
  { period: 'Abr/23', value: 38 },
  { period: 'Mai/23', value: 40 },
  { period: 'Jun/23', value: 42 },
  { period: 'Jul/23', value: 45 },
  { period: 'Ago/23', value: 47 },
  { period: 'Set/23', value: 48 },
  { period: 'Out/23', value: 50 },
  { period: 'Nov/23', value: 52 },
  { period: 'Dez/23', value: 55 },
  { period: 'Jan/24', value: 57 },
  { period: 'Fev/24', value: 58 },
  { period: 'Mar/24', value: 60 },
  { period: 'Abr/24', value: 62 },
  { period: 'Mai/24', value: 65 },
  { period: 'Jun/24', value: 67 },
  { period: 'Jul/24', value: 70 },
  { period: 'Ago/24', value: 72 },
  { period: 'Set/24', value: 75 },
  { period: 'Out/24', value: 77 },
  { period: 'Nov/24', value: 80 },
  { period: 'Dez/24', value: 82 },
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
