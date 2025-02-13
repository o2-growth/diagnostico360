
import CustomerRequests from '@/components/CustomerRequests';

const DashboardContent = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Resultado</h1>
        <p className="text-dashboard-muted">Below is an example dashboard created using charts from this plugin</p>
      </header>

      <div className="flex flex-col gap-6">
        <CustomerRequests />
      </div>
    </>
  );
};

export default DashboardContent;
