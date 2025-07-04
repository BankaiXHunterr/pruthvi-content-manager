import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LABELS, UserRole } from '../types/auth';
import { ArrowLeft } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const roleParam = searchParams.get('role') as UserRole;
  
  useEffect(() => {
    if (!roleParam || !Object.keys(ROLE_LABELS).includes(roleParam)) {
      setError('Invalid or missing role in registration link.');
    }
  }, [roleParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!roleParam || !Object.keys(ROLE_LABELS).includes(roleParam)) {
      setError('Invalid role specified.');
      return;
    }

    const success = await register(name, email, password, roleParam);
    if (success) {
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setError('Registration failed. Email may already be in use.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'marketing-creator':
        return 'bg-blue-100 text-blue-800';
      case 'marketing-reviewer':
        return 'bg-purple-100 text-purple-800';
      case 'compliance-reviewer':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'website-developer':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
          <img
            src="LOGO.png"
            alt="ICICI Prudential Mutual Fund"
            className="h-12 w-auto object-contain mx-auto"
          />
          <div>
            <CardTitle className="text-xl text-icici-darkGray">
              Create Account
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Register for Marketing Content Management
            </p>
            {roleParam && Object.keys(ROLE_LABELS).includes(roleParam) && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge className={`text-xs ${getRoleBadgeColor(roleParam)}`}>
                  {ROLE_LABELS[roleParam]}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full focus:ring-icici-orange focus:border-icici-orange"
              />
            </div>
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
                placeholder="Create a password"
                required
                className="w-full focus:ring-icici-orange focus:border-icici-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full focus:ring-icici-orange focus:border-icici-orange"
              />
            </div>
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-icici-orange hover:bg-icici-red text-white font-semibold py-2.5 transition-colors duration-200"
              disabled={isLoading || !roleParam || !Object.keys(ROLE_LABELS).includes(roleParam)}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-icici-orange hover:text-icici-red font-medium">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;