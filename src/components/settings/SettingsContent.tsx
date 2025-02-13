
import { Bell, Globe } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const SettingsContent = () => {
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
};

export default SettingsContent;
