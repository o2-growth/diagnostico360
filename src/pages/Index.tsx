import { ChartBar, Server, Calendar, Calculator, DollarSign, Scale, ShoppingCart, Megaphone, Building2, User, Box, Bell, Globe, Shield, Moon } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import MonthlyChart from '@/components/MonthlyChart';
import CustomerRequests from '@/components/CustomerRequests';
import SidePanel from '@/components/SidePanel';
import { useState } from 'react';
import { Switch } from "@/components/ui/switch";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">Dashboard</h1>
              <p className="text-dashboard-muted">Below is an example dashboard created using charts from this plugin</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <MetricCard
                title="Shop"
                value={68}
                color="#7EBF8E"
              />
              <MetricCard
                title="Mobile"
                value={52}
                color="#8989DE"
              />
              <MetricCard
                title="Other"
                value={85}
                color="#61AAF2"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyChart />
              <CustomerRequests />
            </div>
          </>
        );
      case 'departments':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">Departamentos</h1>
              <p className="text-dashboard-muted">Gerencie os diferentes setores da empresa</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <ChartBar className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">Financeiro</p>
                        <p className="text-sm text-gray-400">Gestão financeira</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="font-medium">Tecnologia</p>
                        <p className="text-sm text-gray-400">Infraestrutura e sistemas</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium">Planejamento</p>
                        <p className="text-sm text-gray-400">Estratégia e projetos</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <Calculator className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="font-medium">Contábil</p>
                        <p className="text-sm text-gray-400">Contabilidade</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-medium">Controladoria</p>
                        <p className="text-sm text-gray-400">Controle e auditoria</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-indigo-400" />
                      <div>
                        <p className="font-medium">Fiscal</p>
                        <p className="text-sm text-gray-400">Gestão tributária</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="font-medium">Comercial</p>
                        <p className="text-sm text-gray-400">Vendas e negócios</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <Megaphone className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="font-medium">Marketing</p>
                        <p className="text-sm text-gray-400">Comunicação e marca</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-teal-400" />
                      <div>
                        <p className="font-medium">Societário</p>
                        <p className="text-sm text-gray-400">Gestão corporativa</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 glass-card">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="font-medium">Capital Humano</p>
                        <p className="text-sm text-gray-400">Recursos humanos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'settings':
        return (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-medium mb-2">Settings</h1>
              <p className="text-dashboard-muted">Configure your application settings</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-xl font-medium">Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-400">Receive email updates</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-400">Receive push notifications</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              <div className="dashboard-card">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-medium">Preferences</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-gray-400">Select your language</p>
                    </div>
                    <select className="bg-transparent border border-white/10 rounded-md px-2 py-1">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-gray-400">Toggle dark mode</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
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
