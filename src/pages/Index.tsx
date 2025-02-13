
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DepartmentsList from '@/components/departments/DepartmentsList';
import EvolutionContent from '@/components/evolution/EvolutionContent';
import SettingsContent from '@/components/settings/SettingsContent';

const Index = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.activeTab || 'dashboard';
  });
  const navigate = useNavigate();

  const handleDepartmentClick = (deptId: string) => {
    navigate(`/department/${deptId}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'evolution':
        return <EvolutionContent />;
      case 'areas':
        return <DepartmentsList onDepartmentClick={handleDepartmentClick} />;
      case 'settings':
        return <SettingsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <SidePanel onTabChange={handleTabChange} />
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
