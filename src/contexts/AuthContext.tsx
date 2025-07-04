import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - Updated to match LoginForm demo accounts
const mockUsers: Record<string, User> = {
  'sarah@company.com': {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'marketing-creator'
  },
  'john@company.com': {
    id: '2',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'marketing-reviewer'
  },
  'lisa@company.com': {
    id: '3',
    name: 'Lisa Davis',
    email: 'lisa@company.com',
    role: 'compliance-reviewer'
  },
  'alex@company.com': {
    id: '4',
    name: 'Alex Wilson',
    email: 'alex@company.com',
    role: 'admin'
  },
  'mike@company.com': {
    id: '5',
    name: 'Mike Rodriguez',
    email: 'mike@company.com',
    role: 'website-developer'
  },
  // Keep the old ICICI emails for backward compatibility
  'creator@icici.com': {
    id: '6',
    name: 'Alice Johnson',
    email: 'creator@icici.com',
    role: 'marketing-creator'
  },
  'reviewer@icici.com': {
    id: '7',
    name: 'Bob Smith',
    email: 'reviewer@icici.com',
    role: 'marketing-reviewer'
  },
  'compliance@icici.com': {
    id: '8',
    name: 'Carol Davis',
    email: 'compliance@icici.com',
    role: 'compliance-reviewer'
  },
  'admin@icici.com': {
    id: '9',
    name: 'David Wilson',
    email: 'admin@icici.com',
    role: 'admin'
  },
  'developer@icici.com': {
    id: '10',
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
    console.log('Login attempt for:', email);
    // Simple authentication logic - any password works for demo
    const user = mockUsers[email.toLowerCase()];
    console.log('Found user:', user);
    if (user) {
      setUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      console.log('Login successful for:', user.name, 'Role:', user.role);
      return true;
    }
    console.log('Login failed - user not found');
    return false;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    console.log('Registration attempt for:', email, 'with role:', role);
    
    // Check if user already exists
    const existingUser = mockUsers[email.toLowerCase()];
    if (existingUser) {
      console.log('Registration failed - user already exists');
      return false;
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      role
    };

    // Add to mock users (in real app, this would be saved to database)
    mockUsers[email.toLowerCase()] = newUser;
    
    // Log them in automatically
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    console.log('Registration successful for:', newUser.name, 'Role:', newUser.role);
    return true;
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
      register,
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
