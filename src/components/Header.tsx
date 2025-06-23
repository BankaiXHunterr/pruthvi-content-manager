
import React, { useState } from 'react';
import { Search, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left - Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=120&h=60&fit=crop&crop=center"
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

        {/* Right - User Menu */}
        <div className="flex items-center space-x-2">
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
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Rachit Singh</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    rachit.singh@gmail.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
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
