
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Settings, Building2, History, PanelLeftClose, PanelLeftOpen, Download, Home, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportToPdf } from "@/utils/exportToPdf";
import { useAuth } from "@/hooks/useAuth";

interface SidePanelProps {
  onTabChange: (value: string) => void;
  onMenuToggle: (isOpen: boolean) => void;
}

const SidePanel = ({ onTabChange, onMenuToggle }: SidePanelProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const { signOut } = useAuth();

  const handleTabChange = (value: string) => {
    onTabChange(value);
    
    switch (value) {
      case 'home':
        navigate('/', { state: { activeTab: 'home' } });
        break;
      case 'dashboard':
        navigate('/dashboard', { state: { activeTab: 'dashboard' } });
        break;
      case 'evolution':
        navigate('/dashboard', { state: { activeTab: 'evolution' } });
        break;
      case 'areas':
        navigate('/dashboard', { state: { activeTab: 'areas' } });
        break;
      case 'settings':
        navigate('/dashboard', { state: { activeTab: 'settings' } });
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
      return 'home';
    }
    if (location.pathname === '/dashboard') {
      return location.state?.activeTab || 'dashboard';
    }
    if (location.pathname.includes('/department/')) {
      return 'areas';
    }
    return 'dashboard';
  };

  const handleExport = async () => {
    await exportToPdf();
  };

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-50 glass-card border-r border-white/10 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <Button
          variant="ghost"
          size="icon"
          className="mb-6 self-end hover:bg-white/10 transition-colors duration-200"
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
          <TabsList className="flex flex-col h-auto bg-transparent text-white gap-1">
            <TabsTrigger
              value="home"
              className={`w-full ${isOpen ? 'justify-start' : 'justify-center'} gap-3 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-200`}
            >
              <Home className="w-5 h-5 shrink-0" />
              {isOpen && "Início"}
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className={`w-full ${isOpen ? 'justify-start' : 'justify-center'} gap-3 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-200`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {isOpen && "Resultado"}
            </TabsTrigger>
            <TabsTrigger
              value="evolution"
              className={`w-full ${isOpen ? 'justify-start' : 'justify-center'} gap-3 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-200`}
            >
              <History className="w-5 h-5 shrink-0" />
              {isOpen && "Histórico"}
            </TabsTrigger>
            <TabsTrigger
              value="areas"
              className={`w-full ${isOpen ? 'justify-start' : 'justify-center'} gap-3 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-200`}
            >
              <Building2 className="w-5 h-5 shrink-0" />
              {isOpen && "Áreas"}
            </TabsTrigger>
          </TabsList>
          <div className="flex-1" />
          <TabsList className="flex flex-col h-auto bg-transparent text-white mt-auto gap-1">
            <Button
              variant="ghost"
              className={`w-full ${isOpen ? 'justify-start' : 'justify-center'} gap-3 text-dashboard-text hover:text-white hover:bg-white/5 p-3 rounded-lg transition-all duration-200`}
              onClick={handleExport}
            >
              <Download className="w-5 h-5 shrink-0" />
              {isOpen && "Exportar"}
            </Button>
            <TabsTrigger
              value="settings"
              className={`w-full ${isOpen ? 'justify-start' : 'justify-center'} gap-3 data-[state=active]:bg-white/10 data-[state=active]:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-200`}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {isOpen && "Configurações"}
            </TabsTrigger>
            <div className="border-t border-white/10 my-2" />
            <Button
              variant="ghost"
              className={`w-full ${isOpen ? 'justify-start' : 'justify-center'} gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 p-3 rounded-lg transition-all duration-200`}
              onClick={signOut}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isOpen && "Sair"}
            </Button>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default SidePanel;
