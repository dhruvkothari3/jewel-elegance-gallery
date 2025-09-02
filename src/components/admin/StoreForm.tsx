import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StoreFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const StoreForm: React.FC<StoreFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    store_name: initialData?.store_name || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    phone: initialData?.phone || '',
    hours: initialData?.hours || '',
    map_link: initialData?.map_link || '',
    lat: initialData?.lat || null,
    lng: initialData?.lng || null
  });

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="store_name">Store Name *</Label>
              <Input
                id="store_name"
                value={formData.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                required
                placeholder="e.g., Downtown Showroom"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="hours">Operating Hours</Label>
              <Textarea
                id="hours"
                value={formData.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                rows={3}
                placeholder="Mon-Fri: 9AM-6PM&#10;Sat: 10AM-4PM&#10;Sun: Closed"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="New York"
              />
            </div>

            <div>
              <Label htmlFor="map_link">Google Maps Link</Label>
              <Input
                id="map_link"
                type="url"
                value={formData.map_link}
                onChange={(e) => handleInputChange('map_link', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat || ''}
                  onChange={(e) => handleInputChange('lat', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="40.7128"
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng || ''}
                  onChange={(e) => handleInputChange('lng', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="-74.0060"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Store' : 'Create Store'}
        </Button>
      </div>
    </form>
  );
};