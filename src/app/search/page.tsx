'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';

interface SearchResult {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  source: string;
  sourceUrl: string;
  saved: boolean;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalImage, setSaveModalImage] = useState<{
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
    description?: string;
  } | null>(null);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&count=30`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Failed to search for images. Please try again.');
      console.error('Search error:', err);
    }
    
    setLoading(false);
  };

  const handleNewSearch = (newQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}`);
  };

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

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-20 sm:pb-0"
         style={{ 
           background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' 
         }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {query ? `Search Results for "${query}"` : 'Search Nail Art'}
          </h1>
          
          <SearchBar 
            initialValue={query}
            onSearch={handleNewSearch}
            className="max-w-2xl"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for beautiful nail art...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => performSearch(query)}
              className="mt-4 btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && results.length > 0 && (
          <div>
            <div className="mb-6">
              <p className="text-gray-600">
                Found {results.length} results
              </p>
            </div>

            <MasonryGrid>
              {results.map((result) => (
                <ImageCard
                  key={result.id}
                  {...result}
                  onSaveToCollection={handleSaveToCollection}
                />
              ))}
            </MasonryGrid>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              Try searching with different keywords or browse our trending designs
            </p>
            <button 
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Browse Trending
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Search for nail art inspiration
            </h3>
            <p className="text-gray-600">
              Enter keywords like "French tips", "ombre", or "floral" to discover amazing designs
            </p>
          </div>
        )}
      </div>

      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => { setSaveModalOpen(false); setSaveModalImage(null); }}
        imageData={saveModalImage}
        onSaved={(name) => {
          // Could show a toast or update UI
        }}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
    </div>}>
      <SearchContent />
    </Suspense>
  );
}