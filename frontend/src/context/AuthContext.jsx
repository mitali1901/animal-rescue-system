import React, { createContext, useContext } from 'react';

const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  isEmailVerified: true,
  loading: false
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={{ currentUser: null, userProfile: null, isEmailVerified: true, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
