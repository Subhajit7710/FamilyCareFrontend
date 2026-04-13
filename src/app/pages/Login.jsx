import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { HeartPulse } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Branding */}
          <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
              <span className="font-semibold text-xl">FamilyCare</span>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Keep loved ones <span className="text-teal-600">healthy</span>
              <br />
              <span className="text-teal-600">together</span>
            </h1>

            <p className="text-gray-600 mb-8">
              Coordinate medication schedules, track health, and stay connected with your family's care — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
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
                className="w-full h-auto max-w-sm mx-auto text-teal-600 opacity-90 my-10"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Right side - Forms */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                  className={`pb-3 px-1 font-medium transition-colors relative ${
                    activeTab === 'signin'
                      ? 'text-teal-600'
                      : 'text-gray-500 hover:text-gray-700'
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
                      : 'text-gray-500 hover:text-gray-700'
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Sign In Form */}
              {activeTab === 'signin' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Welcome back</h2>
                  <p className="text-gray-600 mb-6">Sign in to manage your family's health</p>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="text-gray-600 mb-6">Join FamilyCare and keep loved ones healthy</p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
