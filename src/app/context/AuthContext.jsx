import { createContext, useContext, useState, useEffect } from 'react';
import { authService, familyService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      
      if (token && userId) {
        try {
          // Fetch real user data using their token
          const userData = await authService.getProfile();
          setUser(userData.user || userData); // Handle different possible wrapper formats
        } catch (err) {
          console.error("Session invalid or expired", err);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (email, password, name) => {
    try {
      const response = await authService.register(email, password, name);
      
      // Assumes register logs the user in and returns token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      if (response.user && response.user.id) {
        localStorage.setItem('userId', response.user.id);
      }

      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Assumes response contains { token, user } structure
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      if (response.user && response.user.id) {
        localStorage.setItem('userId', response.user.id);
      }

      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const joinFamily = async (inviteCode) => {
    try {
      const response = await familyService.joinFamily(inviteCode);
      
      setUser(response.user || { ...user, familyId: response.family.id });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const createFamily = async (familyName) => {
    try {
      const response = await familyService.createFamily(familyName);
      setUser({ ...user, familyId: response.family.id });
      return { 
        familyId: response.family.id, 
        inviteCode: response.family.familyCode // from backend's 'familyCode'
      };
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    joinFamily,
    logout,
    createFamily,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
