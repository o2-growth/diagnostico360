import { ChartBar } from 'lucide-react';
import CustomerRequests from '@/components/CustomerRequests';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const DashboardContent = () => {
  const areasData = [
    {
      id: 'financeiro',
      name: 'Financeiro',
      data: [
        { month: 'Jan', value: 65 },
        { month: 'Fev', value: 70 },
        { month: 'Mar', value: 75 }
      ],
      color: '#7EBF8E'
    },
    {
      id: 'tecnologia',
      name: 'Tecnologia',
      data: [
        { month: 'Jan', value: 45 },
        { month: 'Fev', value: 50 },
        { month: 'Mar', value: 55 }
      ],
      color: '#8989DE'
    },
    {
      id: 'planejamento',
      name: 'Planejamento',
      data: [
        { month: 'Jan', value: 35 },
        { month: 'Fev', value: 40 },
        { month: 'Mar', value: 45 }
      ],
      color: '#61AAF2'
    },
    {
      id: 'contabil',
      name: 'Contábil',
      data: [
        { month: 'Jan', value: 55 },
        { month: 'Fev', value: 60 },
        { month: 'Mar', value: 65 }
      ],
      color: '#F97316'
    },
    {
      id: 'controladoria',
      name: 'Controladoria',
      data: [
        { month: 'Jan', value: 40 },
        { month: 'Fev', value: 45 },
        { month: 'Mar', value: 50 }
      ],
      color: '#9b87f5'
    },
    {
      id: 'fiscal',
      name: 'Fiscal',
      data: [
        { month: 'Jan', value: 60 },
        { month: 'Fev', value: 65 },
        { month: 'Mar', value: 70 }
      ],
      color: '#0EA5E9'
    },
    {
      id: 'comercial',
      name: 'Comercial',
      data: [
        { month: 'Jan', value: 70 },
        { month: 'Fev', value: 75 },
        { month: 'Mar', value: 80 }
      ],
      color: '#EC4899'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      data: [
        { month: 'Jan', value: 50 },
        { month: 'Fev', value: 55 },
        { month: 'Mar', value: 60 }
      ],
      color: '#F59E0B'
    },
    {
      id: 'societario',
      name: 'Societário',
      data: [
        { month: 'Jan', value: 45 },
        { month: 'Fev', value: 50 },
        { month: 'Mar', value: 55 }
      ],
      color: '#10B981'
    },
    {
      id: 'capital-humano',
      name: 'Capital Humano',
      data: [
        { month: 'Jan', value: 55 },
        { month: 'Fev', value: 60 },
        { month: 'Mar', value: 65 }
      ],
      color: '#6366F1'
    }
  ];

  const AreaChart = ({ data, color, title }: { data: any[], color: string, title: string }) => (
    <div className="dashboard-card h-[250px]">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month"
            stroke="#828179"
            fontSize={12}
          />
          <YAxis
            stroke="#828179"
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1A1A19',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#C4C3BB' }}
          />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Resultado</h1>
        <p className="text-dashboard-muted">Below is an example dashboard created using charts from this plugin</p>
      </header>

      <div className="flex flex-col gap-6">
        <CustomerRequests />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areasData.map((area) => (
            <AreaChart
              key={area.id}
              data={area.data}
              color={area.color}
              title={area.name}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
