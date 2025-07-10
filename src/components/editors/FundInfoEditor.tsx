import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface FundInfoEditorProps {
  data: {
    ABOUT: string;
    HEADING: string;
    CARD_CONTENTS: {
      "POINT 1": string;
    };
  };
  onChange: (data: any) => void;
}

export const FundInfoEditor: React.FC<FundInfoEditorProps> = ({
  data,
  onChange
}) => {
  const updateField = (field: string, value: string) => {
    if (field === 'POINT 1') {
      onChange({
        ...data,
        CARD_CONTENTS: {
          ...data.CARD_CONTENTS,
          "POINT 1": value
        }
      });
    } else {
      onChange({
        ...data,
        [field]: value
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="about">About</Label>
          <Input
            id="about"
            value={data.ABOUT}
            onChange={(e) => updateField('ABOUT', e.target.value)}
            placeholder="Enter about text"
          />
        </div>
        
        <div>
          <Label htmlFor="heading">Heading</Label>
          <Input
            id="heading"
            value={data.HEADING}
            onChange={(e) => updateField('HEADING', e.target.value)}
            placeholder="Enter heading"
          />
        </div>
        
        <div>
          <Label htmlFor="point1">Content Point 1</Label>
          <Textarea
            id="point1"
            value={data.CARD_CONTENTS["POINT 1"]}
            onChange={(e) => updateField('POINT 1', e.target.value)}
            placeholder="Enter content description"
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};