import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: any;
  currentFileUrl?: string;
  accept?: string;
  label?: string;
  className?: string;
}

const FileUpload = ({ 
  onFileSelect, 
  currentFileUrl, 
  accept = "*", 
  label = "File",
  className 
}: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
    onFileSelect();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const clearFile = () => {
    setPreview(null);
  };

  const handleCardClick = () => {
    const fileInput = document.querySelector('input[type="file"][data-file-upload]') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card 
        className={cn(
          "border-2 border-dashed transition-smooth cursor-pointer hover:border-primary/50",
          isDragOver ? "border-primary bg-primary/5" : "border-border",
          preview ? "border-solid" : ""
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleCardClick}
      >
        <CardContent className="p-6 relative">
          {preview ? (
            <div className="relative">
              <div className="w-full h-32 bg-muted rounded-lg overflow-hidden mb-4">
                <img 
                  src={preview} 
                  alt={label}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                {accept.includes("image") ? (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your {label.toLowerCase()} here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: {accept === "image/*" ? "JPG, PNG, GIF" : accept}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Hidden file input - positioned outside the card */}
      <input
        type="file"
        accept={accept}
        onChange={onFileSelect}
        data-file-upload
        className="hidden"
      />
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const fileInput = document.querySelector('input[type="file"][data-file-upload]') as HTMLInputElement;
            fileInput?.click();
          }}
          className="flex-1"
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose {label}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFile}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;