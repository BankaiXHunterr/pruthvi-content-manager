
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Website } from './WebsiteCard';
import { WebsiteStatus, CommentThread, STATUS_LABELS, getAvailableStatusTransitions, ROLE_LABELS } from '../types/auth';

interface StatusUpdateModalProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (website: Website, newStatus: WebsiteStatus, thread?: CommentThread) => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  website,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const [revisionComment, setRevisionComment] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const { user } = useAuth();

  if (!website || !user) return null;

  const availableTransitions = getAvailableStatusTransitions(user.role, website.status);

  const handleStatusUpdate = (newStatus: WebsiteStatus) => {
    onStatusUpdate(website, newStatus);
    onClose();
    setShowRevisionForm(false);
    setRevisionComment('');
  };

  const handleNeedsRevision = () => {
    if (!revisionComment.trim()) {
      alert('Please provide details about the required changes.');
      return;
    }

    // Create a new comment thread
    const thread: CommentThread = {
      id: Date.now().toString(),
      projectId: website.id,
      status: 'needs-revision',
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      title: 'Compliance Review - Needs Revision',
      comments: [{
        id: Date.now().toString(),
        threadId: Date.now().toString(),
        content: revisionComment,
        author: user.name,
        authorRole: user.role,
        createdAt: new Date().toISOString()
      }]
    };

    onStatusUpdate(website, 'marketing-review-in-progress', thread);
    onClose();
    setShowRevisionForm(false);
    setRevisionComment('');
  };

  const getStatusColor = (status: WebsiteStatus) => {
    switch (status) {
      case 'in-production':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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

  const renderComplianceReviewerOptions = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {availableTransitions.includes('compliance-approved') && (
          <Button
            onClick={() => handleStatusUpdate('compliance-approved')}
            className="bg-green-600 hover:bg-green-700 text-white py-3"
          >
            Approve for Deployment
          </Button>
        )}
        
        {availableTransitions.includes('marketing-review-in-progress') && (
          <Button
            onClick={() => setShowRevisionForm(true)}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50 py-3"
          >
            Send Back for Revision
          </Button>
        )}
      </div>

      {showRevisionForm && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-semibold mb-2">Required Changes:</h4>
          <Textarea
            placeholder="Please describe the changes that need to be made..."
            value={revisionComment}
            onChange={(e) => setRevisionComment(e.target.value)}
            className="mb-3"
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleNeedsRevision}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Submit Revision Request
            </Button>
            <Button
              onClick={() => {
                setShowRevisionForm(false);
                setRevisionComment('');
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderMarketingReviewerOptions = () => (
    <div className="space-y-4">
      {availableTransitions.includes('marketing-review-completed') && (
        <Button
          onClick={() => handleStatusUpdate('marketing-review-completed')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 w-full"
        >
          Complete Marketing Review
        </Button>
      )}
      {availableTransitions.includes('ready-for-compliance-review') && (
        <Button
          onClick={() => handleStatusUpdate('ready-for-compliance-review')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 w-full"
        >
          Submit for Compliance Review
        </Button>
      )}
    </div>
  );

  const renderGenericOptions = () => (
    <div className="space-y-3">
      {availableTransitions.map((targetStatus) => (
        <Button
          key={targetStatus}
          onClick={() => handleStatusUpdate(targetStatus)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
        >
          Update to {STATUS_LABELS[targetStatus]}
        </Button>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Update Status - {website.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Logged in as: <strong>{ROLE_LABELS[user.role]}</strong>
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Current Status: 
            <Badge className={`ml-2 text-xs ${getStatusColor(website.status)}`}>
              {STATUS_LABELS[website.status]}
            </Badge>
          </p>
          
          {availableTransitions.length > 0 ? (
            <>
              {user.role === 'compliance-reviewer' && renderComplianceReviewerOptions()}
              {user.role === 'marketing-reviewer' && renderMarketingReviewerOptions()}
              {!['compliance-reviewer', 'marketing-reviewer'].includes(user.role) && renderGenericOptions()}
            </>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Actions Available</h3>
              <p className="text-gray-500">
                No status transitions are available for this project at the moment.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;

