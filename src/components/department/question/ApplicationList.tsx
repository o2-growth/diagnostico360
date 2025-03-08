
interface ApplicationListProps {
  applications: string[];
}

const ApplicationList = ({ applications }: ApplicationListProps) => {
  if (applications.length === 0) return null;
  
  return (
    <div>
      <div className="text-sm font-medium text-dashboard-muted mb-1">
        Forma de Aplicação
      </div>
      <ul className="list-disc pl-4 text-sm">
        {applications.map((app, index) => (
          <li key={index}>{app}</li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationList;
