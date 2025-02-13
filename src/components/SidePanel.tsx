
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Building2, TrendingUp, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidePanelProps {
  onTabChange: (value: string) => void;
}

const SidePanel = ({ onTabChange }: SidePanelProps) => {
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
    <>
      <div 
        className={`h-screen fixed left-0 top-0 glass-card border-r border-white/10 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-medium mb-6">Navegação</h2>
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
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                Resultado
              </TabsTrigger>
              <TabsTrigger 
                value="evolution" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <TrendingUp className="w-4 h-4" />
                Evolução
              </TabsTrigger>
              <TabsTrigger 
                value="areas" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Building2 className="w-4 h-4" />
                Áreas
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="w-full justify-start gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-0 top-4 z-50 mr-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeftOpen className="h-4 w-4" />
        )}
      </Button>
    </>
  );
};

export default SidePanel;
