
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

interface AreaEvolutionProps {
  areaName: string;
  evolutionData: Array<{ period: string; value: number }>;
  showChart: boolean;
  onToggleChart: () => void;
}

const AreaEvolution = ({ 
  areaName, 
  evolutionData, 
  showChart, 
  onToggleChart 
}: AreaEvolutionProps) => {
  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Evolução da {areaName}</h2>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-dashboard-muted hover:text-white"
          onClick={onToggleChart}
        >
          {showChart ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </Button>
      </div>
      
      {showChart && (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolutionData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
      )}
    </div>
  );
};

export default AreaEvolution;
