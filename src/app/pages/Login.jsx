import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { HeartPulse } from 'lucide-react';

// Shared input style: readable in both light and dark mode
const inputClass =
  'w-full px-4 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';

export default function Login() {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(email, password, name || email.split('@')[0]);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Branding */}
          <div className="md:w-1/2 p-6 md:p-10 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <span className="font-semibold text-xl">FamilyCare</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Keep loved ones <span className="text-teal-600">healthy</span>
              <br />
              <span className="text-teal-600">together</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Coordinate medication schedules, track health, and stay connected with your family's care — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-teal-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>HIPAA aware design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-teal-600 rounded flex items-center justify-center">
                  <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Real-time family sync</span>
              </div>
            </div>

            <div className="hidden md:block">
              <HeartPulse 
                className="w-32 h-32 lg:w-40 lg:h-40 mx-auto text-teal-600 opacity-90 mt-8"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Right side - Forms */}
          <div className="md:w-1/2 p-6 md:p-10 flex items-center">
            <div className="w-full max-w-sm mx-auto">
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === 'signin'
                      ? 'text-teal-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('signin')}
                >
                  Sign In
                  {activeTab === 'signin' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
                <button
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === 'register'
                      ? 'text-teal-600'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('register')}
                >
                  Register
                  {activeTab === 'register' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* Sign In Form */}
              {activeTab === 'signin' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Sign in to manage your family's health</p>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Signing in...' : 'Sign In →'}
                    </button>
                  </form>
                </div>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Join FamilyCare and keep loved ones healthy</p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputClass}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Registering...' : 'Create Account →'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
