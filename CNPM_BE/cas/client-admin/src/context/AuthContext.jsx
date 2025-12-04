import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

/**
 * AuthContext provides global authentication state and actions
 * - user: current user object or null
 * - isLoading: true while checking session or validating
 * - login(userData): set user data after successful authentication
 * - logout(): destroy session and clear user
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check if there's an existing session (from cookie)
  // This enables SSO - if user logged in on another client, they're auto-logged here
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/check-session');
        if (response.data.loggedIn) {
          setUser(response.data.user);
          console.log('🎉 SSO Success! User already authenticated:', response.data.user.username);
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
