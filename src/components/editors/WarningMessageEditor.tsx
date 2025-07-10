import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WarningMessageEditorProps {
  data: string;
  onChange: (data: string) => void;
}

export const WarningMessageEditor: React.FC<WarningMessageEditorProps> = ({
  data,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Warning Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="warningMessage">Warning Text</Label>
          <Textarea
            id="warningMessage"
            value={data}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter warning message"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};