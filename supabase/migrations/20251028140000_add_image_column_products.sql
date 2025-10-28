-- Add primary image column to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image TEXT;

-- Backfill image from first element of images array when missing
UPDATE public.products
SET image = CASE
  WHEN (image IS NULL OR image = '') AND images IS NOT NULL AND array_length(images, 1) >= 1 THEN images[1]
  ELSE image
END;

-- Helpful index for common filtering by primary image presence (optional)
CREATE INDEX IF NOT EXISTS idx_products_image_not_null ON public.products(image) WHERE image IS NOT NULL;

