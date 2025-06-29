
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoIcon, MessageSquare, Download, Edit, Trash2, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WebsiteStatus } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS, STATUS_LABELS } from '../types/auth';

export interface Website {
  id: string;
  name: string;
  description: string;
  content: string;
  status: WebsiteStatus;
  lastUpdated: string;
  category: string;
  url?: string;
  commentCount?: number;
  thumbailUrl?: string;
}

interface WebsiteCardProps {
  website: Website;
  onEdit: (website: Website) => void;
  onViewComments: (website: Website) => void;
  onDownload: (website: Website) => void;
  onDelete: (website: Website) => void;
  onApprove: (website: Website) => void;
  viewMode: 'grid' | 'list';
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ 
  website, 
  onEdit, 
  onViewComments, 
  onDownload, 
  onDelete, 
  onApprove,
  viewMode 
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (!website.thumbailUrl) {
        setThumbnailLoading(false);
        return;
      }

      try {
        if (website.thumbailUrl.startsWith('data:')) {
          setThumbnailUrl(website.thumbailUrl);
        } else {
          setThumbnailUrl(website.thumbailUrl);
        }
      } catch (error) {
        console.log('Error fetching thumbnail:', error);
        setThumbnailUrl('/placeholder.svg');
      } finally {
        setThumbnailLoading(false);
      }
    };

    fetchThumbnail();
  }, [website.thumbailUrl]);

  const getStatusColor = (status: WebsiteStatus) => {
    switch (status) {
      case 'compliance-approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'marketing-review-completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEditClick = () => {
    setIsPreviewModalOpen(true);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${website.name}"? This action cannot be undone.`)) {
      onDelete(website);
    }
  };

  const handleApproveClick = () => {
    if (window.confirm(`Are you sure you want to approve "${website.name}" for compliance?`)) {
      onApprove(website);
    }
  };

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];
  const canDelete = permissions.canDelete && website.status === 'draft';
  const canEdit = permissions.canEdit;
  const canApprove = permissions.canApprove && website.status === 'marketing-review-completed';
  const canDownload = permissions.canDownload && website.status === 'compliance-approved';

  if (viewMode === 'list') {
    return (
      <>
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-icici-orange/50">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0">
                {thumbnailLoading ? (
                  <div className="w-16 h-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <img 
                    src={thumbnailUrl || '/placeholder.svg'} 
                    alt={`${website.name} thumbnail`}
                    className="w-16 h-12 object-cover rounded border"
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
                    {STATUS_LABELS[website.status]}
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
              </div>
            </div>
            <div className="ml-4 flex gap-2">
              {canDownload && (
                <Button
                  onClick={() => onDownload(website)}
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
              <Button
                onClick={() => onViewComments(website)}
                variant="outline"
                className="border-icici-orange text-icici-orange hover:bg-icici-orange hover:text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Comments
                {website.commentCount && website.commentCount > 0 && (
                  <span className="ml-1 bg-icici-orange text-white text-xs rounded-full px-2 py-0.5">
                    {website.commentCount}
                  </span>
                )}
              </Button>
              {canApprove && (
                <Button
                  onClick={handleApproveClick}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              )}
              {canEdit && (
                <Button
                  onClick={handleEditClick}
                  className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-6 py-2 rounded-md transition-colors duration-200"
                >
                  EDIT
                </Button>
              )}
              {canDelete && (
                <Button
                  onClick={handleDeleteClick}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-800 font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-icici-darkGray">
                Edit Website - {website.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                {website.url && !website.url.startsWith('data:') ? (
                  <iframe
                    src={website.url}
                    className="w-full h-96 border border-gray-300 rounded"
                    title={`Preview of ${website.name}`}
                  />
                ) : (
                  <div className="w-full h-96 border border-gray-300 rounded flex items-center justify-center bg-gray-50">
                    {thumbnailUrl ? (
                      <img 
                        src={thumbnailUrl} 
                        alt={website.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <p className="text-gray-500">No preview available</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onEdit(website);
                    setIsPreviewModalOpen(false);
                  }}
                  className="px-6 py-2 bg-icici-orange hover:bg-icici-red text-white font-semibold"
                >
                  Edit Content
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
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
              {STATUS_LABELS[website.status]}
            </Badge>
          </div>
          {canDelete && (
            <Button
              onClick={handleDeleteClick}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mb-4 aspect-[4/3] w-full">
          {thumbnailLoading ? (
            <div className="w-full h-full bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <img 
              src={thumbnailUrl || '/placeholder.svg'} 
              alt={`${website.name} thumbnail`}
              className="w-full h-full object-cover rounded border"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Updated: {website.lastUpdated}
          </span>
          <div className="flex gap-2">
            {canDownload && (
              <Button
                onClick={() => onDownload(website)}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              onClick={() => onViewComments(website)}
              variant="outline"
              className="border-icici-orange text-icici-orange hover:bg-icici-orange hover:text-white font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md relative"
            >
              <MessageSquare className="h-4 w-4" />
              {website.commentCount && website.commentCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {website.commentCount}
                </span>
              )}
            </Button>
            {canApprove && (
              <Button
                onClick={handleApproveClick}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {canEdit && (
              <Button
                onClick={handleEditClick}
                className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-4 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
              >
                EDIT
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-icici-darkGray">
              Edit Website - {website.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              {website.url && !website.url.startsWith('data:') ? (
                <iframe
                  src={website.url}
                  className="w-full h-96 border border-gray-300 rounded"
                  title={`Preview of ${website.name}`}
                />
              ) : (
                <div className="w-full h-96 border border-gray-300 rounded flex items-center justify-center bg-gray-50">
                  {thumbnailUrl ? (
                    <img 
                      src={thumbnailUrl} 
                      alt={website.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-gray-500">No preview available</p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-6 py-2 border-gray-300 hover:bg-gray-50"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  window.open(website.url, '_blank');
                  setIsPreviewModalOpen(false);
                }}
                className="px-6 py-2 bg-icici-orange hover:bg-icici-red text-white font-semibold"
              >
                Visit Website
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebsiteCard;
