'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import MasonryGrid from '@/components/MasonryGrid';
import ImageLightbox, { type LightboxImage } from '@/components/ImageLightbox';
import { getCollectionWithImagesByShareId, type StoredImage } from '@/lib/storage';

interface CollectionData {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  inspirationImages: StoredImage[];
  _count: { inspirationImages: number };
}

export default function SharedCollectionPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = use(params);
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const data = getCollectionWithImagesByShareId(shareId);
    if (!data) {
      setNotFound(true);
    } else {
      setCollection(data as CollectionData);
    }
    setLoading(false);
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
        <div className="flex items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (notFound || !collection) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Collection Not Found</h2>
          <p className="text-gray-500 mb-6">This collection may have been removed or sharing has been disabled.</p>
          <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium">
            ← Create your own collection
          </Link>
        </div>
      </div>
    );
  }

  const lightboxImages: LightboxImage[] = collection.inspirationImages.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    title: img.title || undefined,
    source: img.source,
    sourceUrl: img.sourceUrl,
    description: img.description || undefined,
  }));

  return (
    <div className="min-h-screen pb-8" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
      {/* Minimal header */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-pink-600 hover:text-pink-700">
            <span className="text-xl">💅</span>
            <span className="font-semibold">Nail Studio</span>
          </Link>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Shared Collection</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        {/* Collection header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{collection.name}</h1>
          {collection.description && (
            <p className="text-gray-600 max-w-2xl mx-auto">{collection.description}</p>
          )}
          <div className="mt-3 text-sm text-gray-500">
            {collection._count.inspirationImages} {collection._count.inspirationImages === 1 ? 'image' : 'images'}
          </div>
        </div>

        {/* Images */}
        {collection.inspirationImages.length > 0 ? (
          <MasonryGrid>
            {collection.inspirationImages.map((image, idx) => (
              <div
                key={image.id}
                className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title || 'Nail art'}
                  className="w-full object-cover"
                  loading="lazy"
                />
                {/* Hover overlay with title */}
                {image.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium truncate">{image.title}</p>
                  </div>
                )}
              </div>
            ))}
          </MasonryGrid>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No images in this collection</h3>
          </div>
        )}
      </div>

      {/* Read-only lightbox (no save button) */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
