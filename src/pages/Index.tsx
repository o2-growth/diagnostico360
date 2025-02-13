
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DepartmentsList from '@/components/departments/DepartmentsList';
import SettingsContent from '@/components/settings/SettingsContent';

const Index = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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
