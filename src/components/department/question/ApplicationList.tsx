
interface ApplicationListProps {
  applications: string[];
}

const ApplicationList = ({ applications }: ApplicationListProps) => {
  if (!applications || applications.length === 0) return null;
  
  return (
    <div className="mb-4">
      <div className="text-sm font-medium text-dashboard-muted mb-2">
        Forma de Aplicação
      </div>
      <ul className="space-y-2">
        {applications.map((app, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-1 h-2 w-2 rounded-full bg-dashboard-accent3 flex-shrink-0"></div>
            <span className="text-sm">{app}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationList;
