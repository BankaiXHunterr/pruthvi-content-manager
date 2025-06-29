
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LABELS } from '../types/auth';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please check your email and try again.');
    }
  };

  const demoUsers = [
    { email: 'sarah@company.com', role: 'marketing-creator' as const },
    { email: 'john@company.com', role: 'marketing-reviewer' as const },
    { email: 'lisa@company.com', role: 'compliance-reviewer' as const },
    { email: 'alex@company.com', role: 'developer' as const },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'marketing-creator':
        return 'bg-blue-100 text-blue-800';
      case 'marketing-reviewer':
        return 'bg-purple-100 text-purple-800';
      case 'compliance-reviewer':
        return 'bg-green-100 text-green-800';
      case 'developer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <img
            src="LOGO.png"
            alt="ICICI Prudential Mutual Fund"
            className="h-12 w-auto object-contain mx-auto"
          />
          <div>
            <CardTitle className="text-xl text-icici-darkGray">
              Marketing Content Management
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Sign in to access your dashboard
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full focus:ring-icici-orange focus:border-icici-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full focus:ring-icici-orange focus:border-icici-orange"
              />
            </div>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-icici-orange hover:bg-icici-red text-white font-semibold py-2.5 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <div key={user.email} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Password: any value works for demo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
