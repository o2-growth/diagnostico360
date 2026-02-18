
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DepartmentsList from '@/components/departments/DepartmentsList';
import EvolutionContent from '@/components/evolution/EvolutionContent';
import SettingsContent from '@/components/settings/SettingsContent';
import { useAssessmentDB } from '@/hooks/useAssessmentDB';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    return location.state?.activeTab || 'dashboard';
  });
  const navigate = useNavigate();
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const { loading: dbLoading } = useAssessmentDB();

  const handleDepartmentClick = (deptId: string) => {
    navigate(`/department/${deptId}`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
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
    <div className="min-h-screen">
      <SidePanel onTabChange={handleTabChange} onMenuToggle={handleMenuToggle} />
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8">
          {dbLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
                {Array(10).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
            </div>
          ) : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
