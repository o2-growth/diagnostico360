
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Plano de Contas', value: 100, target: 100 },
  { subject: 'Contas a Pagar', value: 100, target: 100 },
  { subject: 'Contas a Receber', value: 100, target: 100 },
  { subject: 'Conciliação Bancária', value: 100, target: 100 },
  { subject: 'Fluxo de Caixa', value: 100, target: 100 },
  { subject: 'Crédito e Cobrança', value: 100, target: 100 },
  { subject: 'Rentabilidade e Análise de Custo', value: 100, target: 100 },
  { subject: 'Controle Orçamentário e Previsão Financeira', value: 100, target: 100 },
  { subject: 'Relatórios', value: 100, target: 100 }
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
