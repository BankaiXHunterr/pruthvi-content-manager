import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronDown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Website } from './WebsiteCard';
import { apiService } from '../services/apiService';

interface EditDashboardProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Website, updatedData: Record<string, any>) => void;
}

interface SidebarItem {
  id: string;
  label: string;
  children?: SidebarItem[];
  isExpanded?: boolean;
}

const EditDashboard: React.FC<EditDashboardProps> = ({ website, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
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
          
          if (response && response.editableFields) {
            setFormData(response.editableFields);
            generateSidebarItems(response.editableFields);
          } else {
            setError('No editable fields found in response');
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

  const generateSidebarItems = (data: Record<string, any>, prefix = ''): SidebarItem[] => {
    const items: SidebarItem[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      const itemId = prefix ? `${prefix}.${key}` : key;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // This is a nested object, create a parent item with children
        const children = generateSidebarItems(value, itemId);
        items.push({
          id: itemId,
          label,
          children,
          isExpanded: false
        });
      } else {
        // This is a leaf item
        items.push({
          id: itemId,
          label
        });
      }
    });
    
    setSidebarItems(items);
    if (items.length > 0 && !activeSection) {
      setActiveSection(items[0].id);
    }
    
    return items;
  };

  const toggleSidebarItem = (itemId: string) => {
    const updateItems = (items: SidebarItem[]): SidebarItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    
    setSidebarItems(updateItems(sidebarItems));
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const setNestedValue = (obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
    return { ...obj };
  };

  const handleFieldChange = (path: string, value: any) => {
    setFormData(prev => setNestedValue(prev, path, value));
  };

  const handleSubmit = async () => {
    if (!website) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
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

  const renderSidebarItems = (items: SidebarItem[], level = 0) => {
    return items.map(item => (
      <SidebarMenuItem key={item.id} className={`ml-${level * 4}`}>
        <SidebarMenuButton
          onClick={() => {
            if (item.children) {
              toggleSidebarItem(item.id);
            } else {
              setActiveSection(item.id);
            }
          }}
          className={`w-full justify-between ${activeSection === item.id ? 'bg-muted' : ''}`}
        >
          <span>{item.label}</span>
          {item.children && (
            item.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </SidebarMenuButton>
        {item.children && item.isExpanded && (
          <div className="ml-4">
            {renderSidebarItems(item.children, level + 1)}
          </div>
        )}
      </SidebarMenuItem>
    ));
  };

  const renderField = (path: string, value: any) => {
    const fieldLabel = path.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
    
    if (typeof value === 'string') {
      return (
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{fieldLabel}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {value.length > 100 ? (
              <Textarea
                value={value}
                onChange={(e) => handleFieldChange(path, e.target.value)}
                className="min-h-[120px] resize-none border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => handleFieldChange(path, e.target.value)}
                className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
              />
            )}
            <div className="flex justify-end mt-3">
              <Button 
                size="sm" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="h-3 w-3 mr-1" />
                    Update
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else if (typeof value === 'number') {
      return (
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{fieldLabel}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(path, Number(e.target.value))}
              className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={`Enter ${fieldLabel.toLowerCase()}...`}
            />
            <div className="flex justify-end mt-3">
              <Button 
                size="sm" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-20"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="h-3 w-3 mr-1" />
                    Update
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else if (Array.isArray(value)) {
      return (
        <div className="space-y-4">
          {value.map((item, index) => (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {fieldLabel} - Item {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {Object.entries(item).map(([key, val]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <Input
                      value={val as string}
                      onChange={(e) => {
                        const newArray = [...value];
                        newArray[index] = { ...newArray[index], [key]: e.target.value };
                        handleFieldChange(path, newArray);
                      }}
                      className="border-0 bg-muted/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}...`}
                    />
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <Button 
                    size="sm" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-20"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-1" />
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(value).map(([key, val]) => (
            <Card key={key} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {renderField(`${path}.${key}`, val)}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    return null;
  };

  const activeData = getNestedValue(formData, activeSection);

  if (!website) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[70vh] p-0">
        <SidebarProvider>
          <div className="flex h-[70vh] w-full">
            <Sidebar className="w-80 border-r">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Edit Dashboard</h2>
                <p className="text-sm text-muted-foreground">{website.name}</p>
              </div>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {renderSidebarItems(sidebarItems)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">
                  {activeSection.replace(/\./g, ' > ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2 text-muted-foreground">Loading...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Retry
                    </Button>
                  </div>
                ) : activeData ? (
                  <div className="space-y-4">
                    {renderField(activeSection, activeData)}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Select a section to edit</p>
                )}
              </div>

              <div className="flex justify-end gap-3 p-4 border-t bg-muted/20">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Close Dashboard
                </Button>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditDashboard;