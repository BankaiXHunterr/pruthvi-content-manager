import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface SchemeRiskometerEditorProps {
  data: {
    TITLE: string;
    CONTENT: string[];
    NOTE_TEXT: string;
    RISK: string;
    RISK_VALUE: string;
    RISK_STATUS: string;
    BENCHMARK_NAME: string;
  };
  onChange: (data: any) => void;
}

export const SchemeRiskometerEditor: React.FC<SchemeRiskometerEditorProps> = ({
  data,
  onChange
}) => {
  const updateField = (field: string, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const updateContentItem = (index: number, value: string) => {
    const newContent = [...data.CONTENT];
    newContent[index] = value;
    onChange({
      ...data,
      CONTENT: newContent
    });
  };

  const addContentItem = () => {
    onChange({
      ...data,
      CONTENT: [...data.CONTENT, '']
    });
  };

  const removeContentItem = (index: number) => {
    const newContent = data.CONTENT.filter((_, i) => i !== index);
    onChange({
      ...data,
      CONTENT: newContent
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheme Riskometer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.TITLE}
            onChange={(e) => updateField('TITLE', e.target.value)}
            placeholder="Enter title"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Content</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addContentItem}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Content
            </Button>
          </div>
          
          <div className="space-y-2">
            {data.CONTENT.map((content, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={content}
                  onChange={(e) => updateContentItem(index, e.target.value)}
                  placeholder={`Enter content item ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContentItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="noteText">Note Text</Label>
          <Textarea
            id="noteText"
            value={data.NOTE_TEXT}
            onChange={(e) => updateField('NOTE_TEXT', e.target.value)}
            placeholder="Enter note text"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="risk">Risk</Label>
            <Input
              id="risk"
              value={data.RISK}
              onChange={(e) => updateField('RISK', e.target.value)}
              placeholder="Enter risk level"
            />
          </div>
          
          <div>
            <Label htmlFor="riskValue">Risk Value</Label>
            <Input
              id="riskValue"
              value={data.RISK_VALUE}
              onChange={(e) => updateField('RISK_VALUE', e.target.value)}
              placeholder="Enter risk value"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="riskStatus">Risk Status</Label>
          <Textarea
            id="riskStatus"
            value={data.RISK_STATUS}
            onChange={(e) => updateField('RISK_STATUS', e.target.value)}
            placeholder="Enter risk status"
          />
        </div>
        
        <div>
          <Label htmlFor="benchmarkName">Benchmark Name</Label>
          <Input
            id="benchmarkName"
            value={data.BENCHMARK_NAME}
            onChange={(e) => updateField('BENCHMARK_NAME', e.target.value)}
            placeholder="Enter benchmark name"
          />
        </div>
      </CardContent>
    </Card>
  );
};