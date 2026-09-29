import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">+</span>
            </div>
            <span className="font-semibold text-xl dark:text-white">FamilyCare</span>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 dark:text-gray-200" />
            ) : (
              <Menu className="w-6 h-6 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="bg-white dark:bg-gray-900 w-64 h-full p-4 transition-colors" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
                <span className="font-semibold text-xl dark:text-white">FamilyCare</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 dark:text-gray-200" />
              </button>
            </div>

            <nav className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/medications"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Medications
              </Link>
              <Link
                to="/calendar"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Calendar
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Settings
              </Link>
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
