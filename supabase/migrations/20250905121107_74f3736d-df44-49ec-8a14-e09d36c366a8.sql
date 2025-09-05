-- Create wishlist table for users to save favorite products
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Users can only view their own wishlist items
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can add items to their own wishlist
CREATE POLICY "Users can add to their own wishlist" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can remove items from their own wishlist
CREATE POLICY "Users can remove from their own wishlist" 
ON public.wishlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create viewing_requests table for store viewing appointments
CREATE TABLE public.viewing_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.viewing_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own viewing requests
CREATE POLICY "Users can view their own viewing requests" 
ON public.viewing_requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can create viewing requests
CREATE POLICY "Users can create viewing requests" 
ON public.viewing_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Admins can view all viewing requests
CREATE POLICY "Admins can view all viewing requests" 
ON public.viewing_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update viewing request status
CREATE POLICY "Admins can update viewing requests" 
ON public.viewing_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));