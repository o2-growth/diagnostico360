
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Building2, TrendingUp, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidePanelProps {
  onTabChange: (value: string) => void;
  onMenuToggle: (isOpen: boolean) => void;
}

const SidePanel = ({ onTabChange, onMenuToggle }: SidePanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

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

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onMenuToggle(newState);
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
    <div 
      className={`h-screen fixed left-0 top-0 glass-card border-r border-white/10 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <Button
          variant="ghost"
          size="icon"
          className="mb-4 self-end"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>

        <Tabs 
          defaultValue={getCurrentTab()}
          value={getCurrentTab()}
          orientation="vertical" 
          className="w-full flex flex-col h-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="flex flex-col h-auto bg-transparent text-white">
            <TabsTrigger 
              value="dashboard" 
              className={`w-full justify-${isOpen ? 'start' : 'center'} gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {isOpen && "Resultado"}
            </TabsTrigger>
            <TabsTrigger 
              value="evolution" 
              className={`w-full justify-${isOpen ? 'start' : 'center'} gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3`}
            >
              <TrendingUp className="w-5 h-5 shrink-0" />
              {isOpen && "Evolução"}
            </TabsTrigger>
            <TabsTrigger 
              value="areas" 
              className={`w-full justify-${isOpen ? 'start' : 'center'} gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3`}
            >
              <Building2 className="w-5 h-5 shrink-0" />
              {isOpen && "Áreas"}
            </TabsTrigger>
          </TabsList>
          <div className="flex-1" />
          <TabsList className="flex flex-col h-auto bg-transparent text-white mt-auto">
            <TabsTrigger 
              value="settings" 
              className={`w-full justify-${isOpen ? 'start' : 'center'} gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {isOpen && "Configurações"}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default SidePanel;
