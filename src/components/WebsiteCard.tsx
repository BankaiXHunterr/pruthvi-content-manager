
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Download } from 'lucide-react';
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
  onViewComments: (website: Website) => void;
  viewMode: 'grid' | 'list';
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ website, onEdit, onViewComments, viewMode }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'In Progress';
      case 'pending':
        return 'In Progress';
      case 'draft':
        return 'Draft';
      default:
        return 'Draft';
    }
  };

  const handleDownloadCodebase = () => {
    // Placeholder for download codebase functionality
    console.log('Downloading codebase for:', website.name);
    alert('Download codebase functionality will be implemented');
  };

  // Dynamic thumbnail placeholder - this would be replaced with actual screenshot/OpenGraph API
  const getThumbnailUrl = (websiteId: string) => {
    // Placeholder - would use either Puppeteer API or OpenGraph scraper
    return `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop`;
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-[#18385D]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Thumbnail */}
            <div className="w-16 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={getThumbnailUrl(website.id)} 
                alt={website.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-[#18385D] font-montserrat">{website.name}</h3>
                <Badge className={`text-xs ${getStatusColor(website.status)}`}>
                  {getStatusLabel(website.status)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex gap-2">
            <Button
              onClick={() => onViewComments(website)}
              variant="outline"
              className="border-[#18385D] text-[#18385D] hover:bg-[#18385D] hover:text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments
            </Button>
            <Button
              onClick={handleDownloadCodebase}
              variant="outline"
              className="border-[#EF6886] text-[#EF6886] hover:bg-[#EF6886] hover:text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              onClick={() => onEdit(website)}
              className="bg-[#18385D] hover:bg-[#EF6886] text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
            >
              EDIT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#18385D]/50 hover:-translate-y-1 group">
      {/* Thumbnail Image */}
      <div className="w-full h-48 bg-gray-100">
        <img 
          src={getThumbnailUrl(website.id)} 
          alt={website.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#18385D] group-hover:text-[#EF6886] transition-colors font-montserrat mb-2">
              {website.name}
            </h3>
            <Badge className={`text-xs mb-3 ${getStatusColor(website.status)}`}>
              {getStatusLabel(website.status)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-400">
            Updated: {website.lastUpdated}
          </span>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onViewComments(website)}
                    variant="outline"
                    className="border-[#18385D] text-[#18385D] hover:bg-[#18385D] hover:text-white font-semibold p-2 rounded-md transition-all duration-200 group-hover:shadow-md"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Comments</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDownloadCodebase}
                    variant="outline"
                    className="border-[#EF6886] text-[#EF6886] hover:bg-[#EF6886] hover:text-white font-semibold p-2 rounded-md transition-all duration-200 group-hover:shadow-md"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Codebase</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              onClick={() => onEdit(website)}
              className="bg-[#18385D] hover:bg-[#EF6886] text-white font-semibold px-4 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
            >
              EDIT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteCard;
