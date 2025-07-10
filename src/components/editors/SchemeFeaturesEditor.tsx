import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface SchemeFeaturesEditorProps {
  data: {
    HEADING: string;
    TABLE_CONTENT: Array<{
      TITLE: string;
      DESCRIPTION: string;
    }>;
  };
  onChange: (data: any) => void;
}

export const SchemeFeaturesEditor: React.FC<SchemeFeaturesEditorProps> = ({
  data,
  onChange
}) => {
  const updateHeading = (value: string) => {
    onChange({
      ...data,
      HEADING: value
    });
  };

  const updateTableItem = (index: number, field: string, value: string) => {
    const newTableContent = [...data.TABLE_CONTENT];
    newTableContent[index] = {
      ...newTableContent[index],
      [field]: value
    };
    onChange({
      ...data,
      TABLE_CONTENT: newTableContent
    });
  };

  const addTableItem = () => {
    onChange({
      ...data,
      TABLE_CONTENT: [
        ...data.TABLE_CONTENT,
        { TITLE: '', DESCRIPTION: '' }
      ]
    });
  };

  const removeTableItem = (index: number) => {
    const newTableContent = data.TABLE_CONTENT.filter((_, i) => i !== index);
    onChange({
      ...data,
      TABLE_CONTENT: newTableContent
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheme Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="heading">Heading</Label>
          <Input
            id="heading"
            value={data.HEADING}
            onChange={(e) => updateHeading(e.target.value)}
            placeholder="Enter heading"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Table Content</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTableItem}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {data.TABLE_CONTENT.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTableItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor={`title-${index}`}>Title</Label>
                  <Input
                    id={`title-${index}`}
                    value={item.TITLE}
                    onChange={(e) => updateTableItem(index, 'TITLE', e.target.value)}
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={item.DESCRIPTION}
                    onChange={(e) => updateTableItem(index, 'DESCRIPTION', e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};