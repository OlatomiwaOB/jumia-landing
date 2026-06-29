"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { CameraIcon } from "@/components/icons/icons";

interface ImageUploadFieldProps {
  label: string;
  previewUrl: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading?: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  error?: string;
}

export function ImageUploadField({
  label,
  previewUrl,
  fileInputRef,
  isUploading,
  onFileChange,
  onClear,
  error,
}: ImageUploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-dark-gray">
        {label}
      </Label>
      <div className="space-y-3">
        {previewUrl && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden border border-gray-200">
              <Image
                src={previewUrl}
                alt={label}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-sm text-medium-gray">Image preview</div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="border-2 border-dashed border-faded-accent rounded-lg p-6 text-center hover:border-sidebar-accent/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id={`photo-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            disabled={isUploading}
          />
          <Label
            htmlFor={`photo-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center gap-2">
              <CameraIcon className="w-8 h-8 text-faded-accent" />
              <p className="text-sm text-dark-gray">
                <span className="text-faded-accent font-medium">Click to upload</span>
              </p>
              <p className="text-xs text-medium-gray">PNG, JPG or WebP (max. 5MB)</p>
            </div>
          </Label>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
