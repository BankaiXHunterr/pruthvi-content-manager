import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DownloadButtonEditorProps {
  data: {
    DOWNLOAD_FACTSHEET: string;
    DOWNLOAD_FACTSHEET_PATH: string;
    DOWNLOAD_ONE_PAGER: string;
    DOWNLOAD_ONE_PAGER_PATH: string;
  };
  onChange: (data: any) => void;
}

export const DownloadButtonEditor: React.FC<DownloadButtonEditorProps> = ({
  data,
  onChange
}) => {
  const updateField = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Buttons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Factsheet Button</h4>
          <div>
            <Label htmlFor="factsheetText">Button Text</Label>
            <Input
              id="factsheetText"
              value={data.DOWNLOAD_FACTSHEET}
              onChange={(e) => updateField('DOWNLOAD_FACTSHEET', e.target.value)}
              placeholder="Enter factsheet button text"
            />
          </div>
          <div>
            <Label htmlFor="factsheetPath">Download Path</Label>
            <Input
              id="factsheetPath"
              value={data.DOWNLOAD_FACTSHEET_PATH}
              onChange={(e) => updateField('DOWNLOAD_FACTSHEET_PATH', e.target.value)}
              placeholder="Enter factsheet download URL"
              type="url"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">One Pager Button</h4>
          <div>
            <Label htmlFor="onePagerText">Button Text</Label>
            <Input
              id="onePagerText"
              value={data.DOWNLOAD_ONE_PAGER}
              onChange={(e) => updateField('DOWNLOAD_ONE_PAGER', e.target.value)}
              placeholder="Enter one pager button text"
            />
          </div>
          <div>
            <Label htmlFor="onePagerPath">Download Path</Label>
            <Input
              id="onePagerPath"
              value={data.DOWNLOAD_ONE_PAGER_PATH}
              onChange={(e) => updateField('DOWNLOAD_ONE_PAGER_PATH', e.target.value)}
              placeholder="Enter one pager download URL"
              type="url"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};