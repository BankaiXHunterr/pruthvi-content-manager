
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Website } from './WebsiteCard';
import { apiService } from '../services/apiService';

interface EditModalProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Website, updatedData: Record<string, any>) => void;
}

interface FieldConfig {
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  label?: string;
}

const EditModal: React.FC<EditModalProps> = ({ website, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fieldConfigs, setFieldConfigs] = useState<Record<string, FieldConfig>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEditableData = async () => {
      if (website && isOpen) {
        setIsLoading(true);
        setError(null);
        try {
          // GET request to fetch editable data
          const response = await apiService.getWebsite(website.id) as any;
          
          // The response should contain the editable fields and their configurations
          if (response && response.editableFields) {
            setFormData(response.editableFields);
            setFieldConfigs(response.fieldConfigs || {});
          } else {
            // Fallback to default editable fields if backend doesn't specify
            setFormData({
              name: website.name,
              description: website.description,
              content: website.content,
              status: website.status
            });
            setFieldConfigs({
              name: { type: 'text', label: 'Name' },
              description: { type: 'textarea', label: 'Description' },
              content: { type: 'textarea', label: 'Content' },
              status: { 
                type: 'select', 
                label: 'Status',
                options: ['draft', 'marketing-review-in-progress', 'marketing-review-completed', 'ready-for-compliance-review', 'compliance-approved', 'ready-for-deployment', 'deployed', 'in-production']
              }
            });
          }
        } catch (error) {
          console.error('Error fetching editable data:', error);
          setError('Failed to load editable data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEditableData();
  }, [website, isOpen]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async () => {
    if (!website) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      // POST request to update the data
      await apiService.updateWebsite(website.id, formData);
      onSave(website, formData);
      onClose();
    } catch (error) {
      console.error('Error updating website:', error);
      setError('Failed to update website data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const renderField = (fieldName: string, fieldConfig: FieldConfig) => {
    const value = formData[fieldName] || '';
    
    switch (fieldConfig.type) {
      case 'text':
        return (
          <Input
            id={fieldName}
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldConfig.label || fieldName}`}
            className="border-gray-300 focus:border-icici-orange focus:ring-icici-orange"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            id={fieldName}
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldConfig.label || fieldName}`}
            className="min-h-[120px] resize-none border-gray-300 focus:border-icici-orange focus:ring-icici-orange"
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(newValue) => handleFieldChange(fieldName, newValue)}>
            <SelectTrigger className="border-gray-300 focus:border-icici-orange focus:ring-icici-orange">
              <SelectValue placeholder={`Select ${fieldConfig.label || fieldName}`} />
            </SelectTrigger>
            <SelectContent>
              {fieldConfig.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return null;
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
            Edit Fields – {website.name}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-icici-orange border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading editable fields...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                Retry
              </Button>
            </div>
          ) : (
            Object.entries(fieldConfigs).map(([fieldName, fieldConfig]) => (
              <div key={fieldName} className="space-y-2">
                <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
                  {fieldConfig.label || fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
                {renderField(fieldName, fieldConfig)}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting || !!error}
            className="px-6 py-2 bg-icici-orange hover:bg-icici-red text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </div>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
