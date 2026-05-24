'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProductImageLightboxProps {
  currentIndex: number;
  images: string[];
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  productName: string;
}

export function ProductImageLightbox({
  currentIndex,
  images,
  onIndexChange,
  onOpenChange,
  open,
  productName,
}: ProductImageLightboxProps) {
  if (!images.length) {
    return null;
  }

  const handlePrevious = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-screen w-screen max-w-none rounded-none border-none bg-white p-0 shadow-none"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">{productName} image gallery</DialogTitle>

        <button
          type="button"
          className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-colors hover:border-accent hover:text-accent"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white px-6 py-16">
          <div className="relative h-full w-full max-w-5xl">
            <Image
              src={images[currentIndex]}
              alt={`${productName} image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/[0.04] text-black transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/[0.04] text-black transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={handleNext}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-3">
              {images.map((_, index) => (
                <button
                  key={`${productName}-${index}`}
                  type="button"
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-6 bg-accent' : 'bg-black/20 hover:bg-black/40'
                  }`}
                  onClick={() => onIndexChange(index)}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
