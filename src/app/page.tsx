'use client';

import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';

// Sample data for demonstration
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
    // TODO: Implement save to database
  };

  const handleUnsave = async (id: string) => {
    console.log('Unsaving image:', id);
    // TODO: Implement unsave from database
  };

  return (
    <div className="min-h-screen" 
         style={{ 
           background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' 
         }}>
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Discover Your Perfect{' '}
              <span className="bg-gradient-to-r from-pink-500 to-rose-gold bg-clip-text text-transparent">
                Nail Art
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find inspiration from thousands of nail art designs, save your favorites, 
              and create beautiful collections for your next manicure
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar className="w-full" />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">10K+</div>
                <div className="text-sm text-gray-600">Nail Designs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">500+</div>
                <div className="text-sm text-gray-600">Collections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">1K+</div>
                <div className="text-sm text-gray-600">Artists</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 opacity-20 blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 rounded-full bg-gradient-to-br from-rose-gold to-pink-400 opacity-20 blur-xl"></div>
      </div>

      {/* Trending Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Now</h2>
            <p className="text-gray-600">The hottest nail art designs everyone is loving</p>
          </div>
          <button className="btn-secondary">
            View All Trends
          </button>
        </div>

        {/* Masonry Grid */}
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
      <div className="bg-gradient-to-r from-pink-500 to-rose-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your Dream Nails?
          </h2>
          <p className="text-pink-100 text-lg mb-8 max-w-2xl mx-auto">
            Start building your personal collection of nail art inspiration. 
            Save your favorites and never run out of ideas!
          </p>
          <div className="space-x-4">
            <button className="bg-white text-pink-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              Start Collecting
            </button>
            <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-pink-600 transition-colors duration-200">
              Browse Ideas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}