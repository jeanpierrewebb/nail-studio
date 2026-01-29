'use client';

import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';

const trendingImages = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=600&fit=crop',
    title: 'French Tip Elegance',
    description: 'Classic French tips with a modern twist',
    source: 'Pinterest',
    sourceUrl: 'https://pinterest.com',
    saved: false,
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop',
    title: 'Ombre Dreams',
    description: 'Beautiful pink to white ombre gradient',
    source: 'Instagram',
    sourceUrl: 'https://instagram.com',
    saved: true,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1583847998741-a5a2b8b6aa9f?w=400&h=550&fit=crop',
    title: 'Floral Fantasy',
    description: 'Delicate floral patterns perfect for spring',
    source: 'TikTok',
    sourceUrl: 'https://tiktok.com',
    saved: false,
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=450&fit=crop',
    title: 'Geometric Glam',
    description: 'Bold geometric patterns with metallic accents',
    source: 'Pinterest',
    sourceUrl: 'https://pinterest.com',
    saved: false,
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400&h=600&fit=crop',
    title: 'Glitter Galaxy',
    description: 'Sparkly galaxy-inspired nail art',
    source: 'Reddit',
    sourceUrl: 'https://reddit.com',
    saved: true,
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1574169208507-843761746b59?w=400&h=500&fit=crop',
    title: 'Pastel Paradise',
    description: 'Soft pastel colors for a dreamy look',
    source: 'Instagram',
    sourceUrl: 'https://instagram.com',
    saved: false,
  },
];

export default function Home() {
  const handleSave = async (id: string) => {
    console.log('Saving image:', id);
  };

  const handleUnsave = async (id: string) => {
    console.log('Unsaving image:', id);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #fdf2f8, white 40%)' }}>
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
          <button style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#db2777',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}>
            View All →
          </button>
        </div>

        <MasonryGrid>
          {trendingImages.map((image) => (
            <ImageCard
              key={image.id}
              {...image}
              onSave={handleSave}
              onUnsave={handleUnsave}
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
            <button style={{
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
            }}>
              Start Collecting
            </button>
            <button style={{
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
            }}>
              Browse Ideas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
