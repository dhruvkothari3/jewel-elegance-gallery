-- Add price_range column to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS price_range TEXT;

-- Add unique constraint for slug if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_slug_key'
  ) THEN
    ALTER TABLE public.products ADD CONSTRAINT products_slug_key UNIQUE (slug);
  END IF;
END $$;