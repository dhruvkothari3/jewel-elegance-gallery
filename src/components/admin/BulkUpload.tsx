import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Upload, FileSpreadsheet, Image, CheckCircle2, X, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductData {
  name: string;
  description?: string;
  priceRange: string;
  sku?: string;
  type: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'bangle';
  material: 'gold' | 'diamond' | 'platinum' | 'rose-gold';
  occasion?: 'bridal' | 'festive' | 'daily-wear' | 'gift';
  collection?: string; // human-readable collection name/handle from CSV
  collection_id?: string; // resolved UUID
  stock: number;
  featured: boolean;
  most_loved: boolean;
  new_arrival: boolean;
  sizes?: string[];
  meta_title?: string;
  meta_description?: string;
  slug: string;
  image_filenames?: string; // pipe-separated list of image filenames
}

interface ParsedProduct extends ProductData {
  rowIndex: number;
  errors: string[];
  warnings: string[];
  images: File[];
  imageUrls: string[];
  imageMatched: boolean;
  requestedFilenames: string[];
}

interface UploadSummary {
  successWithImages: ParsedProduct[];
  successNoImages: ParsedProduct[];
  failed: ParsedProduct[];
}

export const BulkUpload: React.FC = () => {
const [csvFile, setCsvFile] = useState<File | null>(null);
const [imageFiles, setImageFiles] = useState<File[]>([]);
const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [showPreview, setShowPreview] = useState(false);
const [createdProducts, setCreatedProducts] = useState<any[]>([]);
const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null);
const { toast } = useToast();

const requiredFields = ['name', 'description', 'priceRange', 'type', 'material', 'stock', 'slug', 'collection'];
const validTypes = ['ring', 'necklace', 'earring', 'bracelet', 'bangle'];
const validMaterials = ['gold', 'diamond', 'platinum', 'rose-gold'];
const validOccasions = ['bridal', 'festive', 'daily-wear', 'gift'];

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const downloadSampleCSV = () => {
        const sampleData = [
          {
            name: 'Diamond Engagement Ring',
            description: 'Beautiful solitaire diamond ring',
            priceRange: '₹50,000 - ₹75,000',
            collection: 'bridal',
            sku: 'DR-001',
            type: 'ring',
            material: 'diamond',
            occasion: 'bridal',
            stock: 10,
            featured: 'false',
            most_loved: 'true',
            new_arrival: 'false',
            sizes: 'S,M,L',
            meta_title: 'Diamond Engagement Ring - Premium Collection',
            meta_description: 'Stunning solitaire diamond engagement ring crafted with precision',
            slug: 'diamond-engagement-ring',
            image_filenames: 'diamond-engagement-ring-1.jpg|diamond-engagement-ring-2.jpg'
          },
          {
            name: 'Gold Necklace Set',
            description: 'Traditional gold necklace with matching earrings',
            priceRange: '₹30,000 - ₹45,000',
            collection: 'festive',
            sku: 'GN-002',
            type: 'necklace',
            material: 'gold',
            occasion: 'festive',
            stock: 5,
            featured: 'true',
            most_loved: 'false',
            new_arrival: 'true',
            sizes: '',
            meta_title: 'Traditional Gold Necklace Set',
            meta_description: 'Elegant traditional gold necklace perfect for festivities',
            slug: 'gold-necklace-set',
            image_filenames: 'gold-necklace-set.png'
          }
        ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample-products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

const validateProduct = (product: any, rowIndex: number): ParsedProduct => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  requiredFields.forEach(field => {
    if (!product[field] || product[field].toString().trim() === '') {
      errors.push(`${field} is required`);
    }
  });

  // Validate enums
  if (product.type && !validTypes.includes(product.type)) {
    errors.push(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
  }
  
  if (product.material && !validMaterials.includes(product.material)) {
    errors.push(`Invalid material. Must be one of: ${validMaterials.join(', ')}`);
  }
  
  if (product.occasion && product.occasion !== '' && !validOccasions.includes(product.occasion)) {
    errors.push(`Invalid occasion. Must be one of: ${validOccasions.join(', ')}`);
  }

  // Validate stock is a number
  if (product.stock && isNaN(Number(product.stock))) {
    errors.push('Stock must be a valid number');
  }

  // Generate slug if not provided
  if (!product.slug && product.name) {
    product.slug = generateSlug(product.name);
  }

  // Parse boolean fields
  const booleanFields = ['featured', 'most_loved', 'new_arrival'];
  booleanFields.forEach(field => {
    if (product[field] !== undefined && product[field] !== null) {
      product[field] = product[field].toString().toLowerCase() === 'true';
    } else {
      product[field] = false;
    }
  });

  // Parse sizes array
  if (product.sizes && typeof product.sizes === 'string') {
    product.sizes = product.sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s);
  } else if (!product.sizes) {
    product.sizes = [];
  }

  // Parse stock to number
  if (product.stock) {
    product.stock = Number(product.stock);
  }

  // Parse image_filenames
  const requestedFilenames: string[] = [];
  if (product.image_filenames && typeof product.image_filenames === 'string') {
    requestedFilenames.push(
      ...product.image_filenames
        .split('|')
        .map((f: string) => f.trim().toLowerCase())
        .filter((f: string) => f && /\.(jpg|jpeg|png|webp)$/i.test(f))
    );
  }

  return {
    ...product,
    rowIndex,
    errors,
    warnings,
    images: [],
    imageUrls: [],
    imageMatched: false,
    requestedFilenames
  };
};

const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setCsvFile(file);
  setCreatedProducts([]);
  
  try {
    let data: any[] = [];

    if (file.name.endsWith('.csv')) {
      const text = await file.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transform: (value) => value.trim()
      });
      data = result.data as any[];
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet) as any[];
    } else {
      toast({
        title: 'Unsupported file type',
        description: 'Please upload a .csv or .xlsx file',
        variant: 'destructive'
      });
      return;
    }

    // First-pass validation
    let validatedProducts = data.map((product, index) => 
      validateProduct(product, index + 1)
    );

    // Duplicate slug check within file
    const slugCounts: Record<string, number> = {};
    validatedProducts.forEach(p => {
      if (p.slug) slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1;
    });
    validatedProducts = validatedProducts.map(p => {
      if (p.slug && slugCounts[p.slug] > 1) {
        p.errors.push('Duplicate slug in file');
      }
      return p;
    });

    // Duplicate slug check against DB
    const slugs = validatedProducts.map(p => p.slug).filter(Boolean);
    if (slugs.length > 0) {
      const { data: existing } = await supabase
        .from('products')
        .select('slug')
        .in('slug', slugs);
      const existingSet = new Set((existing || []).map((e: any) => e.slug));
      validatedProducts = validatedProducts.map(p => {
        if (existingSet.has(p.slug)) {
          p.errors.push('Slug already exists in database');
        }
        return p;
      });
    }

    // Map collections by name/handle
    const { data: collections } = await supabase
      .from('collections')
      .select('id, name, handle');
    const colMap = new Map<string, string>();
    (collections || []).forEach((c: any) => {
      if (c.name) colMap.set(c.name.toLowerCase(), c.id);
      if (c.handle) colMap.set(c.handle.toLowerCase(), c.id);
    });
    validatedProducts = validatedProducts.map(p => {
      const key = (p.collection || '').toLowerCase();
      if (key) {
        const id = colMap.get(key);
        if (id) {
          p.collection_id = id;
        } else {
          p.warnings.push(`Collection '${p.collection}' not found. Will assign no collection.`);
          p.collection_id = null as any;
        }
      } else {
        p.warnings.push('No collection specified.');
        p.collection_id = null as any;
      }
      return p;
    });

    setParsedProducts(validatedProducts);
    setShowPreview(true);
    toast({
      title: 'File parsed successfully',
      description: `Found ${validatedProducts.length} products to process`
    });
  } catch (error) {
    toast({
      title: 'Error parsing file',
      description: 'Please check your file format and try again',
      variant: 'destructive'
    });
  }
};

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImageFiles(files);
    
    // Auto-assign images to products based on filename matching (smart matching)
    const updatedProducts = parsedProducts.map(product => {
      const matchingImages: File[] = [];
      
      // If product has requested filenames from CSV, match those specifically
      if (product.requestedFilenames.length > 0) {
        product.requestedFilenames.forEach(requestedName => {
          const matchedFile = files.find(file => 
            file.name.toLowerCase().trim() === requestedName
          );
          if (matchedFile) {
            matchingImages.push(matchedFile);
          }
        });
      } else {
        // Fallback: match by slug, SKU, or name
        const matched = files.filter(file => {
          const fileName = file.name.toLowerCase().trim();
          const productSlug = product.slug.toLowerCase();
          const productSku = product.sku?.toLowerCase() || '';
          
          return fileName.includes(productSlug) || 
                 (productSku && fileName.includes(productSku)) ||
                 fileName.includes(product.name.toLowerCase().replace(/\s+/g, '-'));
        });
        matchingImages.push(...matched);
      }
      
      const imageMatched = matchingImages.length > 0;
      
      return {
        ...product,
        images: matchingImages.slice(0, 5), // Limit to 5 images per product
        imageMatched
      };
    });
    
    setParsedProducts(updatedProducts);
    
    const totalMatched = updatedProducts.filter(p => p.imageMatched).length;
    toast({
      title: "Images uploaded",
      description: `${files.length} images uploaded. ${totalMatched} products matched with images.`
    });
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    const { uploadImageAndGetUrl } = await import('@/lib/upload');
    
    const uploadPromises = images.map(async (image) => {
      try {
        const url = await uploadImageAndGetUrl(image, 'product-images');
        if (!url) {
          throw new Error(`Failed to upload ${image.name}`);
        }
        return url;
      } catch (error) {
        console.error(`Error uploading ${image.name}:`, error);
        throw error;
      }
    });
    
    return Promise.all(uploadPromises);
  };

const handleBulkUpload = async () => {
  const validProducts = parsedProducts.filter(p => p.errors.length === 0);
  const failedProducts = parsedProducts.filter(p => p.errors.length > 0);
  
  if (validProducts.length === 0) {
    toast({
      title: "No valid products to upload",
      description: "Please fix the errors in your data",
      variant: "destructive"
    });
    return;
  }
  
  setUploading(true);
  setUploadProgress(0);
  setCreatedProducts([]);
  setUploadSummary(null);
  
  try {
    const totalSteps = validProducts.length * 2; // Upload images + include in batch
    let completedSteps = 0;

    const payloads: any[] = [];
    const productsWithImages: ParsedProduct[] = [];
    const productsWithoutImages: ParsedProduct[] = [];

    for (const product of validProducts) {
      // Upload images first (optional)
      let productImageUrls: string[] = [];
      if (product.images.length > 0) {
        try {
          productImageUrls = await uploadImages(product.images);
          productsWithImages.push(product);
        } catch (error) {
          console.error(`Failed to upload images for ${product.name}:`, error);
          // Continue without images
          productsWithoutImages.push(product);
        }
      } else {
        productsWithoutImages.push(product);
      }

      completedSteps++;
      setUploadProgress((completedSteps / totalSteps) * 100);

      const { sizes, rowIndex, errors, images, imageUrls, warnings, collection, priceRange, imageMatched, requestedFilenames, image_filenames, ...productData } = product;
      payloads.push({
        ...productData,
        images: productImageUrls,
        sizes: sizes || [],
        occasion: product.occasion || null,
        sku: product.sku || null,
        meta_title: product.meta_title || null,
        meta_description: product.meta_description || null,
        collection_id: product.collection_id || null,
        price_range: priceRange,
      });

      completedSteps++;
      setUploadProgress((completedSteps / totalSteps) * 100);
    }

    // Batch insert
    const { data, error } = await supabase
      .from('products')
      .insert(payloads)
      .select();

    if (error) {
      throw error;
    }

    setCreatedProducts(data || []);
    setUploadSummary({
      successWithImages: productsWithImages,
      successNoImages: productsWithoutImages,
      failed: failedProducts
    });

    toast({
      title: "Upload completed",
      description: `Successfully uploaded ${data?.length ?? validProducts.length} products`
    });

    // Notify other admin views to refresh
    window.dispatchEvent(new CustomEvent('products:refresh'));

    // Reset form inputs but keep preview and results visible
    setCsvFile(null);
    setImageFiles([]);
  } catch (error) {
    toast({
      title: "Upload failed",
      description: error instanceof Error ? error.message : "An error occurred during upload",
      variant: "destructive"
    });
  } finally {
    setUploading(false);
    setUploadProgress(0);
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Product Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
<li>Upload a CSV (.csv) or Excel (.xlsx) file with product details</li>
<li>Required fields: name, description, priceRange, type, material, stock, slug, collection</li>
<li>Optional fields: occasion, sku, sizes, meta_title, meta_description, image_filenames</li>
<li>Use <code className="bg-muted px-1 py-0.5 rounded">image_filenames</code> field with pipe-separated filenames: <code className="bg-muted px-1 py-0.5 rounded">image-1.jpg|image-2.png</code></li>
<li>Upload product images separately (JPG, JPEG, PNG, WebP). Images auto-match by exact filename (case-insensitive)</li>
<li>Rows with errors are skipped; all valid products are uploaded</li>
              </ul>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSampleCSV}
                className="mt-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample CSV
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <Separator />

        {/* File Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV/Excel Upload */}
          <div className="space-y-2">
            <Label htmlFor="csvFile" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Product Data (CSV/Excel)
            </Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleCSVUpload}
              className="cursor-pointer"
            />
            {csvFile && (
              <Badge variant="secondary" className="mt-1">
                {csvFile.name} ({parsedProducts.length} products)
              </Badge>
            )}
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <Label htmlFor="imageFiles" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Product Images (Optional)
            </Label>
            <Input
              id="imageFiles"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            {imageFiles.length > 0 && (
              <Badge variant="secondary" className="mt-1">
                {imageFiles.length} images selected
              </Badge>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && parsedProducts.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Preview Products</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    Total: {parsedProducts.length}
                  </Badge>
                  <Badge variant="outline" className="text-green-600">
                    Valid: {parsedProducts.filter(p => p.errors.length === 0).length}
                  </Badge>
                  {parsedProducts.some(p => p.errors.length > 0) && (
                    <Badge variant="destructive">
                      Errors: {parsedProducts.filter(p => p.errors.length > 0).length}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
<TableHead>Row</TableHead>
<TableHead>Name</TableHead>
<TableHead>Type</TableHead>
<TableHead>Material</TableHead>
<TableHead>Stock</TableHead>
<TableHead>Images</TableHead>
<TableHead>Warnings</TableHead>
<TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
{parsedProducts.map((product, index) => (
  <TableRow key={index}>
    <TableCell>{product.rowIndex}</TableCell>
    <TableCell className="font-medium">{product.name}</TableCell>
    <TableCell>{product.type}</TableCell>
    <TableCell>{product.material}</TableCell>
    <TableCell>{product.stock}</TableCell>
    <TableCell>{product.images.length} images</TableCell>
    <TableCell>{product.warnings?.length || 0}</TableCell>
    <TableCell>
      {product.errors.length === 0 ? (
        <Badge variant="outline" className="text-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Valid
        </Badge>
      ) : (
        <Badge variant="destructive">
          <X className="h-3 w-3 mr-1" />
          {product.errors.length} errors
        </Badge>
      )}
    </TableCell>
  </TableRow>
))}
                  </TableBody>
                </Table>
              </div>

{/* Error & Warning Details */}
{parsedProducts.some(p => p.errors.length > 0) && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      <div className="space-y-2">
        <p><strong>Fix these errors before uploading:</strong></p>
        {parsedProducts.filter(p => p.errors.length > 0).map(product => (
          <div key={product.rowIndex} className="text-sm">
            <strong>Row {product.rowIndex} ({product.name}):</strong>
            <ul className="list-disc list-inside ml-4">
              {product.errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AlertDescription>
  </Alert>
)}
{parsedProducts.some(p => (p.warnings?.length || 0) > 0) && (
  <Alert>
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      <div className="space-y-2">
        <p><strong>Warnings (will still upload):</strong></p>
        {parsedProducts.filter(p => (p.warnings?.length || 0) > 0).map(product => (
          <div key={product.rowIndex} className="text-sm">
            <strong>Row {product.rowIndex} ({product.name}):</strong>
            <ul className="list-disc list-inside ml-4">
              {product.warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AlertDescription>
  </Alert>
)}

{/* Upload Progress */}
{uploading && (
  <div className="space-y-2">
    <Progress value={uploadProgress} />
    <p className="text-sm text-muted-foreground text-center">
      Uploading... {Math.round(uploadProgress)}%
    </p>
  </div>
)}

{/* Upload Summary */}
{!uploading && uploadSummary && (
  <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
    <h4 className="text-lg font-semibold">Upload Summary</h4>
    
    {uploadSummary.successWithImages.length > 0 && (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <h5 className="font-medium">Products with Images ({uploadSummary.successWithImages.length})</h5>
        </div>
        <ul className="list-disc list-inside text-sm ml-6 space-y-1">
          {uploadSummary.successWithImages.map((p) => (
            <li key={p.slug}>{p.name} — {p.images.length} image(s)</li>
          ))}
        </ul>
      </div>
    )}
    
    {uploadSummary.successNoImages.length > 0 && (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-yellow-600">
          <AlertCircle className="h-5 w-5" />
          <h5 className="font-medium">Products without Images ({uploadSummary.successNoImages.length})</h5>
        </div>
        <ul className="list-disc list-inside text-sm ml-6 space-y-1">
          {uploadSummary.successNoImages.map((p) => (
            <li key={p.slug}>
              {p.name}
              {p.requestedFilenames.length > 0 && (
                <span className="text-muted-foreground"> — requested: {p.requestedFilenames.join(', ')}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {uploadSummary.failed.length > 0 && (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-red-600">
          <X className="h-5 w-5" />
          <h5 className="font-medium">Failed Products ({uploadSummary.failed.length})</h5>
        </div>
        <ul className="list-disc list-inside text-sm ml-6 space-y-1">
          {uploadSummary.failed.map((p) => (
            <li key={p.rowIndex}>{p.name} — {p.errors.join(', ')}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPreview(false);
                    setParsedProducts([]);
                    setCsvFile(null);
                    setImageFiles([]);
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkUpload}
                  disabled={uploading || parsedProducts.filter(p => p.errors.length === 0).length === 0}
                  className="gradient-gold text-primary-foreground"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {parsedProducts.filter(p => p.errors.length === 0).length} Products
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};