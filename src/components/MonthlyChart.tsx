
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '@/components/theme/theme-provider';

interface ChartDataPoint {
  period: string;
  value: number;
}

interface MonthlyChartProps {
  data?: ChartDataPoint[];
}

const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (!data || data.length === 0) {
    return (
      <div className="dashboard-card h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          Nenhum diagnóstico concluído ainda.<br />
          Complete um diagnóstico para ver sua evolução.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-card h-[400px]">
      <h2 className="text-xl font-medium mb-6">Nível de Excelência</h2>
      <div className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)"} />
            <XAxis 
              dataKey="period" 
              stroke={isLight ? "#333333" : "#828179"}
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              stroke={isLight ? "#333333" : "#828179"}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isLight ? '#fff' : '#1A1A19',
                border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
              }}
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
