import React, { useState, useEffect } from 'react';
import { X, Save, Eye, Settings, Type, Image, Layout, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Website } from './WebsiteCard';

interface WebsiteBuilderModalProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Website, updatedData: any) => void;
}

interface WebsiteData {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  sections: Array<{
    id: string;
    type: 'text' | 'image' | 'hero' | 'features';
    content: any;
  }>;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

const WebsiteBuilderModal: React.FC<WebsiteBuilderModalProps> = ({ 
  website, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [websiteData, setWebsiteData] = useState<WebsiteData>({
    title: '',
    subtitle: '',
    description: '',
    heroImage: '',
    sections: [],
    colors: {
      primary: '#e97e22',
      secondary: '#1e40af',
      background: '#ffffff',
      text: '#1f2937'
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState('hero');

  useEffect(() => {
    if (website) {
      // Initialize with website data
      setWebsiteData({
        title: website.name,
        subtitle: website.description,
        description: website.content,
        heroImage: website.thumbailUrl || '',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            content: {
              title: website.name,
              subtitle: website.description,
              image: website.thumbailUrl || ''
            }
          }
        ],
        colors: {
          primary: '#e97e22',
          secondary: '#1e40af',
          background: '#ffffff',
          text: '#1f2937'
        }
      });
    }
  }, [website]);

  const handleDataChange = (field: string, value: any) => {
    setWebsiteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectionChange = (sectionId: string, content: any) => {
    setWebsiteData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, content: { ...section.content, ...content } }
          : section
      )
    }));
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setWebsiteData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!website) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedWebsite = {
        ...website,
        name: websiteData.title,
        description: websiteData.subtitle,
        content: websiteData.description,
        lastUpdated: new Date().toLocaleDateString()
      };
      
      onSave(updatedWebsite, websiteData);
      onClose();
    } catch (error) {
      console.error('Error saving website:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const PreviewComponent = () => (
    <div 
      className="w-full h-full bg-white overflow-auto"
      style={{ 
        backgroundColor: websiteData.colors.background,
        color: websiteData.colors.text 
      }}
    >
      {/* Hero Section */}
      <div 
        className="relative h-64 flex items-center justify-center"
        style={{ backgroundColor: websiteData.colors.primary }}
      >
        {websiteData.heroImage && (
          <img 
            src={websiteData.heroImage} 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">{websiteData.title}</h1>
          <p className="text-xl">{websiteData.subtitle}</p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg leading-relaxed">{websiteData.description}</p>
        </div>
      </div>
    </div>
  );

  if (!website) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-white">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-icici-darkGray flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Website Builder - {website.name}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Left Panel - Modules */}
          <div className="w-1/3 border-r border-gray-200 overflow-auto">
            <Tabs value={selectedModule} onValueChange={setSelectedModule} className="h-full">
              <TabsList className="grid w-full grid-cols-4 m-2">
                <TabsTrigger value="hero">
                  <Layout className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="content">
                  <Type className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="media">
                  <Image className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <div className="p-4 space-y-4">
                <TabsContent value="hero" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={websiteData.title}
                          onChange={(e) => handleDataChange('title', e.target.value)}
                          placeholder="Enter title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                          id="subtitle"
                          value={websiteData.subtitle}
                          onChange={(e) => handleDataChange('subtitle', e.target.value)}
                          placeholder="Enter subtitle"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={websiteData.description}
                          onChange={(e) => handleDataChange('description', e.target.value)}
                          placeholder="Enter description"
                          className="min-h-[200px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label htmlFor="heroImage">Hero Image URL</Label>
                        <Input
                          id="heroImage"
                          value={websiteData.heroImage}
                          onChange={(e) => handleDataChange('heroImage', e.target.value)}
                          placeholder="Enter image URL"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primary">Primary</Label>
                          <Input
                            id="primary"
                            type="color"
                            value={websiteData.colors.primary}
                            onChange={(e) => handleColorChange('primary', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondary">Secondary</Label>
                          <Input
                            id="secondary"
                            type="color"
                            value={websiteData.colors.secondary}
                            onChange={(e) => handleColorChange('secondary', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="background">Background</Label>
                          <Input
                            id="background"
                            type="color"
                            value={websiteData.colors.background}
                            onChange={(e) => handleColorChange('background', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="text">Text</Label>
                          <Input
                            id="text"
                            type="color"
                            value={websiteData.colors.text}
                            onChange={(e) => handleColorChange('text', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                Live Preview
              </div>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-icici-orange hover:bg-icici-red text-white font-semibold px-6"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
            <div className="flex-1 bg-gray-100 p-4">
              <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <PreviewComponent />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteBuilderModal;