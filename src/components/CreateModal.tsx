
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Upload, Plus } from 'lucide-react';
import { Website } from './WebsiteCard';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Omit<Website, 'id'>) => void;
}

interface TeamMember {
  email: string;
  role: 'editor' | 'viewer' | 'admin';
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'editor' | 'viewer' | 'admin'>('viewer');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set canvas dimensions to 1755x1502
          canvas.width = 1755;
          canvas.height = 1502;
          
          if (ctx) {
            // Calculate crop dimensions to maintain aspect ratio
            const aspectRatio = 1755 / 1502;
            let sourceWidth = img.width;
            let sourceHeight = img.height;
            let sourceX = 0;
            let sourceY = 0;
            
            if (img.width / img.height > aspectRatio) {
              sourceWidth = img.height * aspectRatio;
              sourceX = (img.width - sourceWidth) / 2;
            } else {
              sourceHeight = img.width / aspectRatio;
              sourceY = (img.height - sourceHeight) / 2;
            }
            
            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, 1755, 1502);
            setUploadedImage(canvas.toDataURL('image/jpeg', 0.9));
          }
          setIsUploading(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addTeamMember = () => {
    if (newMemberEmail && !teamMembers.find(m => m.email === newMemberEmail)) {
      setTeamMembers([...teamMembers, { email: newMemberEmail, role: newMemberRole }]);
      setNewMemberEmail('');
      setNewMemberRole('viewer');
    }
  };

  const removeTeamMember = (email: string) => {
    setTeamMembers(teamMembers.filter(m => m.email !== email));
  };

  const handleSubmit = () => {
    if (projectName.trim()) {
      const newWebsite: Omit<Website, 'id'> = {
        name: projectName,
        description: description,
        content: `New project: ${projectName}. ${description}`,
        status: 'draft',
        lastUpdated: new Date().toLocaleDateString('en-GB'),
        category: 'New Project',
        url: uploadedImage || undefined
      };
      
      onSave(newWebsite);
      
      // Reset form
      setProjectName('');
      setDescription('');
      setTeamMembers([]);
      setUploadedImage(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-icici-darkGray">
            Create New Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="border-gray-300 focus:border-icici-orange focus:ring-icici-orange"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description"
              rows={3}
              className="border-gray-300 focus:border-icici-orange focus:ring-icici-orange"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Project Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {uploadedImage ? (
                <div className="relative">
                  <img 
                    src={uploadedImage} 
                    alt="Project preview" 
                    className="w-full h-32 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {isUploading ? 'Cropping image...' : 'Click to upload image (auto-cropped to 1755x1502)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <Label>Team Members</Label>
            
            {/* Add new member */}
            <div className="flex gap-2">
              <Input
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 border-gray-300 focus:border-icici-orange focus:ring-icici-orange"
              />
              <Select value={newMemberRole} onValueChange={(value: 'editor' | 'viewer' | 'admin') => setNewMemberRole(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                type="button"
                onClick={addTeamMember}
                variant="outline"
                disabled={!newMemberEmail}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Team member list */}
            {teamMembers.length > 0 && (
              <div className="space-y-2">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{member.email}</span>
                      <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded capitalize">
                        {member.role}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(member.email)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!projectName.trim()}
            className="px-6 py-2 bg-icici-orange hover:bg-icici-red text-white font-semibold"
          >
            Create Project
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateModal;
