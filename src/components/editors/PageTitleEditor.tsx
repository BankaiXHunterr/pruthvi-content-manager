import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PageTitleEditorProps {
  data: string;
  onChange: (data: string) => void;
}

export const PageTitleEditor: React.FC<PageTitleEditorProps> = ({
  data,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Title</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pageTitle">Landing Page Title</Label>
          <Input
            id="pageTitle"
            value={data}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter page title"
          />
        </div>
      </CardContent>
    </Card>
  );
};