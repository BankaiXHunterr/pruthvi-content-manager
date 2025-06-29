
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, User, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CommentThread, Comment, ThreadStatus, THREAD_STATUS_LABELS } from '../types/auth';

interface ThreadedCommentModalProps {
  thread: CommentThread | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateThread: (thread: CommentThread) => void;
}

const ThreadedCommentModal: React.FC<ThreadedCommentModalProps> = ({
  thread,
  isOpen,
  onClose,
  onUpdateThread
}) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  if (!thread || !user) return null;

  const getStatusColor = (status: ThreadStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-revision':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      threadId: thread.id,
      content: newComment,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString()
    };

    const updatedThread = {
      ...thread,
      comments: [...thread.comments, comment]
    };

    onUpdateThread(updatedThread);
    setNewComment('');
  };

  const handleSubmitForApproval = () => {
    if (!newComment.trim()) {
      alert('Please add a comment describing the changes implemented.');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      threadId: thread.id,
      content: `Changes implemented: ${newComment}`,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString()
    };

    const updatedThread = {
      ...thread,
      status: 'in-progress' as ThreadStatus,
      comments: [...thread.comments, comment]
    };

    onUpdateThread(updatedThread);
    setNewComment('');
  };

  const handleMarkAsApproved = () => {
    const updatedThread = {
      ...thread,
      status: 'completed' as ThreadStatus
    };

    onUpdateThread(updatedThread);
  };

  const handleMarkAsNeedsRevision = () => {
    if (!newComment.trim()) {
      alert('Please provide details about the required changes.');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      threadId: thread.id,
      content: `Additional changes required: ${newComment}`,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString()
    };

    const updatedThread = {
      ...thread,
      status: 'needs-revision' as ThreadStatus,
      comments: [...thread.comments, comment]
    };

    onUpdateThread(updatedThread);
    setNewComment('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] bg-white overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {thread.title}
            </DialogTitle>
            <Badge className={`text-xs ${getStatusColor(thread.status)}`}>
              {THREAD_STATUS_LABELS[thread.status]}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {/* Comments List */}
          <div className="space-y-4 mb-6">
            {thread.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-sm">{comment.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {comment.authorRole.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Reply Section */}
          {thread.status !== 'completed' && (
            <div className="border-t pt-4">
              <div className="mb-4">
                <Textarea
                  placeholder="Add your reply..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="mb-3"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {user.role === 'marketing-reviewer' && thread.status === 'needs-revision' && (
                  <Button
                    onClick={handleSubmitForApproval}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit for Approval
                  </Button>
                )}

                {user.role === 'compliance-reviewer' && thread.status === 'in-progress' && (
                  <>
                    <Button
                      onClick={handleMarkAsApproved}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Mark as Approved
                    </Button>
                    <Button
                      onClick={handleMarkAsNeedsRevision}
                      variant="outline"
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      Mark as Needs Revision
                    </Button>
                  </>
                )}

                <Button
                  onClick={handleAddComment}
                  variant="outline"
                  className="border-gray-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadedCommentModal;
