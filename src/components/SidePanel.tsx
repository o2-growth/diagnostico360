
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Building2, TrendingUp, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomerRequests from '@/components/CustomerRequests';

interface SidePanelProps {
  onTabChange: (value: string) => void;
}

const SidePanel = ({ onTabChange }: SidePanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleTabChange = (value: string) => {
    onTabChange(value);
    
    switch (value) {
      case 'dashboard':
        navigate('/', { state: { activeTab: 'dashboard' } });
        break;
      case 'evolution':
        navigate('/', { state: { activeTab: 'evolution' } });
        break;
      case 'areas':
        navigate('/', { state: { activeTab: 'areas' } });
        break;
      case 'settings':
        navigate('/', { state: { activeTab: 'settings' } });
        break;
    }
  };

  const getCurrentTab = () => {
    if (location.pathname === '/') {
      return location.state?.activeTab || 'dashboard';
    }
    if (location.pathname.includes('/department/')) {
      return 'areas';
    }
    return 'dashboard';
  };

  return (
    <div className={`glass-card h-screen sticky top-0 transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-16'
    }`}>
      <div className={`relative p-6 ${!isExpanded && 'px-3'}`}>
        {isExpanded && <h2 className="text-xl font-medium mb-6">Navegação</h2>}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        
        <Tabs 
          defaultValue={getCurrentTab()}
          value={getCurrentTab()}
          orientation="vertical" 
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex flex-col h-auto bg-transparent text-white">
            <TabsTrigger 
              value="dashboard" 
              className={`w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white ${
                !isExpanded && 'px-2 justify-center'
              }`}
              title={!isExpanded ? "Resultado" : undefined}
            >
              <LayoutDashboard className="w-4 h-4" />
              {isExpanded && "Resultado"}
            </TabsTrigger>
            <TabsTrigger 
              value="evolution" 
              className={`w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white ${
                !isExpanded && 'px-2 justify-center'
              }`}
              title={!isExpanded ? "Evolução" : undefined}
            >
              <TrendingUp className="w-4 h-4" />
              {isExpanded && "Evolução"}
            </TabsTrigger>
            <TabsTrigger 
              value="areas" 
              className={`w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white ${
                !isExpanded && 'px-2 justify-center'
              }`}
              title={!isExpanded ? "Áreas" : undefined}
            >
              <Building2 className="w-4 h-4" />
              {isExpanded && "Áreas"}
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className={`w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white ${
                !isExpanded && 'px-2 justify-center'
              }`}
              title={!isExpanded ? "Configurações" : undefined}
            >
              <Settings className="w-4 h-4" />
              {isExpanded && "Configurações"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {getCurrentTab() === 'dashboard' && isExpanded && (
        <div className="mt-6 px-6">
          <CustomerRequests />
        </div>
      )}
    </div>
  );
};

export default SidePanel;
