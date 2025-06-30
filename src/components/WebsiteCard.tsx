import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InfoIcon, MessageSquare, Download, Edit, Trash2, CheckCircle, Rocket, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { WebsiteStatus, CommentThread } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS, STATUS_LABELS } from '../types/auth';
import ThreadedCommentModal from './ThreadedCommentModal';
import { StorageUtils } from '../utils/storage';

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
  onDeploy?: (website: Website, deployUrl?: string) => void;
  onStatusUpdate?: (website: Website, newStatus: WebsiteStatus, thread?: CommentThread) => void;
  viewMode: 'grid' | 'list';
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ 
  website, 
  onEdit, 
  onViewComments, 
  onDownload, 
  onDelete, 
  onApprove,
  onDeploy,
  onStatusUpdate,
  viewMode 
}) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployUrl, setDeployUrl] = useState('');
  const [projectThreads, setProjectThreads] = useState<CommentThread[]>([]);
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

  useEffect(() => {
    // Load project threads
    const threads = StorageUtils.getProjectThreads(website.id);
    setProjectThreads(threads);
  }, [website.id]);

  const getStatusColor = (status: WebsiteStatus) => {
    switch (status) {
      case 'deployed':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'compliance-approved':
      case 'ready-for-deployment':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'marketing-review-completed':
      case 'ready-for-compliance-review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'marketing-review-in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  const handleDeployClick = () => {
    if (user?.role === 'website-developer') {
      setIsDeployModalOpen(true);
    } else if (window.confirm(`Are you sure you want to deploy "${website.name}" to production?`)) {
      if (onDeploy) {
        onDeploy(website);
      }
    }
  };

  const handleDeployConfirm = () => {
    if (deployUrl.trim() && onDeploy) {
      onDeploy(website, deployUrl);
      setIsDeployModalOpen(false);
      setDeployUrl('');
    }
  };

  const handleThreadUpdate = (updatedThread: CommentThread) => {
    const allThreads = StorageUtils.loadThreads();
    const updatedThreads = allThreads.map(t => t.id === updatedThread.id ? updatedThread : t);
    StorageUtils.saveThreads(updatedThreads);
    setProjectThreads(StorageUtils.getProjectThreads(website.id));
  };

  const handleCommentsClick = () => {
    setIsCommentsModalOpen(true);
  };

  const handleVisitWebsite = () => {
    if (website.url) {
      window.open(website.url, '_blank');
    }
  };

  if (!user) return null;

  const permissions = ROLE_PERMISSIONS[user.role];
  
  // Role-based permission checks based on exact specifications
  const canDelete = permissions.canDelete && website.status === 'draft';
  const canEdit = permissions.canEdit;
  const canApprove = permissions.canApprove;
  const canDownload = permissions.canDownload && (website.status === 'compliance-approved' || website.status === 'deployed');
  const canDeploy = permissions.canDeploy && (website.status === 'compliance-approved' || website.status === 'ready-for-deployment');
  const canUpdateStatus = permissions.canUpdateStatus;
  const canComment = permissions.canComment;

  // Calculate total thread comment count
  const totalThreadComments = projectThreads.reduce((total, thread) => total + thread.comments.length, 0);
  const displayCommentCount = (website.commentCount || 0) + totalThreadComments;

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
              {canDeploy && (
                <Button
                  onClick={handleDeployClick}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <Rocket className="h-4 w-4 mr-1" />
                  Deploy
                </Button>
              )}
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
              {canComment && (
                <Button
                  onClick={handleCommentsClick}
                  variant="outline"
                  className="border-icici-orange text-icici-orange hover:bg-icici-orange hover:text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Comments
                  {displayCommentCount > 0 && (
                    <span className="ml-1 bg-icici-orange text-white text-xs rounded-full px-2 py-0.5">
                      {displayCommentCount}
                    </span>
                  )}
                </Button>
              )}
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

        {/* Deploy Modal */}
        <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-icici-darkGray">
                Deploy Website - {website.name}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <label htmlFor="deployUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Deployed URL
                </label>
                <Input
                  id="deployUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={deployUrl}
                  onChange={(e) => setDeployUrl(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsDeployModalOpen(false)}
                  className="px-6 py-2 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeployConfirm}
                  disabled={!deployUrl.trim()}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Deploy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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

        <ThreadedCommentModal
          thread={null}
          isOpen={isCommentsModalOpen}
          onClose={() => setIsCommentsModalOpen(false)}
          onUpdateThread={handleThreadUpdate}
          website={website}
          projectThreads={projectThreads}
          onViewComments={onViewComments}
        />
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
          <div className="flex gap-2 flex-wrap">
            {canDeploy && (
              <Button
                onClick={handleDeployClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
              >
                <Rocket className="h-4 w-4" />
              </Button>
            )}
            {canDownload && (
              <Button
                onClick={() => onDownload(website)}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800 font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {canComment && (
              <Button
                onClick={handleCommentsClick}
                variant="outline"
                className="border-icici-orange text-icici-orange hover:bg-icici-orange hover:text-white font-semibold px-3 py-2 rounded-md transition-all duration-200 group-hover:shadow-md relative"
              >
                <MessageSquare className="h-4 w-4" />
                {displayCommentCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {displayCommentCount}
                  </span>
                )}
              </Button>
            )}
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

      {/* Deploy Modal */}
      <Dialog open={isDeployModalOpen} onOpenChange={setIsDeployModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-icici-darkGray">
              Deploy Website - {website.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label htmlFor="deployUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Deployed URL
              </label>
              <Input
                id="deployUrl"
                type="url"
                placeholder="https://example.com"
                value={deployUrl}
                onChange={(e) => setDeployUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeployModalOpen(false)}
                className="px-6 py-2 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeployConfirm}
                disabled={!deployUrl.trim()}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Deploy
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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
                onClick={handleVisitWebsite}
                className="px-6 py-2 bg-icici-orange hover:bg-icici-red text-white font-semibold"
              >
                Visit Website
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ThreadedCommentModal
        thread={null}
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        onUpdateThread={handleThreadUpdate}
        website={website}
        projectThreads={projectThreads}
        onViewComments={onViewComments}
      />
    </>
  );
};

export default WebsiteCard;
