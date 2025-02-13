
import MonthlyChart from '@/components/MonthlyChart';

const EvolutionContent = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Evolução</h1>
        <p className="text-dashboard-muted">Acompanhe a evolução do nível de excelência ao longo do tempo</p>
      </header>

      <div className="flex flex-col gap-6">
        <MonthlyChart />
      </div>
    </>
  );
};

export default EvolutionContent;

