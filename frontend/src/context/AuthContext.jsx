import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCurrentUser } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('pawscare_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('pawscare_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('pawscare_token');
      if (savedToken) {
        try {
          const data = await fetchCurrentUser(savedToken);
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('pawscare_user', JSON.stringify(data.user));
          }
        } catch {
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('pawscare_token', authToken);
    localStorage.setItem('pawscare_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pawscare_token');
    localStorage.removeItem('pawscare_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
