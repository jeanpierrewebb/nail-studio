'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';
import ImageLightbox, { type LightboxImage } from '@/components/ImageLightbox';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';
import { useToast } from '@/contexts/ToastContext';
import { getSavedImages, getCollections, type StoredImage, type StoredCollection } from '@/lib/storage';

export default function SavesPage() {
  const toast = useToast();
  const [allImages, setAllImages] = useState<StoredImage[]>([]);
  const [collections, setCollections] = useState<StoredCollection[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Save modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalImage, setSaveModalImage] = useState<{
    imageUrl: string; sourceUrl: string; source: string; title?: string; description?: string;
  } | null>(null);

  useEffect(() => {
    setAllImages(getSavedImages());
    setCollections(getCollections());
    setLoading(false);
  }, []);

  const filteredImages = activeFilter === 'all'
    ? allImages
    : allImages.filter((img) => img.collectionIds.includes(activeFilter));

  // Sort by savedAt descending
  const sortedImages = [...filteredImages].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );

  const lightboxImages: LightboxImage[] = sortedImages.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    title: img.title || undefined,
    source: img.source,
    sourceUrl: img.sourceUrl,
    description: img.description || undefined,
    notes: img.notes,
  }));

  const handleLightboxSave = (img: LightboxImage) => {
    setLightboxOpen(false);
    setSaveModalImage({
      imageUrl: img.imageUrl, sourceUrl: img.sourceUrl, source: img.source,
      title: img.title, description: img.description,
    });
    setSaveModalOpen(true);
  };

  const handleSaveToCollection = (imageData: {
    imageUrl: string; sourceUrl: string; source: string; title?: string; description?: string;
  }) => {
    setSaveModalImage(imageData);
    setSaveModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-20 sm:pb-0">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 sm:pb-0" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saves</h1>
          <p className="text-gray-600">
            {allImages.length} {allImages.length === 1 ? 'image' : 'images'} saved across {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
          </p>
        </div>

        {/* Filter tabs */}
        {allImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-4 px-4 scrollbar-hide">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${
                activeFilter === 'all'
                  ? 'bg-pink-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-pink-300'
              }`}
            >
              All Saves ({allImages.length})
            </button>
            {collections.map((col) => {
              const count = allImages.filter((img) => img.collectionIds.includes(col.id)).length;
              if (count === 0) return null;
              return (
                <button
                  key={col.id}
                  onClick={() => setActiveFilter(col.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${
                    activeFilter === col.id
                      ? 'bg-pink-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-pink-300'
                  }`}
                >
                  {col.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Images grid */}
        {sortedImages.length > 0 ? (
          <MasonryGrid>
            {sortedImages.map((image, idx) => (
              <ImageCard
                key={image.id}
                id={image.id}
                imageUrl={image.imageUrl}
                title={image.title || undefined}
                description={image.description || undefined}
                source={image.source}
                sourceUrl={image.sourceUrl}
                saved={true}
                notes={image.notes}
                onSaveToCollection={handleSaveToCollection}
                onImageClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
              />
            ))}
          </MasonryGrid>
        ) : activeFilter !== 'all' ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No images in this collection</h3>
            <button onClick={() => setActiveFilter('all')} className="btn-secondary mt-2">Show All Saves</button>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No saves yet</h3>
            <p className="text-gray-600 mb-6">Search for nail art to start saving your favorites!</p>
            <a href="/search" className="btn-primary">Search Nail Art</a>
          </div>
        )}
      </div>

      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => { setSaveModalOpen(false); setSaveModalImage(null); }}
        imageData={saveModalImage}
        onSaved={(name) => toast.success(`Saved to ${name} ✨`)}
      />

      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSave={handleLightboxSave}
      />
    </div>
  );
}
