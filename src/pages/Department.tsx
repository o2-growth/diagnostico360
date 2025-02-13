
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DepartmentEvolution from '@/components/department/DepartmentEvolution';
import DepartmentDiagnostic from '@/components/department/DepartmentDiagnostic';
import { getDepartmentInfo, getDepartmentEvolutionData } from '@/utils/departmentData';

const Department = () => {
  const { id } = useParams();
  const [showChart, setShowChart] = useState(true);
  const [activeTab, setActiveTab] = useState('areas');

  const departmentInfo = getDepartmentInfo(id);
  const evolutionData = getDepartmentEvolutionData(id);

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={setActiveTab} />
      <div className="pl-64">
        <div className="p-8">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {departmentInfo.icon}
              <h1 className="text-3xl font-medium">{departmentInfo.name}</h1>
            </div>
            <p className="text-dashboard-muted">{departmentInfo.description}</p>
          </header>

          <div className="space-y-6">
            <DepartmentEvolution
              departmentName={departmentInfo.name}
              evolutionData={evolutionData}
              showChart={showChart}
              onToggleChart={() => setShowChart(!showChart)}
            />

            <DepartmentDiagnostic questions={departmentInfo.questions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
