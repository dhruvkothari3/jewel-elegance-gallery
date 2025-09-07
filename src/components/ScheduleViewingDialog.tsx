import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Eye } from 'lucide-react';

interface ScheduleViewingDialogProps {
  productId?: string;
  productName?: string;
  storeId?: string;
  trigger?: React.ReactNode;
}

const ScheduleViewingDialog = ({ 
  productId, 
  productName, 
  storeId, 
  trigger 
}: ScheduleViewingDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.preferred_date || !formData.preferred_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('viewing_requests')
        .insert([{
          user_id: user?.id || null,
          product_id: productId,
          store_id: storeId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferred_date: formData.preferred_date,
          preferred_time: formData.preferred_time,
          message: formData.message,
          product_name: productName
        }]);

      if (error) throw error;

      toast({
        title: "Viewing Request Submitted",
        description: "We'll contact you soon to confirm your appointment.",
      });

      setIsOpen(false);
      setFormData({
        name: '',
        email: user?.email || '',
        phone: '',
        preferred_date: '',
        preferred_time: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting viewing request:', error);
      toast({
        title: "Error",
        description: "Failed to submit viewing request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="lg" className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Eye className="h-4 w-4 mr-2" />
            Schedule Viewing
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Store Visit
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {productName && (
            <div className="p-3 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Product:</p>
              <p className="font-medium">{productName}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Preferred Date *</Label>
              <Input
                id="date"
                name="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Preferred Time *</Label>
              <Input
                id="time"
                name="preferred_time"
                type="time"
                value={formData.preferred_time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Any specific jewelry pieces or collections you're interested in?"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Visit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleViewingDialog;

