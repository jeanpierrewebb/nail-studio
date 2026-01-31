'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';

const trendingImages = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1754799670410-b282791342c3?w=400&h=600&fit=crop',
    title: 'Heart Design Nails',
    description: 'White and pink heart-designed nails — so cute!',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com',
    saved: false,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1727199433231-346fd8101839?w=400&h=500&fit=crop',
    title: 'Pretty Pink Manicure',
    description: 'Beautiful pink manicure for every occasion',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com',
    saved: false,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=400&h=550&fit=crop',
    title: 'Classic Manicure',
    description: 'Clean and elegant nail art design',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com',
    saved: false,
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1586973762963-9c610b87803d?w=400&h=450&fit=crop',
    title: 'Red & Gold Glam',
    description: 'Stunning red and gold manicure for special occasions',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com',
    saved: false,
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1743617206507-447c78118622?w=400&h=600&fit=crop',
    title: 'Purple Dreams',
    description: 'Bold purple painted nails to stand out',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com',
    saved: false,
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=400&h=500&fit=crop',
    title: 'Pink Perfection',
    description: 'Soft pink nails on a dreamy surface',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com',
    saved: false,
  },
];

export default function Home() {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalImage, setSaveModalImage] = useState<{
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
    description?: string;
  } | null>(null);

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
          <Link
            href="/search"
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#db2777',
              textDecoration: 'none',
            }}
          >
            View All →
          </Link>
        </div>

        <MasonryGrid>
          {trendingImages.map((image) => (
            <ImageCard
              key={image.id}
              {...image}
              onSaveToCollection={handleSaveToCollection}
            />
          ))}
        </MasonryGrid>
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
                backgroundColor: 'white',
                color: '#db2777',
                fontWeight: 600,
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                minHeight: '48px',
                width: 'fit-content',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Start Collecting
            </Link>
            <Link
              href="/ideas"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 600,
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                fontSize: '0.9375rem',
                minHeight: '48px',
                width: 'fit-content',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Browse Ideas
            </Link>
          </div>
        </div>
      </div>

      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => { setSaveModalOpen(false); setSaveModalImage(null); }}
        imageData={saveModalImage}
      />
    </div>
  );
}
