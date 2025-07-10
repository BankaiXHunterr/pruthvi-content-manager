import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VideoSectionEditorProps {
  data: {
    CARD_CONTENTS: {
      VIDEO_1: {
        THUMBNAIL: string;
        VIDEO_URL: string;
      };
    };
    CARD_TITLE: string;
  };
  onChange: (data: any) => void;
}

export const VideoSectionEditor: React.FC<VideoSectionEditorProps> = ({
  data,
  onChange
}) => {
  const updateVideoField = (field: string, value: string) => {
    onChange({
      ...data,
      CARD_CONTENTS: {
        ...data.CARD_CONTENTS,
        VIDEO_1: {
          ...data.CARD_CONTENTS.VIDEO_1,
          [field]: value
        }
      }
    });
  };

  const updateCardTitle = (value: string) => {
    onChange({
      ...data,
      CARD_TITLE: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cardTitle">Card Title</Label>
          <Input
            id="cardTitle"
            value={data.CARD_TITLE}
            onChange={(e) => updateCardTitle(e.target.value)}
            placeholder="Enter card title"
          />
        </div>
        
        <div>
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            value={data.CARD_CONTENTS.VIDEO_1.THUMBNAIL}
            onChange={(e) => updateVideoField('THUMBNAIL', e.target.value)}
            placeholder="Enter thumbnail URL"
            type="url"
          />
        </div>
        
        <div>
          <Label htmlFor="videoUrl">Video URL</Label>
          <Input
            id="videoUrl"
            value={data.CARD_CONTENTS.VIDEO_1.VIDEO_URL}
            onChange={(e) => updateVideoField('VIDEO_URL', e.target.value)}
            placeholder="Enter video URL"
            type="url"
          />
        </div>
      </CardContent>
    </Card>
  );
};