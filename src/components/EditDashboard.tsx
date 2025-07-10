import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Save, X } from 'lucide-react';
import { PageTitleEditor } from './editors/PageTitleEditor';
import { FundInfoEditor } from './editors/FundInfoEditor';
import { HowSchemeWorkEditor } from './editors/HowSchemeWorkEditor';
import { WhyInvestEditor } from './editors/WhyInvestEditor';
import { VideoSectionEditor } from './editors/VideoSectionEditor';
import { SchemeFeaturesEditor } from './editors/SchemeFeaturesEditor';
import { SchemeRiskometerEditor } from './editors/SchemeRiskometerEditor';
import { DownloadButtonEditor } from './editors/DownloadButtonEditor';
import { WarningMessageEditor } from './editors/WarningMessageEditor';

interface EditDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave: (data: any) => void;
}

const defaultData = {
  "PAGE_TITLE": "ICICI Prudential Test Future Fund",
  "FUND_INFO": {
    "ABOUT": "About",
    "HEADING": "ICICI Prudential Test Future Fund",
    "CARD_CONTENTS": {
      "POINT 1": "The ICICI Prudential Test Future Fund is a demo fund designed to showcase the potential of innovative investment strategies. This fund aims to provide investors with a unique opportunity to explore futuristic themes and diversify their portfolio with a forward-looking approach."
    }
  },
  "HOW_SCHEME_WORK": {
    "DESCRIPTIONS": {
      "POINT_1": "Invests in a diversified portfolio aligned with futuristic themes.",
      "POINT_2": "Focuses on long-term growth opportunities in emerging sectors.",
      "POINT_3": "Designed to balance risk and reward for optimal returns."
    }
  },
  "WHY_INVEST": {
    "DESCRIPTIONS": {
      "POINT_1": "Gain exposure to innovative and future-ready investment themes.",
      "POINT_2": "Diversify your portfolio with a forward-looking strategy.",
      "POINT_3": "Leverage expert fund management for potential long-term growth."
    }
  },
  "VIDEO_SECTION": {
    "CARD_CONTENTS": {
      "VIDEO_1": {
        "THUMBNAIL": "https://via.placeholder.com/150",
        "VIDEO_URL": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      }
    },
    "CARD_TITLE": "Unlock insights into the fund - Click to watch now"
  },
  "SCHEME_FEATURES": {
    "HEADING": "Scheme Features",
    "TABLE_CONTENT": [
      {
        "TITLE": "Name of scheme",
        "DESCRIPTION": "ICICI Prudential Test Future Fund"
      },
      {
        "TITLE": "Type of scheme",
        "DESCRIPTION": "Open-ended equity scheme investing in futuristic themes"
      }
    ]
  },
  "SCHEME_RISKOMETER": {
    "TITLE": "This product is suitable for investors who are seeking*:",
    "CONTENT": [
      "Capital appreciation over the long term by investing in a diversified portfolio aligned with futuristic themes."
    ],
    "NOTE_TEXT": "*Investors should consult their financial distributors if in doubt about whether the product is suitable for them.",
    "RISK": "Moderately High",
    "RISK_VALUE": "4",
    "RISK_STATUS": "Investors understand that their principal will be at moderately high risk.",
    "BENCHMARK_NAME": "Future Growth Index"
  },
  "DOWNLOAD_BUTTON_SECTION": {
    "DOWNLOAD_FACTSHEET": "Download Presentation",
    "DOWNLOAD_FACTSHEET_PATH": "https://www.google.com",
    "DOWNLOAD_ONE_PAGER": "Download SID",
    "DOWNLOAD_ONE_PAGER_PATH": "https://www.google.com"
  },
  "WARNING_MESSAGE": "Mutual Fund investments are subject to market risk, read all scheme related documents carefully."
};

const sections = [
  { id: 'PAGE_TITLE', label: 'Page Title' },
  { id: 'FUND_INFO', label: 'Fund Information' },
  { id: 'HOW_SCHEME_WORK', label: 'How Scheme Works' },
  { id: 'WHY_INVEST', label: 'Why Invest' },
  { id: 'VIDEO_SECTION', label: 'Video Section' },
  { id: 'SCHEME_FEATURES', label: 'Scheme Features' },
  { id: 'SCHEME_RISKOMETER', label: 'Scheme Riskometer' },
  { id: 'DOWNLOAD_BUTTON_SECTION', label: 'Download Buttons' },
  { id: 'WARNING_MESSAGE', label: 'Warning Message' }
];

export const EditDashboard: React.FC<EditDashboardProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave
}) => {
  const [activeSection, setActiveSection] = useState('PAGE_TITLE');
  const [formData, setFormData] = useState(initialData || defaultData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultData);
      setHasChanges(false);
      setActiveSection('PAGE_TITLE');
    }
  }, [isOpen, initialData]);

  const updateFormData = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(formData);
    setHasChanges(false);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmed) return;
    }
    onClose();
  };

  const renderEditor = () => {
    switch (activeSection) {
      case 'PAGE_TITLE':
        return (
          <PageTitleEditor
            data={formData.PAGE_TITLE}
            onChange={(data) => updateFormData('PAGE_TITLE', data)}
          />
        );
      case 'FUND_INFO':
        return (
          <FundInfoEditor
            data={formData.FUND_INFO}
            onChange={(data) => updateFormData('FUND_INFO', data)}
          />
        );
      case 'HOW_SCHEME_WORK':
        return (
          <HowSchemeWorkEditor
            data={formData.HOW_SCHEME_WORK}
            onChange={(data) => updateFormData('HOW_SCHEME_WORK', data)}
          />
        );
      case 'WHY_INVEST':
        return (
          <WhyInvestEditor
            data={formData.WHY_INVEST}
            onChange={(data) => updateFormData('WHY_INVEST', data)}
          />
        );
      case 'VIDEO_SECTION':
        return (
          <VideoSectionEditor
            data={formData.VIDEO_SECTION}
            onChange={(data) => updateFormData('VIDEO_SECTION', data)}
          />
        );
      case 'SCHEME_FEATURES':
        return (
          <SchemeFeaturesEditor
            data={formData.SCHEME_FEATURES}
            onChange={(data) => updateFormData('SCHEME_FEATURES', data)}
          />
        );
      case 'SCHEME_RISKOMETER':
        return (
          <SchemeRiskometerEditor
            data={formData.SCHEME_RISKOMETER}
            onChange={(data) => updateFormData('SCHEME_RISKOMETER', data)}
          />
        );
      case 'DOWNLOAD_BUTTON_SECTION':
        return (
          <DownloadButtonEditor
            data={formData.DOWNLOAD_BUTTON_SECTION}
            onChange={(data) => updateFormData('DOWNLOAD_BUTTON_SECTION', data)}
          />
        );
      case 'WARNING_MESSAGE':
        return (
          <WarningMessageEditor
            data={formData.WARNING_MESSAGE}
            onChange={(data) => updateFormData('WARNING_MESSAGE', data)}
          />
        );
      default:
        return <div>Select a section to edit</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Dashboard</span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r bg-muted/20">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="font-medium text-sm text-muted-foreground mb-4">
                  SECTIONS
                </h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.label}
                    </Button>
                  ))}
                </nav>
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              {renderEditor()}
            </ScrollArea>

            {/* Footer Actions */}
            <div className="border-t p-4 bg-background">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};