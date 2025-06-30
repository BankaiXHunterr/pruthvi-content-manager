
import React from 'react';
import { Search, Grid3X3, List, Plus, Rocket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS, STATUS_LABELS } from '../types/auth';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateClick: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onCreateClick,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search websites..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-gray-300 focus:border-icici-orange focus:ring-icici-orange"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-48 border-gray-300">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">{STATUS_LABELS.draft}</SelectItem>
              <SelectItem value="marketing-review-completed">{STATUS_LABELS['marketing-review-completed']}</SelectItem>
              <SelectItem value="compliance-approved">{STATUS_LABELS['compliance-approved']}</SelectItem>
              <SelectItem value="deployed">{STATUS_LABELS.deployed}</SelectItem>
            </SelectContent>
          </Select>

          {/* Create Button - only show if user has permission */}
          {permissions.canCreate && (
            <Button
              onClick={onCreateClick}
              className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          )}

          {/* Admin-specific deployment button placeholder */}
          {user.role === 'admin' && (
            <Button
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-800 font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          )}

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`rounded-r-none ${
                viewMode === 'grid'
                  ? 'bg-icici-orange hover:bg-icici-red text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className={`rounded-l-none ${
                viewMode === 'list'
                  ? 'bg-icici-orange hover:bg-icici-red text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
