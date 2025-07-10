import React, { useState, useEffect } from 'react';
import { X, Edit, Save, Table, FileText, Video, Download, AlertTriangle, Info, Target, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Website } from './WebsiteCard';
import { apiService } from '../services/apiService';

interface EditDashboardProps {
  website: Website | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (website: Website, updatedData: Record<string, any>) => void;
}

interface SidebarSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const EditDashboard: React.FC<EditDashboardProps> = ({ website, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeSection, setActiveSection] = useState<string>('PAGE_TITLE');
  const [editingFields, setEditingFields] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sidebarSections: SidebarSection[] = [
    { id: 'PAGE_TITLE', label: 'Page Title', icon: FileText },
    { id: 'FUND_INFO', label: 'Fund Info', icon: Info },
    { id: 'HOW_SCHEME_WORK', label: 'How Scheme Works', icon: Target },
    { id: 'WHY_INVEST', label: 'Why Invest', icon: Target },
    { id: 'VIDEO_SECTION', label: 'Video Section', icon: Video },
    { id: 'SCHEME_FEATURES', label: 'Scheme Features', icon: Table },
    { id: 'SCHEME_RISKOMETER', label: 'Risk Meter', icon: AlertTriangle },
    { id: 'DOWNLOAD_BUTTON_SECTION', label: 'Downloads', icon: Download },
    { id: 'WARNING_MESSAGE', label: 'Warning Message', icon: AlertTriangle },
  ];

  useEffect(() => {
    const fetchEditableData = async () => {
      if (website && isOpen) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await apiService.getWebsite(website.id) as any;
          
          if (response && response.editableFields) {
            setFormData(response.editableFields);
          } else {
            // Set default structure if no data exists
            setFormData({
              PAGE_TITLE: "ICICI Prudential Test Future Fund",
              FUND_INFO: {
                ABOUT: "About",
                HEADING: "ICICI Prudential Test Future Fund",
                CARD_CONTENTS: {
                  "POINT 1": "The ICICI Prudential Test Future Fund is a demo fund designed to showcase the potential of innovative investment strategies."
                }
              },
              HOW_SCHEME_WORK: {
                DESCRIPTIONS: {
                  POINT_1: "Invests in a diversified portfolio aligned with futuristic themes.",
                  POINT_2: "Focuses on long-term growth opportunities in emerging sectors.",
                  POINT_3: "Designed to balance risk and reward for optimal returns."
                }
              },
              WHY_INVEST: {
                DESCRIPTIONS: {
                  POINT_1: "Gain exposure to innovative and future-ready investment themes.",
                  POINT_2: "Diversify your portfolio with a forward-looking strategy.",
                  POINT_3: "Leverage expert fund management for potential long-term growth."
                }
              },
              VIDEO_SECTION: {
                CARD_CONTENTS: {
                  VIDEO_1: {
                    THUMBNAIL: "https://via.placeholder.com/150",
                    VIDEO_URL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  }
                },
                CARD_TITLE: "Unlock insights into the fund - Click to watch now"
              },
              SCHEME_FEATURES: {
                HEADING: "Scheme Features",
                TABLE_CONTENT: [
                  { TITLE: "Name of scheme", DESCRIPTION: "ICICI Prudential Test Future Fund" },
                  { TITLE: "Type of scheme", DESCRIPTION: "Open-ended equity scheme investing in futuristic themes" }
                ]
              },
              SCHEME_RISKOMETER: {
                TITLE: "This product is suitable for investors who are seeking*:",
                CONTENT: ["Capital appreciation over the long term by investing in a diversified portfolio aligned with futuristic themes."],
                NOTE_TEXT: "*Investors should consult their financial distributors if in doubt about whether the product is suitable for them.",
                RISK: "Moderately High",
                RISK_VALUE: "4",
                RISK_STATUS: "Investors understand that their principal will be at moderately high risk.",
                BENCHMARK_NAME: "Future Growth Index"
              },
              DOWNLOAD_BUTTON_SECTION: {
                DOWNLOAD_FACTSHEET: "Download Presentation",
                DOWNLOAD_FACTSHEET_PATH: "https://www.google.com",
                DOWNLOAD_ONE_PAGER: "Download SID",
                DOWNLOAD_ONE_PAGER_PATH: "https://www.google.com"
              },
              WARNING_MESSAGE: "Mutual Fund investments are subject to market risk, read all scheme related documents carefully."
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

  const handleFieldChange = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const handleArrayItemChange = (sectionPath: string, index: number, field: string, value: string) => {
    const newData = { ...formData };
    const section = newData[sectionPath];
    if (section && Array.isArray(section.TABLE_CONTENT)) {
      section.TABLE_CONTENT[index][field] = value;
      setFormData(newData);
    }
  };

  const addTableRow = (sectionPath: string) => {
    const newData = { ...formData };
    const section = newData[sectionPath];
    if (section && Array.isArray(section.TABLE_CONTENT)) {
      section.TABLE_CONTENT.push({ TITLE: "", DESCRIPTION: "" });
      setFormData(newData);
    }
  };

  const removeTableRow = (sectionPath: string, index: number) => {
    const newData = { ...formData };
    const section = newData[sectionPath];
    if (section && Array.isArray(section.TABLE_CONTENT)) {
      section.TABLE_CONTENT.splice(index, 1);
      setFormData(newData);
    }
  };

  const toggleEdit = (fieldPath: string) => {
    setEditingFields(prev => ({
      ...prev,
      [fieldPath]: !prev[fieldPath]
    }));
  };

  const saveField = (fieldPath: string) => {
    setEditingFields(prev => ({
      ...prev,
      [fieldPath]: false
    }));
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

  const EditableField: React.FC<{
    label: string;
    value: string;
    path: string;
    multiline?: boolean;
  }> = ({ label, value, path, multiline = false }) => {
    const isEditing = editingFields[path];

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">{label}</label>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button size="sm" variant="ghost" onClick={() => toggleEdit(path)}>
                <Edit className="h-3 w-3" />
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => saveField(path)}>
                <Save className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
        {multiline ? (
          <Textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(path, e.target.value)}
            disabled={!isEditing}
            className="min-h-[80px]"
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        ) : (
          <Input
            value={value || ''}
            onChange={(e) => handleFieldChange(path, e.target.value)}
            disabled={!isEditing}
            placeholder={`Enter ${label.toLowerCase()}...`}
          />
        )}
      </div>
    );
  };

  const renderPageTitle = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Page Title
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditableField
          label="Landing Page Title"
          value={formData.PAGE_TITLE}
          path="PAGE_TITLE"
        />
      </CardContent>
    </Card>
  );

  const renderFundInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Fund Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="About"
          value={formData.FUND_INFO?.ABOUT}
          path="FUND_INFO.ABOUT"
        />
        <EditableField
          label="Heading"
          value={formData.FUND_INFO?.HEADING}
          path="FUND_INFO.HEADING"
        />
        <EditableField
          label="Description"
          value={formData.FUND_INFO?.CARD_CONTENTS?.["POINT 1"]}
          path="FUND_INFO.CARD_CONTENTS.POINT 1"
          multiline
        />
      </CardContent>
    </Card>
  );

  const renderDescriptionSection = (sectionKey: string, title: string, icon: React.ComponentType<{ className?: string }>) => {
    const Icon = icon;
    const section = formData[sectionKey];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {section?.DESCRIPTIONS && Object.entries(section.DESCRIPTIONS).map(([key, value]) => (
            <EditableField
              key={key}
              label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              value={value as string}
              path={`${sectionKey}.DESCRIPTIONS.${key}`}
              multiline
            />
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderVideoSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Section
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Card Title"
          value={formData.VIDEO_SECTION?.CARD_TITLE}
          path="VIDEO_SECTION.CARD_TITLE"
        />
        <EditableField
          label="Thumbnail URL"
          value={formData.VIDEO_SECTION?.CARD_CONTENTS?.VIDEO_1?.THUMBNAIL}
          path="VIDEO_SECTION.CARD_CONTENTS.VIDEO_1.THUMBNAIL"
        />
        <EditableField
          label="Video URL"
          value={formData.VIDEO_SECTION?.CARD_CONTENTS?.VIDEO_1?.VIDEO_URL}
          path="VIDEO_SECTION.CARD_CONTENTS.VIDEO_1.VIDEO_URL"
        />
      </CardContent>
    </Card>
  );

  const renderSchemeFeatures = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Table className="h-5 w-5" />
            Scheme Features
          </CardTitle>
          <Button size="sm" onClick={() => addTableRow('SCHEME_FEATURES')}>
            Add Row
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Heading"
          value={formData.SCHEME_FEATURES?.HEADING}
          path="SCHEME_FEATURES.HEADING"
        />
        <div className="space-y-3">
          {formData.SCHEME_FEATURES?.TABLE_CONTENT?.map((item: any, index: number) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <Input
                  value={item.TITLE || ''}
                  onChange={(e) => handleArrayItemChange('SCHEME_FEATURES', index, 'TITLE', e.target.value)}
                  placeholder="Enter title..."
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeTableRow('SCHEME_FEATURES', index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea
                  value={item.DESCRIPTION || ''}
                  onChange={(e) => handleArrayItemChange('SCHEME_FEATURES', index, 'DESCRIPTION', e.target.value)}
                  placeholder="Enter description..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRiskometer = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Risk Meter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EditableField
          label="Title"
          value={formData.SCHEME_RISKOMETER?.TITLE}
          path="SCHEME_RISKOMETER.TITLE"
          multiline
        />
        <EditableField
          label="Content"
          value={formData.SCHEME_RISKOMETER?.CONTENT?.[0]}
          path="SCHEME_RISKOMETER.CONTENT.0"
          multiline
        />
        <EditableField
          label="Note Text"
          value={formData.SCHEME_RISKOMETER?.NOTE_TEXT}
          path="SCHEME_RISKOMETER.NOTE_TEXT"
          multiline
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="Risk"
            value={formData.SCHEME_RISKOMETER?.RISK}
            path="SCHEME_RISKOMETER.RISK"
          />
          <EditableField
            label="Risk Value"
            value={formData.SCHEME_RISKOMETER?.RISK_VALUE}
            path="SCHEME_RISKOMETER.RISK_VALUE"
          />
        </div>
        <EditableField
          label="Risk Status"
          value={formData.SCHEME_RISKOMETER?.RISK_STATUS}
          path="SCHEME_RISKOMETER.RISK_STATUS"
          multiline
        />
        <EditableField
          label="Benchmark Name"
          value={formData.SCHEME_RISKOMETER?.BENCHMARK_NAME}
          path="SCHEME_RISKOMETER.BENCHMARK_NAME"
        />
      </CardContent>
    </Card>
  );

  const renderDownloadSection = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Download Section
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="Factsheet Label"
            value={formData.DOWNLOAD_BUTTON_SECTION?.DOWNLOAD_FACTSHEET}
            path="DOWNLOAD_BUTTON_SECTION.DOWNLOAD_FACTSHEET"
          />
          <EditableField
            label="Factsheet Path"
            value={formData.DOWNLOAD_BUTTON_SECTION?.DOWNLOAD_FACTSHEET_PATH}
            path="DOWNLOAD_BUTTON_SECTION.DOWNLOAD_FACTSHEET_PATH"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="One Pager Label"
            value={formData.DOWNLOAD_BUTTON_SECTION?.DOWNLOAD_ONE_PAGER}
            path="DOWNLOAD_BUTTON_SECTION.DOWNLOAD_ONE_PAGER"
          />
          <EditableField
            label="One Pager Path"
            value={formData.DOWNLOAD_BUTTON_SECTION?.DOWNLOAD_ONE_PAGER_PATH}
            path="DOWNLOAD_BUTTON_SECTION.DOWNLOAD_ONE_PAGER_PATH"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderWarningMessage = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Warning Message
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditableField
          label="Warning Message"
          value={formData.WARNING_MESSAGE}
          path="WARNING_MESSAGE"
          multiline
        />
      </CardContent>
    </Card>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'PAGE_TITLE':
        return renderPageTitle();
      case 'FUND_INFO':
        return renderFundInfo();
      case 'HOW_SCHEME_WORK':
        return renderDescriptionSection('HOW_SCHEME_WORK', 'How Scheme Works', Target);
      case 'WHY_INVEST':
        return renderDescriptionSection('WHY_INVEST', 'Why Invest', Target);
      case 'VIDEO_SECTION':
        return renderVideoSection();
      case 'SCHEME_FEATURES':
        return renderSchemeFeatures();
      case 'SCHEME_RISKOMETER':
        return renderRiskometer();
      case 'DOWNLOAD_BUTTON_SECTION':
        return renderDownloadSection();
      case 'WARNING_MESSAGE':
        return renderWarningMessage();
      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            Select a section to edit
          </div>
        );
    }
  };

  if (!website) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[80vh] p-0 gap-0">
        <SidebarProvider>
          <div className="flex h-full w-full">
            <Sidebar className="w-80 border-r">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Edit Dashboard</h2>
                <p className="text-sm text-muted-foreground">{website.name}</p>
              </div>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Sections</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {sidebarSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <SidebarMenuItem key={section.id}>
                            <SidebarMenuButton
                              onClick={() => setActiveSection(section.id)}
                              className={`w-full justify-start ${
                                activeSection === section.id ? 'bg-muted font-medium' : ''
                              }`}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {section.label}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">
                  {sidebarSections.find(s => s.id === activeSection)?.label}
                </h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

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
                ) : (
                  renderMainContent()
                )}
              </ScrollArea>

              <Separator />
              <div className="flex justify-end gap-3 p-4">
                <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Close
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update'
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