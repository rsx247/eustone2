"use client";

import React from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  toggleLogin: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const storedLoginState = localStorage.getItem('admin_logged_in');
    if (storedLoginState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleLogin = () => {
    setIsLoggedIn(prev => {
      const newState = !prev;
      localStorage.setItem('admin_logged_in', newState ? 'true' : 'false');
      return newState;
    });
  };

  const contextValue: AuthContextType = {
    isLoggedIn,
    toggleLogin
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
