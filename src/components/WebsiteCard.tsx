
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoIcon, MessageSquare, Download, Edit } from 'lucide-react';
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
  status: 'draft' | 'marketing-review' | 'compliance-review' | 'ready-to-deploy' | 'deployed' | 'issue';
  lastUpdated: string;
  category: string;
  url?: string;
}

interface WebsiteCardProps {
  website: Website;
  onEdit: (website: Website) => void;
  onViewComments: (website: Website) => void;
  onDownload: (website: Website) => void;
  viewMode: 'grid' | 'list';
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onEdit, onViewComments, onDownload, viewMode }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailLoading, setThumbnailLoading] = useState(true);

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (!website.url) {
        setThumbnailLoading(false);
        return;
      }

      try {
        // First try to get OpenGraph image
        const response = await fetch(`https://api.opengraph.io/v1/site/${encodeURIComponent(website.url)}?app_id=your-app-id`);
        const data = await response.json();
        
        if (data?.hybridGraph?.image) {
          setThumbnailUrl(data.hybridGraph.image);
        } else {
          // Fallback to Puppeteer screenshot API
          const screenshotUrl = `https://api.screenshotlayer.com/api/capture?access_key=your-api-key&url=${encodeURIComponent(website.url)}&width=400&viewport=1440x900&format=PNG`;
          setThumbnailUrl(screenshotUrl);
        }
      } catch (error) {
        console.log('Error fetching thumbnail:', error);
        // Use a placeholder image
        setThumbnailUrl('/placeholder.svg');
      } finally {
        setThumbnailLoading(false);
      }
    };

    fetchThumbnail();
  }, [website.url]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ready-to-deploy':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'marketing-review':
      case 'compliance-review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'issue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'Deployed in Production';
      case 'ready-to-deploy':
        return 'Ready to Deploy';
      case 'marketing-review':
        return 'Marketing Review in Progress';
      case 'compliance-review':
        return 'Compliance Review in Progress';
      case 'draft':
        return 'Draft';
      case 'issue':
        return 'Issue with Comment';
      default:
        return 'Unknown';
    }
  };

  const handleNoCodeEdit = () => {
    // Open no-code editor in a new window/tab
    const noCodeUrl = `https://editor.lovable.dev/project/${website.name.toLowerCase().replace(/\s+/g, '-')}`;
    window.open(noCodeUrl, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-icici-orange/50">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0">
              {thumbnailLoading ? (
                <div className="w-20 h-16 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <img 
                  src={thumbnailUrl || '/placeholder.svg'} 
                  alt={`${website.name} thumbnail`}
                  className="w-20 h-16 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              )}
            </div>
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
          </div>
          <div className="ml-4 flex gap-2">
            <Button
              onClick={() => onDownload(website)}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              onClick={() => onViewComments(website)}
              variant="outline"
              className="border-icici-orange text-icici-orange hover:bg-icici-orange hover:text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments
            </Button>
            <Button
              onClick={handleNoCodeEdit}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Edit className="h-4 w-4 mr-1" />
              No-Code Edit
            </Button>
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

      {/* Thumbnail Image */}
      <div className="mb-4">
        {thumbnailLoading ? (
          <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <img 
            src={thumbnailUrl || '/placeholder.svg'} 
            alt={`${website.name} thumbnail`}
            className="w-full h-32 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{website.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Updated: {website.lastUpdated}
        </span>
        <div className="flex gap-2">
          <Button
            onClick={() => onDownload(website)}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onViewComments(website)}
            variant="outline"
            className="border-icici-orange text-icici-orange hover:bg-icici-orange hover:text-white font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleNoCodeEdit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onEdit(website)}
            className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-4 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
          >
            EDIT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCard;
