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
  sku?: string;
  type: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'bangle';
  material: 'gold' | 'diamond' | 'platinum' | 'rose-gold';
  occasion?: 'bridal' | 'festive' | 'daily-wear' | 'gift';
  collection_id?: string;
  stock: number;
  featured: boolean;
  most_loved: boolean;
  new_arrival: boolean;
  sizes?: string[];
  meta_title?: string;
  meta_description?: string;
  slug: string;
}

interface ParsedProduct extends ProductData {
  rowIndex: number;
  errors: string[];
  images: File[];
  imageUrls: string[];
}

export const BulkUpload: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const requiredFields = ['name', 'type', 'material', 'stock', 'slug'];
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
            slug: 'diamond-engagement-ring'
          },
          {
            name: 'Gold Necklace Set',
            description: 'Traditional gold necklace with matching earrings',
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
            slug: 'gold-necklace-set'
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
      if (product[field]) {
        product[field] = product[field].toString().toLowerCase() === 'true';
      } else {
        product[field] = false;
      }
    });

    // Parse sizes array
    if (product.sizes && typeof product.sizes === 'string') {
      product.sizes = product.sizes.split(',').map(s => s.trim()).filter(s => s);
    } else {
      product.sizes = [];
    }

    // Parse stock to number
    if (product.stock) {
      product.stock = Number(product.stock);
    }

    return {
      ...product,
      rowIndex,
      errors,
      images: [],
      imageUrls: []
    };
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        let data: any[] = [];
        
        if (file.name.endsWith('.csv')) {
          const result = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.trim()
          });
          data = result.data;
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(content, { type: 'string' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
        }
        
        const validatedProducts = data.map((product, index) => 
          validateProduct(product, index + 1)
        );
        
        setParsedProducts(validatedProducts);
        setShowPreview(true);
        
        toast({
          title: "File parsed successfully",
          description: `Found ${validatedProducts.length} products to process`
        });
      } catch (error) {
        toast({
          title: "Error parsing file",
          description: "Please check your file format and try again",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImageFiles(files);
    
    // Auto-assign images to products based on filename matching
    const updatedProducts = parsedProducts.map(product => {
      const matchingImages = files.filter(file => {
        const fileName = file.name.toLowerCase();
        const productSlug = product.slug.toLowerCase();
        const productSku = product.sku?.toLowerCase() || '';
        
        return fileName.includes(productSlug) || 
               (productSku && fileName.includes(productSku)) ||
               fileName.includes(product.name.toLowerCase().replace(/\s+/g, '-'));
      });
      
      return {
        ...product,
        images: matchingImages.slice(0, 5) // Limit to 5 images per product
      };
    });
    
    setParsedProducts(updatedProducts);
    
    toast({
      title: "Images uploaded",
      description: `${files.length} images uploaded and auto-assigned to products`
    });
  };

  const uploadImages = async (images: File[]): Promise<string[]> => {
    const uploadPromises = images.map(async (image) => {
      const formData = new FormData();
      formData.append('file', image);
      
      const response = await fetch('/api/upload/product', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload ${image.name}`);
      }
      
      const data = await response.json();
      return data.url;
    });
    
    return Promise.all(uploadPromises);
  };

  const handleBulkUpload = async () => {
    const validProducts = parsedProducts.filter(p => p.errors.length === 0);
    
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
    
    try {
      const totalSteps = validProducts.length * 2; // Upload images + create product
      let completedSteps = 0;
      
      for (const product of validProducts) {
        // Upload images first
        let productImageUrls: string[] = [];
        if (product.images.length > 0) {
          try {
            productImageUrls = await uploadImages(product.images);
          } catch (error) {
            console.error(`Failed to upload images for ${product.name}:`, error);
          }
        }
        
        completedSteps++;
        setUploadProgress((completedSteps / totalSteps) * 100);
        
        // Create product
        const { sizes, rowIndex, errors, images, imageUrls, ...productData } = product;
        const payload = {
          ...productData,
          images: productImageUrls,
          sizes: sizes || []
        };
        
        const { error } = await supabase
          .from('products')
          .insert(payload);
        
        if (error) {
          throw error;
        }
        
        completedSteps++;
        setUploadProgress((completedSteps / totalSteps) * 100);
      }
      
      toast({
        title: "Upload completed",
        description: `Successfully uploaded ${validProducts.length} products`
      });
      
      // Reset form
      setCsvFile(null);
      setImageFiles([]);
      setParsedProducts([]);
      setShowPreview(false);
      
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
                <li>Upload a CSV or Excel file with product details</li>
                <li>Required fields: name, type, material, stock, slug</li>
                <li>Optional: Upload product images (JPG, PNG, WebP)</li>
                <li>Images will be auto-assigned based on filename matching</li>
                <li>Preview your data before confirming the upload</li>
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

              {/* Error Details */}
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

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground text-center">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
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