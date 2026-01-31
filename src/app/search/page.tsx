'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';
import {
  getCollection,
  saveImageToCollection,
  getImagesForCollection,
} from '@/lib/storage';

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
  const addToId = searchParams.get('addTo') || '';

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

  // addTo mode state
  const [addToName, setAddToName] = useState<string | null>(null);
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  // Resolve collection name and pre-populate saved URLs for addTo mode
  useEffect(() => {
    if (addToId) {
      const col = getCollection(addToId);
      if (col) {
        setAddToName(col.name);
        const existing = getImagesForCollection(addToId);
        setSavedUrls(new Set(existing.map((img) => img.imageUrl)));
      } else {
        // Collection not found — clear addTo context
        setAddToName(null);
      }
    } else {
      setAddToName(null);
    }
  }, [addToId]);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
    const params = new URLSearchParams();
    params.set('q', newQuery);
    if (addToId) params.set('addTo', addToId);
    router.push(`/search?${params.toString()}`);
  };

  // Quick-save directly to the target collection (addTo mode)
  const handleQuickSave = useCallback(
    (imageData: {
      imageUrl: string;
      sourceUrl: string;
      source: string;
      title?: string;
      description?: string;
    }) => {
      if (!addToId) return;
      if (savedUrls.has(imageData.imageUrl)) return; // already saved

      saveImageToCollection(imageData, addToId);
      setSavedUrls((prev) => new Set(prev).add(imageData.imageUrl));
      setToast(`Saved to ${addToName} ✨`);
    },
    [addToId, addToName, savedUrls]
  );

  // Normal modal flow (no addTo, or user clicks "Change")
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

  // Determine which handler to pass to ImageCard
  const isAddToMode = !!(addToId && addToName);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-20 sm:pb-0"
      style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)',
      }}
    >
      <Navbar />

      {/* Sticky context banner for addTo mode */}
      {isAddToMode && (
        <div className="sticky top-0 z-40 bg-pink-50 border-b-2 border-pink-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-lg flex-shrink-0">📌</span>
              <span className="text-sm font-medium text-gray-700 truncate">
                Adding to: <span className="text-pink-700 font-bold">{addToName}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
              <button
                onClick={() => {
                  // "Change" — open the modal for the next tap instead
                  // Remove addTo param so the page falls back to modal flow
                  const params = new URLSearchParams();
                  if (query) params.set('q', query);
                  router.replace(`/search?${params.toString()}`);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
              >
                Change
              </button>
              <button
                onClick={() => router.push(`/collections/${addToId}`)}
                className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap"
              >
                Done →
              </button>
            </div>
          </div>
        </div>
      )}

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
                  saved={isAddToMode ? savedUrls.has(result.imageUrl) : result.saved}
                  onSaveToCollection={
                    isAddToMode ? handleQuickSave : handleSaveToCollection
                  }
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
              Enter keywords like &quot;French tips&quot;, &quot;ombre&quot;, or &quot;floral&quot; to discover amazing designs
            </p>
          </div>
        )}
      </div>

      {/* Save to Collection Modal (normal flow / fallback) */}
      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => {
          setSaveModalOpen(false);
          setSaveModalImage(null);
        }}
        imageData={saveModalImage}
        onSaved={(name) => {
          setToast(`Saved to ${name} ✨`);
        }}
      />

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}