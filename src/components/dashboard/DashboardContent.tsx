
import { ChartBar } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import MonthlyChart from '@/components/MonthlyChart';
import CustomerRequests from '@/components/CustomerRequests';

const DashboardContent = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Dashboard</h1>
        <p className="text-dashboard-muted">Below is an example dashboard created using charts from this plugin</p>
      </header>

      <div className="flex flex-col gap-6">
        <MonthlyChart />
        <CustomerRequests />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Shop"
            value={68}
            color="#7EBF8E"
          />
          <MetricCard
            title="Mobile"
            value={52}
            color="#8989DE"
          />
          <MetricCard
            title="Other"
            value={85}
            color="#61AAF2"
          />
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
