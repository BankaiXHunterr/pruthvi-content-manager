import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface HowSchemeWorkEditorProps {
  data: {
    DESCRIPTIONS: {
      POINT_1: string;
      POINT_2: string;
      POINT_3: string;
    };
  };
  onChange: (data: any) => void;
}

export const HowSchemeWorkEditor: React.FC<HowSchemeWorkEditorProps> = ({
  data,
  onChange
}) => {
  const updatePoint = (point: string, value: string) => {
    onChange({
      ...data,
      DESCRIPTIONS: {
        ...data.DESCRIPTIONS,
        [point]: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How Scheme Works</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="point1">Point 1</Label>
          <Textarea
            id="point1"
            value={data.DESCRIPTIONS.POINT_1}
            onChange={(e) => updatePoint('POINT_1', e.target.value)}
            placeholder="Enter first point description"
          />
        </div>
        
        <div>
          <Label htmlFor="point2">Point 2</Label>
          <Textarea
            id="point2"
            value={data.DESCRIPTIONS.POINT_2}
            onChange={(e) => updatePoint('POINT_2', e.target.value)}
            placeholder="Enter second point description"
          />
        </div>
        
        <div>
          <Label htmlFor="point3">Point 3</Label>
          <Textarea
            id="point3"
            value={data.DESCRIPTIONS.POINT_3}
            onChange={(e) => updatePoint('POINT_3', e.target.value)}
            placeholder="Enter third point description"
          />
        </div>
      </CardContent>
    </Card>
  );
};