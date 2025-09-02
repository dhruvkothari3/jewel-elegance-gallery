import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PRODUCT_TYPES = ['ring', 'necklace', 'earring', 'bracelet', 'bangle'];
const MATERIALS = ['gold', 'diamond', 'platinum', 'rose-gold'];
const OCCASIONS = ['bridal', 'festive', 'daily-wear', 'gift'];

interface ProductFormProps {
  collections: any[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  collections,
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    sku: initialData?.sku || '',
    slug: initialData?.slug || '',
    type: initialData?.type || '',
    material: initialData?.material || '',
    occasion: initialData?.occasion || '',
    collection_id: initialData?.collection_id || '',
    stock: initialData?.stock || 0,
    featured: initialData?.featured || false,
    new_arrival: initialData?.new_arrival || false,
    most_loved: initialData?.most_loved || false,
    images: initialData?.images || [],
    sizes: initialData?.sizes || [],
    meta_title: initialData?.meta_title || '',
    meta_description: initialData?.meta_description || ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name' && !initialData) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSizeAdd = () => {
    const size = prompt('Enter size:');
    if (size) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    }
  };

  const handleSizeRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Product Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="material">Material *</Label>
              <Select value={formData.material} onValueChange={(value) => handleInputChange('material', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {MATERIALS.map(material => (
                    <SelectItem key={material} value={material}>
                      {material.charAt(0).toUpperCase() + material.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="occasion">Occasion</Label>
              <Select value={formData.occasion} onValueChange={(value) => handleInputChange('occasion', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map(occasion => (
                    <SelectItem key={occasion} value={occasion}>
                      {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="collection">Collection</Label>
              <Select value={formData.collection_id} onValueChange={(value) => handleInputChange('collection_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map(collection => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.images.map((image: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <img src={image} alt={`Product ${index + 1}`} className="w-12 h-12 object-cover rounded" />
                  <span className="flex-1 text-sm truncate">{image}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleImageRemove(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleImageAdd}>
                Add Image URL
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="new_arrival"
                checked={formData.new_arrival}
                onCheckedChange={(checked) => handleInputChange('new_arrival', checked)}
              />
              <Label htmlFor="new_arrival">New Arrival</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="most_loved"
                checked={formData.most_loved}
                onCheckedChange={(checked) => handleInputChange('most_loved', checked)}
              />
              <Label htmlFor="most_loved">Most Loved</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              value={formData.meta_title}
              onChange={(e) => handleInputChange('meta_title', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => handleInputChange('meta_description', e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};