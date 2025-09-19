import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
}

export default function ImageUpload({ 
  value = [], 
  onChange, 
  multiple = false, 
  maxImages = 10 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Mock upload function - in a real app, this would upload to cloud storage
  const uploadImage = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a mock URL - in production, this would be the actual uploaded image URL
    const mockUrl = URL.createObjectURL(file);
    return mockUrl;
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map(uploadImage);
      const urls = await Promise.all(uploadPromises);

      if (multiple) {
        const currentUrls = Array.isArray(value) ? value : [];
        const newUrls = [...currentUrls, ...urls].slice(0, maxImages);
        onChange(newUrls);
      } else {
        onChange([urls[0]]);
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
    } finally {
      setUploading(false);
    }
  }, [value, onChange, multiple, maxImages]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const currentImages = Array.isArray(value) ? value : [];
  const canUploadMore = multiple ? currentImages.length < maxImages : currentImages.length === 0;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          data-testid="image-upload-area"
        >
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <h3 className="text-lg font-medium mb-2">
              {uploading ? "Uploading..." : "Upload Images"}
            </h3>
            
            <p className="text-sm text-muted-foreground text-center mb-4">
              Drag and drop your images here, or click to browse
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileInputChange}
              disabled={uploading}
            />
            
            <Button
              variant="outline"
              asChild
              disabled={uploading}
              data-testid="button-browse-images"
            >
              <label htmlFor="file-upload" className="cursor-pointer">
                <ImageIcon className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Browse Images"}
              </label>
            </Button>

            {multiple && (
              <p className="text-xs text-muted-foreground mt-2">
                {currentImages.length} of {maxImages} images uploaded
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Images */}
      {currentImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentImages.map((url, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden bg-muted aspect-square"
                data-testid={`image-preview-${index}`}
              >
                <OptimizedImage
                  src={url}
                  alt={`Upload ${index + 1}`}
                  width={200}
                  height={200}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full"
                  sizes="200px"
                />
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    className="h-8 w-8 p-0"
                    data-testid={`button-remove-image-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {index === 0 && multiple && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: JPG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 10MB per image</p>
        <p>• Recommended dimensions: 1200x800px or higher</p>
        {multiple && <p>• You can upload up to {maxImages} images</p>}
      </div>
    </div>
  );
}
