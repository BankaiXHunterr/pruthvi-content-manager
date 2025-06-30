
import React, { useState } from 'react';
import { Search, User, LogOut, Settings, UserCog, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { ROLE_LABELS } from '../types/auth';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { user, logout, switchRole } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'marketing-creator':
        return 'bg-blue-100 text-blue-800';
      case 'marketing-reviewer':
        return 'bg-purple-100 text-purple-800';
      case 'compliance-reviewer':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'website-developer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left - Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src="LOGO.png"
              alt="ICICI Prudential Mutual Fund"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Center - Title */}
        <div className="hidden md:block">
          <h1 className="text-lg lg:text-xl font-semibold text-icici-darkGray text-center">
            ICICI Prudential Marketing Content Management
          </h1>
        </div>

        {/* Right - Role Selector & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Role Selector - Only show for admin role */}
          {user.role === 'admin' && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              <Select value={user.role} onValueChange={(value: UserRole) => switchRole(value)}>
                <SelectTrigger className="w-48 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="marketing-creator">Marketing Creator</SelectItem>
                  <SelectItem value="marketing-reviewer">Marketing Reviewer</SelectItem>
                  <SelectItem value="compliance-reviewer">Compliance Reviewer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="website-developer">Website Developer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current Role Badge */}
          <Badge className={`${getRoleBadgeColor(user.role)} font-medium`}>
            {ROLE_LABELS[user.role]}
          </Badge>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-icici-lightGray">
                  <User className="h-4 w-4 text-icici-darkGray" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1 text-left">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <Badge className={`${getRoleBadgeColor(user.role)} text-xs w-fit`}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="md:hidden px-4 pb-3">
        <h1 className="text-lg font-semibold text-icici-darkGray">
          Content Management
        </h1>
      </div>
    </header>
  );
};

export default Header;
