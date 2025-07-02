
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Website } from './WebsiteCard';
import { WebsiteStatus, CommentThread, STATUS_LABELS, getAvailableStatusTransitions, ROLE_LABELS } from '../types/auth';

interface StatusManagementModalProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (website: Website, newStatus: WebsiteStatus, thread?: CommentThread) => void;
}

const StatusManagementModal: React.FC<StatusManagementModalProps> = ({
  website,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const [revisionComment, setRevisionComment] = useState('');
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WebsiteStatus | null>(null);
  const { user } = useAuth();

  if (!website || !user) return null;

  const availableTransitions = getAvailableStatusTransitions(user.role, website.status);

  const handleStatusUpdate = (newStatus: WebsiteStatus) => {
    if (newStatus === 'marketing-review-in-progress' && user.role === 'compliance-reviewer') {
      // This is a revision request, show the form
      setSelectedStatus(newStatus);
      setShowRevisionForm(true);
      return;
    }

    onStatusUpdate(website, newStatus);
    onClose();
    resetForm();
  };

  const handleRevisionSubmit = () => {
    if (!revisionComment.trim() || !selectedStatus) {
      alert('Please provide details about the required changes.');
      return;
    }

    // Create a new comment thread for revision
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

    onStatusUpdate(website, selectedStatus, thread);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setShowRevisionForm(false);
    setRevisionComment('');
    setSelectedStatus(null);
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

  const getActionLabel = (targetStatus: WebsiteStatus) => {
    switch (targetStatus) {
      case 'marketing-review-in-progress':
        return user.role === 'compliance-reviewer' ? 'Send Back for Revision' : 'Start Marketing Review';
      case 'marketing-review-completed':
        return 'Complete Marketing Review';
      case 'ready-for-compliance-review':
        return 'Submit for Compliance Review';
      case 'compliance-approved':
        return 'Approve for Deployment';
      case 'ready-for-deployment':
        return 'Mark Ready for Deployment';
      case 'deployed':
        return 'Deploy to Production';
      case 'in-production':
        return 'Mark as In Production';
      default:
        return `Update to ${STATUS_LABELS[targetStatus]}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Status Management - {website.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Current Status */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Status</h4>
            <Badge className={`text-sm ${getStatusColor(website.status)}`}>
              {STATUS_LABELS[website.status]}
            </Badge>
          </div>

          {/* User Role Info */}
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Logged in as: <strong>{ROLE_LABELS[user.role]}</strong>
              </span>
            </div>
          </div>

          {/* Available Actions */}
          {availableTransitions.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">Available Actions</h4>
              <div className="space-y-3">
                {availableTransitions.map((targetStatus) => (
                  <div key={targetStatus} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Badge className={`text-xs ${getStatusColor(website.status)}`}>
                        {STATUS_LABELS[website.status]}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <Badge className={`text-xs ${getStatusColor(targetStatus)}`}>
                        {STATUS_LABELS[targetStatus]}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleStatusUpdate(targetStatus)}
                      className={`${
                        targetStatus === 'marketing-review-in-progress' && user.role === 'compliance-reviewer'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : targetStatus === 'compliance-approved'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      {getActionLabel(targetStatus)}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Actions Available</h3>
              <p className="text-gray-500">
                {user.role === 'website-developer' 
                  ? 'Website developers can only download approved content.'
                  : 'No status transitions are available for this project at the moment.'
                }
              </p>
            </div>
          )}

          {/* Revision Form */}
          {showRevisionForm && (
            <div className="mt-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
              <h4 className="font-semibold mb-3 text-orange-800">Revision Required</h4>
              <p className="text-sm text-orange-700 mb-3">
                Please provide detailed feedback about what needs to be changed:
              </p>
              <Textarea
                placeholder="Describe the specific changes required for compliance..."
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                className="mb-3"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleRevisionSubmit}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Submit Revision Request
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusManagementModal;

