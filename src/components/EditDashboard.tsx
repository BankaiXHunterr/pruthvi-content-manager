import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronDown, Edit, Trash2, Plus, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  isArray?: boolean;
}

interface Breadcrumb {
  id: string;
  label: string;
}

const EditDashboard: React.FC<EditDashboardProps> = ({ website, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchEditableData = async () => {
      if (website && isOpen) {
        setIsLoading(true);
        setError(null);
        try {
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
      
      if (Array.isArray(value)) {
        items.push({
          id: itemId,
          label,
          isArray: true
        });
      } else if (typeof value === 'object' && value !== null) {
        const children = generateSidebarItems(value, itemId);
        items.push({
          id: itemId,
          label,
          children,
          isExpanded: false
        });
      } else {
        items.push({
          id: itemId,
          label
        });
      }
    });
    
    setSidebarItems(items);
    if (items.length > 0 && !activeSection) {
      setActiveSection(items[0].id);
      updateBreadcrumbs(items[0].id);
    }
    
    return items;
  };

  const updateBreadcrumbs = (path: string) => {
    const parts = path.split('.');
    const breadcrumbs: Breadcrumb[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      const id = parts.slice(0, i + 1).join('.');
      const label = parts[i].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({ id, label });
    }
    
    setBreadcrumbs(breadcrumbs);
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

  const handleSectionClick = (itemId: string) => {
    setActiveSection(itemId);
    updateBreadcrumbs(itemId);
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

  const handleArrayItemUpdate = (path: string, index: number, field: string, value: any) => {
    const arrayData = getNestedValue(formData, path);
    if (Array.isArray(arrayData)) {
      const updatedArray = [...arrayData];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      setFormData(prev => setNestedValue(prev, path, updatedArray));
    }
  };

  const handleArrayItemDelete = (path: string, index: number) => {
    const arrayData = getNestedValue(formData, path);
    if (Array.isArray(arrayData)) {
      const updatedArray = arrayData.filter((_, i) => i !== index);
      setFormData(prev => setNestedValue(prev, path, updatedArray));
    }
  };

  const handleArrayItemAdd = (path: string) => {
    const arrayData = getNestedValue(formData, path) || [];
    const newItem = { id: `new_${Date.now()}`, text: '' };
    const updatedArray = [...arrayData, newItem];
    setFormData(prev => setNestedValue(prev, path, updatedArray));
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

  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy JSON:', error);
    }
  };

  const renderSidebarItems = (items: SidebarItem[], level = 0) => {
    return items.map(item => (
      <SidebarMenuItem key={item.id} className={`ml-${level * 4}`}>
        {item.children ? (
          <Collapsible open={item.isExpanded} onOpenChange={() => toggleSidebarItem(item.id)}>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton className="w-full justify-between">
                <span className="flex items-center">
                  {item.isArray && <Badge variant="secondary" className="mr-2 text-xs">Array</Badge>}
                  {item.label}
                </span>
                {item.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4 mt-2">
                {renderSidebarItems(item.children, level + 1)}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuButton
            onClick={() => handleSectionClick(item.id)}
            className={`w-full justify-start ${activeSection === item.id ? 'bg-muted font-medium' : ''}`}
          >
            {item.isArray && <Badge variant="secondary" className="mr-2 text-xs">Array</Badge>}
            {item.label}
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    ));
  };

  const renderBreadcrumbs = () => (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          <button
            onClick={() => handleSectionClick(crumb.id)}
            className="hover:text-foreground transition-colors"
          >
            {crumb.label}
          </button>
          {index < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
        </React.Fragment>
      ))}
    </div>
  );

  const renderArrayContent = (data: any[], path: string) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card key={item.id || index} className="group transition-all duration-200 hover:shadow-md border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Item {index + 1}</CardTitle>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleArrayItemDelete(path, index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  {typeof value === 'string' && value.length > 100 ? (
                    <Textarea
                      value={value}
                      onChange={(e) => handleArrayItemUpdate(path, index, key, e.target.value)}
                      className="min-h-[80px] text-sm"
                      placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}...`}
                    />
                  ) : (
                    <Input
                      value={value as string}
                      onChange={(e) => handleArrayItemUpdate(path, index, key, e.target.value)}
                      className="text-sm"
                      placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-2 border-dashed border-muted-foreground/25 flex items-center justify-center min-h-[200px] hover:border-muted-foreground/50 transition-colors cursor-pointer" onClick={() => handleArrayItemAdd(path)}>
          <div className="text-center text-muted-foreground">
            <Plus className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Add New Item</p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderFieldContent = (value: any, path: string) => {
    if (typeof value === 'string') {
      return (
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardContent className="p-6">
            {value.length > 100 ? (
              <Textarea
                value={value}
                onChange={(e) => handleFieldChange(path, e.target.value)}
                className="min-h-[120px] border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                placeholder="Enter text..."
              />
            ) : (
              <Input
                value={value}
                onChange={(e) => handleFieldChange(path, e.target.value)}
                className="border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter text..."
              />
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const activeData = getNestedValue(formData, activeSection);
  const isActiveArray = Array.isArray(activeData);

  if (!website) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[70vh] p-0 gap-0">
        <SidebarProvider>
          <div className="flex h-full w-full">
            <Sidebar className="w-80 border-r">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Edit Dashboard</h2>
                <p className="text-sm text-muted-foreground">{website.name}</p>
              </div>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Data Structure</SidebarGroupLabel>
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
                <div className="flex-1">
                  {renderBreadcrumbs()}
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-muted-foreground">Loading...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-destructive mb-4">{error}</p>
                      <Button onClick={() => window.location.reload()} variant="outline">
                        Retry
                      </Button>
                    </div>
                  ) : activeData ? (
                    <div className="space-y-6">
                      {isActiveArray ? renderArrayContent(activeData, activeSection) : renderFieldContent(activeData, activeSection)}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Select a section to edit
                    </div>
                  )}
                </ScrollArea>

                <Collapsible open={jsonPreviewOpen} onOpenChange={setJsonPreviewOpen}>
                  <div className="border-t">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-4 rounded-none">
                        <span className="font-medium">JSON Preview</span>
                        {jsonPreviewOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="p-4 bg-muted/30 border-t">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium">Current JSON Data</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={copyJsonToClipboard}
                            className="h-7"
                          >
                            {copySuccess ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                            {copySuccess ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                        <ScrollArea className="h-40">
                          <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                            <code>{JSON.stringify(formData, null, 2)}</code>
                          </pre>
                        </ScrollArea>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>

              <Separator />
              <div className="flex justify-end gap-3 p-4">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
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