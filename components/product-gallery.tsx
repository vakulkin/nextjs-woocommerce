"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { WooImage } from "@/lib/woocommerce/types";
import { cn } from "@/lib/utils";
import { ZoomIn } from "lucide-react";
import { ProductLightbox } from "@/components/product/product-lightbox";

interface ProductGalleryProps {
  images: WooImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-sm">
        No image available
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <>
      <div className="space-y-3">
        {/* Main image — click to open lightbox */}
        <button
          type="button"
          className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-secondary group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => openLightbox(selectedIndex)}
          aria-label="Open full-size image viewer"
        >
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt || productName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <span className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn className="h-4 w-4" aria-hidden="true" />
          </span>
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-[11px] rounded-full px-2.5 py-0.5 tabular-nums pointer-events-none select-none">
              {selectedIndex + 1} / {images.length}
            </span>
          )}
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Product images">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "relative h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  index === selectedIndex
                    ? "border-[var(--gold)] opacity-100"
                    : "border-transparent opacity-55 hover:opacity-85 hover:border-border"
                )}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-pressed={index === selectedIndex}
              >
                <Image
                  src={image.thumbnail || image.src}
                  alt={image.alt || `${productName} view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <ProductLightbox
          images={images}
          currentIndex={lightboxIndex}
          productName={productName}
          onClose={() => setLightboxOpen(false)}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}
    </>
  );
}

