
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface Website {
  id: string;
  name: string;
  description: string;
  content: string;
  status: 'active' | 'pending' | 'draft';
  lastUpdated: string;
  category: string;
}

interface WebsiteCardProps {
  website: Website;
  onEdit: (website: Website) => void;
  viewMode: 'grid' | 'list';
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onEdit, viewMode }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending':
        return 'Pending Update';
      case 'draft':
        return 'Draft';
      default:
        return 'Unknown';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-icici-orange/50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-icici-darkGray">{website.name}</h3>
              <Badge className={`text-xs ${getStatusColor(website.status)}`}>
                {getStatusLabel(website.status)}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Category: {website.category}</p>
                    <p className="text-sm">Last updated: {website.lastUpdated}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-gray-600 mb-2">{website.description}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{website.content}</p>
          </div>
          <div className="ml-4">
            <Button
              onClick={() => onEdit(website)}
              className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
            >
              EDIT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-icici-orange/50 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-icici-darkGray group-hover:text-icici-red transition-colors">
              {website.name}
            </h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Category: {website.category}</p>
                  <p className="text-sm">Last updated: {website.lastUpdated}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge className={`text-xs mb-3 ${getStatusColor(website.status)}`}>
            {getStatusLabel(website.status)}
          </Badge>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{website.description}</p>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
          {website.content}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Updated: {website.lastUpdated}
        </span>
        <Button
          onClick={() => onEdit(website)}
          className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-4 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
        >
          EDIT
        </Button>
      </div>
    </div>
  );
};

export default WebsiteCard;
