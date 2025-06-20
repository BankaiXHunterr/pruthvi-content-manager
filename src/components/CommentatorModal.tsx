
import React, { useState } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Website } from './WebsiteCard';

interface Comment {
  id: string;
  reviewer: string;
  message: string;
  timestamp: string;
  status: 'approved' | 'needs-revision' | 'pending';
  avatar?: string;
}

interface CommentatorModalProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
}

const CommentatorModal: React.FC<CommentatorModalProps> = ({ website, isOpen, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      reviewer: 'Sarah Johnson - Compliance Officer',
      message: 'The marketing claims need to be verified with our legal team. Please ensure all statistics mentioned are backed by recent data.',
      timestamp: '2 hours ago',
      status: 'needs-revision'
    },
    {
      id: '2',
      reviewer: 'Michael Chen - Senior Reviewer',
      message: 'Content looks good overall. Minor suggestion: consider adding a disclaimer about market risks in the investment section.',
      timestamp: '1 day ago',
      status: 'approved'
    },
    {
      id: '3',
      reviewer: 'Priya Sharma - Legal Team',
      message: 'All regulatory requirements have been met. Ready for publication once the revision is complete.',
      timestamp: '2 days ago',
      status: 'approved'
    }
  ]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      reviewer: 'Current User - Reviewer',
      message: newComment.trim(),
      timestamp: 'just now',
      status: 'pending'
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-revision':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'needs-revision':
        return 'Needs Revision';
      case 'pending':
        return 'Pending Review';
      default:
        return 'Unknown';
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length >= 2 ? names[0][0] + names[1][0] : names[0][0];
  };

  if (!website) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-icici-darkGray flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-icici-orange" />
            Compliance Comments – {website.name}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        {/* Comment Input Section */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-icici-orange text-white text-sm">
                CU
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-icici-orange focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-4 py-2"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="py-4 max-h-[400px] overflow-y-auto">
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        {comment.avatar ? (
                          <AvatarImage src={comment.avatar} alt={comment.reviewer} />
                        ) : (
                          <AvatarFallback className="bg-icici-orange text-white text-sm">
                            {getInitials(comment.reviewer)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{comment.reviewer}</p>
                        <p className="text-sm text-gray-500">{comment.timestamp}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(comment.status)}`}>
                      {getStatusLabel(comment.status)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed ml-11">{comment.message}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No comments yet</h3>
                <p className="text-gray-500">This content hasn't received any compliance comments.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-icici-orange hover:bg-icici-red text-white font-semibold"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentatorModal;
