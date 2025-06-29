
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { Website } from './WebsiteCard';
import { WebsiteStatus, CommentThread, Comment } from '../types/auth';

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

  const renderComplianceReviewerOptions = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => handleStatusUpdate('ready-for-deployment')}
          className="bg-green-600 hover:bg-green-700 text-white py-3"
        >
          Mark as "Compliance Review Completed"
        </Button>
        
        <Button
          onClick={() => setShowRevisionForm(true)}
          variant="outline"
          className="border-orange-300 text-orange-600 hover:bg-orange-50 py-3"
        >
          Mark as "Needs Revision"
        </Button>
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
      <Button
        onClick={() => handleStatusUpdate('ready-for-compliance-review')}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 w-full"
      >
        Mark as "Marketing Review Completed"
      </Button>
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
          <p className="text-sm text-gray-600 mb-4">
            Current Status: <span className="font-semibold">{website.status}</span>
          </p>
          
          {user.role === 'compliance-reviewer' && renderComplianceReviewerOptions()}
          {user.role === 'marketing-reviewer' && renderMarketingReviewerOptions()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
