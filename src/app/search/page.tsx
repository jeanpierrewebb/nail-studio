'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';
import ImageLightbox, { type LightboxImage } from '@/components/ImageLightbox';
import { useToast } from '@/contexts/ToastContext';
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
  const globalToast = useToast();
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

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // addTo mode state
  const [addToName, setAddToName] = useState<string | null>(null);
  const [savedUrls, setSavedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (addToId) {
      const col = getCollection(addToId);
      if (col) {
        setAddToName(col.name);
        const existing = getImagesForCollection(addToId);
        setSavedUrls(new Set(existing.map((img) => img.imageUrl)));
      } else {
        setAddToName(null);
      }
    } else {
      setAddToName(null);
    }
  }, [addToId]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&count=30`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Search failed' }));
        const msg = data.error || 'Search failed';
        setError(msg);
        if (data.errorCode === 'RATE_LIMIT') {
          globalToast.error('Too many searches — wait a sec and try again 🙏');
        } else if (data.errorCode === 'AUTH_FAILED') {
          globalToast.error('Search API key issue — let the admin know');
        } else {
          globalToast.error(msg);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      const msg = 'Network error — check your connection and try again';
      setError(msg);
      globalToast.error(msg);
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

  const handleQuickSave = useCallback(
    (imageData: { imageUrl: string; sourceUrl: string; source: string; title?: string; description?: string }) => {
      if (!addToId) return;
      if (savedUrls.has(imageData.imageUrl)) return;
      saveImageToCollection(imageData, addToId);
      setSavedUrls((prev) => new Set(prev).add(imageData.imageUrl));
      globalToast.success(`Saved to ${addToName} ✨`);
    },
    [addToId, addToName, savedUrls, globalToast],
  );

  const handleSaveToCollection = (imageData: { imageUrl: string; sourceUrl: string; source: string; title?: string; description?: string }) => {
    setSaveModalImage(imageData);
    setSaveModalOpen(true);
  };

  const handleLightboxSave = (img: LightboxImage) => {
    if (isAddToMode) {
      handleQuickSave({ imageUrl: img.imageUrl, sourceUrl: img.sourceUrl, source: img.source, title: img.title, description: img.description });
    } else {
      handleSaveToCollection({ imageUrl: img.imageUrl, sourceUrl: img.sourceUrl, source: img.source, title: img.title, description: img.description });
    }
  };

  useEffect(() => {
    if (query) performSearch(query);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAddToMode = !!(addToId && addToName);

  const lightboxImages: LightboxImage[] = results.map((r) => ({
    id: r.id,
    imageUrl: r.imageUrl,
    title: r.title,
    source: r.source,
    sourceUrl: r.sourceUrl,
    description: r.description,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-20 sm:pb-0" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
      <Navbar />

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
                  const params = new URLSearchParams();
                  if (query) params.set('q', query);
                  router.replace(`/search?${params.toString()}`);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
              >
                Change
              </button>
              <button onClick={() => router.push(`/collections/${addToId}`)} className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap">
                Done →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {query ? `Search Results for "${query}"` : 'Search Nail Art'}
          </h1>
          <SearchBar initialValue={query} onSearch={handleNewSearch} className="max-w-2xl" />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for beautiful nail art...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button onClick={() => performSearch(query)} className="mt-4 btn-primary">Try Again</button>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div>
            <div className="mb-6">
              <p className="text-gray-600">Found {results.length} results</p>
            </div>
            <MasonryGrid>
              {results.map((result, idx) => (
                <ImageCard
                  key={result.id}
                  {...result}
                  saved={isAddToMode ? savedUrls.has(result.imageUrl) : result.saved}
                  onSaveToCollection={isAddToMode ? handleQuickSave : handleSaveToCollection}
                  onImageClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                />
              ))}
            </MasonryGrid>
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try searching with different keywords or browse our trending designs</p>
            <button onClick={() => router.push('/')} className="btn-primary">Browse Trending</button>
          </div>
        )}

        {!loading && !error && !query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for nail art inspiration</h3>
            <p className="text-gray-600">Enter keywords like &quot;French tips&quot;, &quot;ombre&quot;, or &quot;floral&quot; to discover amazing designs</p>
          </div>
        )}
      </div>

      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => { setSaveModalOpen(false); setSaveModalImage(null); }}
        imageData={saveModalImage}
        onSaved={(name) => globalToast.success(`Saved to ${name} ✨`)}
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
