'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';
import ImageLightbox, { type LightboxImage } from '@/components/ImageLightbox';
import { useToast } from '@/contexts/ToastContext';

interface TrendingImage {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  saved: boolean;
}

const TRENDING_QUERIES = [
  'trending nail art 2026',
  'aesthetic nail designs',
  'cute nail art ideas',
  'nail art inspiration',
  'press on nails design',
  'gel nails aesthetic',
  'nail art aesthetic pinterest',
  'acrylic nail art trendy',
];

function pickQuery(): string {
  return TRENDING_QUERIES[Math.floor(Math.random() * TRENDING_QUERIES.length)];
}

export default function Home() {
  const toast = useToast();
  const [trendingImages, setTrendingImages] = useState<TrendingImage[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [trendingError, setTrendingError] = useState(false);

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalImage, setSaveModalImage] = useState<{
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
    description?: string;
  } | null>(null);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch trending images on mount — cache in sessionStorage
  useEffect(() => {
    const CACHE_KEY = 'nailstudio_trending';
    const CACHE_TTL = 30 * 60 * 1000; // 30 min

    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { images, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL && images?.length > 0) {
          setTrendingImages(images);
          setLoadingTrending(false);
          return;
        }
      }
    } catch {}

    const query = pickQuery();
    fetch(`/api/search?q=${encodeURIComponent(query)}&count=12`)
      .then((r) => r.json())
      .then((data) => {
        if (data.results?.length > 0) {
          const images = data.results.slice(0, 12).map((r: any) => ({
            ...r,
            saved: false,
          }));
          setTrendingImages(images);
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ images, ts: Date.now() }));
          } catch {}
        } else {
          setTrendingError(true);
        }
      })
      .catch(() => setTrendingError(true))
      .finally(() => setLoadingTrending(false));
  }, []);

  const handleSaveToCollection = (imageData: {
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
    description?: string;
  }) => {
    setSaveModalImage(imageData);
    setSaveModalOpen(true);
  };

  const handleLightboxSave = (img: LightboxImage) => {
    setLightboxOpen(false);
    handleSaveToCollection({
      imageUrl: img.imageUrl,
      sourceUrl: img.sourceUrl,
      source: img.source,
      title: img.title,
      description: img.description,
    });
  };

  const lightboxImages: LightboxImage[] = trendingImages.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    title: img.title,
    source: img.source,
    sourceUrl: img.sourceUrl,
    description: img.description,
  }));

  return (
    <div className="pb-20 sm:pb-0" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fdf2f8, white 40%)' }}>
      <Navbar />

      {/* Hero — compact, search-first */}
      <div style={{ padding: '2rem 1rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💅✨</div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.75rem)', fontWeight: 700, color: '#111827', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Find Your Next{' '}
            <span style={{ color: '#ec4899' }}>Nail Look</span>
          </h1>
          <p style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', color: '#6b7280', marginBottom: '1.5rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Search thousands of designs, save your faves, and get inspired
          </p>

          <SearchBar size="hero" />
        </div>
      </div>

      {/* Trending Section */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', fontWeight: 700, color: '#111827' }}>
            Trending Now 🔥
          </h2>
          <Link href="/search" style={{ fontSize: '0.875rem', fontWeight: 500, color: '#db2777', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {loadingTrending ? (
          <MasonryGrid>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse" style={{ minHeight: `${200 + (i % 3) * 80}px`, background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }}>
                <div className="w-full h-full" style={{ minHeight: `${180 + (i % 3) * 80}px`, background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' }} />
                <div className="px-3 pt-2.5 pb-3">
                  <div className="h-3 bg-pink-100 rounded w-3/4 mb-2" />
                  <div className="h-2.5 bg-pink-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </MasonryGrid>
        ) : trendingError || trendingImages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-3">Couldn&apos;t load trending images right now</p>
            <Link href="/search" className="btn-primary text-sm">Search for nail art →</Link>
          </div>
        ) : (
          <MasonryGrid>
            {trendingImages.map((image, idx) => (
              <ImageCard
                key={image.id}
                {...image}
                onSaveToCollection={handleSaveToCollection}
                onImageClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
              />
            ))}
          </MasonryGrid>
        )}
      </div>

      {/* CTA Section */}
      <div style={{ padding: '0 1rem 6rem' }}>
        <div style={{
          maxWidth: '42rem',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #ec4899, #f472b6)',
          borderRadius: '1.25rem',
          padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.25rem, 4vw, 2.5rem)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 'clamp(1.125rem, 3vw, 1.5rem)', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
            Ready to create your dream nails? 💖
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(0.8125rem, 2vw, 1rem)', marginBottom: '1.25rem', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Start building your personal collection of nail art inspiration
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
            <Link
              href="/collections"
              style={{
                backgroundColor: 'white', color: '#db2777', fontWeight: 600,
                padding: '0.75rem 2rem', borderRadius: '9999px', border: 'none',
                cursor: 'pointer', fontSize: '0.9375rem', minHeight: '48px',
                width: 'fit-content', textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              }}
            >
              Start Collecting
            </Link>
            <Link
              href="/ideas"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600,
                padding: '0.75rem 2rem', borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer',
                fontSize: '0.9375rem', minHeight: '48px', width: 'fit-content',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              }}
            >
              Browse Ideas
            </Link>
          </div>
        </div>
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
