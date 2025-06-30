
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MessageSquare, User, Clock, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CommentThread, Comment, ThreadStatus, THREAD_STATUS_LABELS } from '../types/auth';
import { Website } from './WebsiteCard';
import { StorageUtils } from '../utils/storage';

interface ThreadedCommentModalProps {
  thread: CommentThread | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateThread: (thread: CommentThread) => void;
  website?: Website;
  projectThreads?: CommentThread[];
  onViewComments?: (website: Website) => void;
}

const ThreadedCommentModal: React.FC<ThreadedCommentModalProps> = ({
  thread,
  isOpen,
  onClose,
  onUpdateThread,
  website,
  projectThreads = [],
  onViewComments
}) => {
  const [newComment, setNewComment] = useState('');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [selectedThread, setSelectedThread] = useState<CommentThread | null>(thread);
  const { user } = useAuth();

  useEffect(() => {
    setSelectedThread(thread);
  }, [thread]);

  if (!user) return null;

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
    if (!newComment.trim() || !selectedThread) return;

    const comment: Comment = {
      id: Date.now().toString(),
      threadId: selectedThread.id,
      content: newComment,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString()
    };

    const updatedThread = {
      ...selectedThread,
      comments: [...selectedThread.comments, comment]
    };

    onUpdateThread(updatedThread);
    setSelectedThread(updatedThread);
    setNewComment('');
  };

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newComment.trim() || !website) return;

    const newThread: CommentThread = {
      id: Date.now().toString(),
      projectId: website.id,
      title: newThreadTitle,
      status: 'needs-revision',
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      comments: [{
        id: Date.now().toString(),
        threadId: Date.now().toString(),
        content: newComment,
        author: user.name,
        authorRole: user.role,
        createdAt: new Date().toISOString()
      }]
    };

    onUpdateThread(newThread);
    setSelectedThread(newThread);
    setNewThreadTitle('');
    setNewComment('');
    setShowNewThreadForm(false);
  };

  const handleSubmitForApproval = () => {
    if (!newComment.trim() || !selectedThread) {
      alert('Please add a comment describing the changes implemented.');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      threadId: selectedThread.id,
      content: `Changes implemented: ${newComment}`,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString()
    };

    const updatedThread = {
      ...selectedThread,
      status: 'in-progress' as ThreadStatus,
      comments: [...selectedThread.comments, comment]
    };

    onUpdateThread(updatedThread);
    setSelectedThread(updatedThread);
    setNewComment('');
  };

  const handleMarkAsApproved = () => {
    if (!selectedThread) return;

    const updatedThread = {
      ...selectedThread,
      status: 'completed' as ThreadStatus
    };

    onUpdateThread(updatedThread);
    setSelectedThread(updatedThread);
  };

  const handleMarkAsNeedsRevision = () => {
    if (!newComment.trim() || !selectedThread) {
      alert('Please provide details about the required changes.');
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      threadId: selectedThread.id,
      content: `Additional changes required: ${newComment}`,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString()
    };

    const updatedThread = {
      ...selectedThread,
      status: 'needs-revision' as ThreadStatus,
      comments: [...selectedThread.comments, comment]
    };

    onUpdateThread(updatedThread);
    setSelectedThread(updatedThread);
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

  const handleRegularComment = () => {
    if (website && onViewComments) {
      onViewComments(website);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] bg-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {website ? `Comments & Threads - ${website.name}` : 'Thread Discussion'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Thread Selection */}
          {website && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Review Threads</h3>
                <Button
                  onClick={() => setShowNewThreadForm(!showNewThreadForm)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Button>
              </div>

              {/* New Thread Form */}
              {showNewThreadForm && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Thread title..."
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Describe the issue or feedback..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreateThread} className="bg-green-600 hover:bg-green-700 text-white">
                        Create Thread
                      </Button>
                      <Button onClick={() => setShowNewThreadForm(false)} variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Thread List */}
              {projectThreads.length > 0 && (
                <div className="space-y-2 mb-4">
                  {projectThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedThread?.id === thread.id 
                          ? 'border-orange-300 bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedThread(thread)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{thread.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getStatusColor(thread.status)}`}>
                            {THREAD_STATUS_LABELS[thread.status]}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {thread.comments.length} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Regular Comments Button */}
              <div className="border-t pt-4">
                <Button
                  onClick={handleRegularComment}
                  variant="outline"
                  className="w-full border-icici-orange text-icici-orange hover:bg-icici-orange hover:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Regular Comments
                </Button>
              </div>
            </div>
          )}

          {/* Selected Thread Discussion */}
          {selectedThread && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedThread.title}</h3>
                <Badge className={`text-xs ${getStatusColor(selectedThread.status)}`}>
                  {THREAD_STATUS_LABELS[selectedThread.status]}
                </Badge>
              </div>

              {/* Comments List */}
              <div className="space-y-4 mb-6">
                {selectedThread.comments.map((comment) => (
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
              {selectedThread.status !== 'completed' && (
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
                    {user.role === 'marketing-reviewer' && selectedThread.status === 'needs-revision' && (
                      <Button
                        onClick={handleSubmitForApproval}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Submit for Approval
                      </Button>
                    )}

                    {user.role === 'compliance-reviewer' && selectedThread.status === 'in-progress' && (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadedCommentModal;
