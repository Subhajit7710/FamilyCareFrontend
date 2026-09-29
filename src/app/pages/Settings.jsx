import { ArrowLeft, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import Sidebar from '../components/Sidebar';
import MobileHeader from '../components/MobileHeader';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileHeader />

      <div className="flex-1 overflow-auto">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 md:p-6 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-semibold dark:text-white">Settings</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Manage your personalized experiences and application preferences.</p>
        </div>

        <div className="p-4 md:p-6 pb-24 md:pb-6">
          <div className="max-w-3xl space-y-6">
            
            {/* Appearance Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-lg font-semibold dark:text-white">Appearance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customize how FamilyCare looks on your device.</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium dark:text-white">Dark Mode</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Reduce eye strain by enabling the dark theme</p>
                  </div>
                  
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                      theme === 'dark' ? 'bg-teal-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        theme === 'dark' ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                    {theme === 'dark' ? (
                      <Moon className="absolute left-1.5 w-4 h-4 text-white" />
                    ) : (
                      <Sun className="absolute right-1.5 w-4 h-4 text-yellow-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Other Placeholder Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors opacity-75">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h2 className="text-lg font-semibold dark:text-white">Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control how you receive alerts.</p>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">Notification settings are managed per-patient right now. System-wide push notifications coming soon.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
