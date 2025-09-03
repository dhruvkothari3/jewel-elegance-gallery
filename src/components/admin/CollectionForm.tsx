import React, { useState } from 'react';
import { uploadImageAndGetUrl } from '@/lib/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CollectionFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    handle: initialData?.handle || '',
    banner_image: initialData?.banner_image || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate handle from name
    if (field === 'name' && !initialData) {
      const handle = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, handle }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        // Upload banner image if file is selected
        const fileInput = document.getElementById('collection-banner-file') as HTMLInputElement | null;
        const file = fileInput?.files?.[0];
        let finalData = { ...formData };
        
        if (file) {
          const uploadedUrl = await uploadImageAndGetUrl(file, 'collection-banners');
          if (uploadedUrl) {
            finalData.banner_image = uploadedUrl;
          }
        }
        
        onSubmit(finalData);
      } catch (error) {
        console.error('Error uploading image:', error);
        // Submit without new image if upload fails
        onSubmit(formData);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Collection Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Collection Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="e.g., Bridal Collection"
            />
          </div>

          <div>
            <Label htmlFor="handle">Handle *</Label>
            <Input
              id="handle"
              value={formData.handle}
              onChange={(e) => handleInputChange('handle', e.target.value)}
              required
              placeholder="e.g., bridal-collection"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used in URLs. Only lowercase letters, numbers, and hyphens allowed.
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              placeholder="Describe this collection..."
            />
          </div>

          <div>
            <Label htmlFor="banner_image">Banner Image</Label>
            <div className="space-y-3">
              <div className="p-4 border-2 border-dashed rounded-lg">
                <Label htmlFor="collection-banner-file" className="cursor-pointer">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Upload banner image</p>
                    <Button type="button" variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </Label>
                <input 
                  id="collection-banner-file" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">or</div>
              
              <div>
                <Label htmlFor="banner_image_url">Enter Image URL</Label>
                <Input
                  id="banner_image_url"
                  type="url"
                  value={formData.banner_image}
                  onChange={(e) => handleInputChange('banner_image', e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>
            
            {formData.banner_image && (
              <div className="mt-3">
                <img 
                  src={formData.banner_image} 
                  alt="Banner preview"
                  className="w-full max-w-sm h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Collection' : 'Create Collection'}
        </Button>
      </div>
    </form>
  );
};