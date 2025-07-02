
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'creator@icici.com': {
    id: '1',
    name: 'Alice Johnson',
    email: 'creator@icici.com',
    role: 'marketing-creator'
  },
  'reviewer@icici.com': {
    id: '2',
    name: 'Bob Smith',
    email: 'reviewer@icici.com',
    role: 'marketing-reviewer'
  },
  'compliance@icici.com': {
    id: '3',
    name: 'Carol Davis',
    email: 'compliance@icici.com',
    role: 'compliance-reviewer'
  },
  'admin@icici.com': {
    id: '4',
    name: 'David Wilson',
    email: 'admin@icici.com',
    role: 'admin'
  },
  'developer@icici.com': {
    id: '5',
    name: 'Emma Rodriguez',
    email: 'developer@icici.com',
    role: 'website-developer'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple authentication logic
    const user = mockUsers[email.toLowerCase()];
    if (user) {
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated, 
      switchRole 
    }}>
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
