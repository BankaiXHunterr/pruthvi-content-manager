
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Website } from './WebsiteCard';

interface EditModalProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Website, newContent: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ website, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (website) {
      setContent(website.content);
      setWordCount(website.content.split(/\s+/).filter(word => word.length > 0).length);
    }
  }, [website]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(newContent.split(/\s+/).filter(word => word.length > 0).length);
  };

  const handleSave = async () => {
    if (!website || !content.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(website, content);
    setIsLoading(false);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!website) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-hidden bg-white"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-xl font-semibold text-icici-darkGray">
            Edit Content – {website.name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marketing Content
            </label>
            <Textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Enter marketing content here..."
              className="min-h-[300px] resize-none border-gray-300 focus:border-icici-orange focus:ring-icici-orange"
              autoFocus
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>Word count: {wordCount}</span>
              <span>Last updated on {website.lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !content.trim()}
            className="px-6 py-2 bg-icici-orange hover:bg-icici-red text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              'SUBMIT'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
