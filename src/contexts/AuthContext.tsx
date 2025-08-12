import React, { createContext, useContext, useEffect, useState } from 'react';

interface LocalUser { id: string; anonymous?: boolean; email?: string; }

interface AuthContextType { user: LocalUser | null; loading: boolean; signInAnonymously: () => Promise<void>; signOut: () => Promise<void>; }

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, signInAnonymously: async () => {}, signOut: async () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // In-memory only; no persistence
  setLoading(false);
  }, []);

  const signInAnonymously = async () => {
    const newUser: LocalUser = { id: Math.random().toString(36).slice(2), anonymous: true };
    setUser(newUser);
  };

  const signOut = async () => { setUser(null); };

  return (
  <AuthContext.Provider value={{ user, loading, signInAnonymously, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
