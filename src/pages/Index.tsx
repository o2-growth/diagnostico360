
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DepartmentsList from '@/components/departments/DepartmentsList';
import SettingsContent from '@/components/settings/SettingsContent';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleDepartmentClick = (deptId: string) => {
    navigate(`/department/${deptId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'departments':
        return <DepartmentsList onDepartmentClick={handleDepartmentClick} />;
      case 'settings':
        return <SettingsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={setActiveTab} />
      <div className="pl-64">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
