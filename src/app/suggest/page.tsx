'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';
import { useToast } from '@/contexts/ToastContext';

interface SuggestionResult {
  id: string;
  imageUrl: string;
  title: string;
  source: string;
  sourceUrl: string;
}

export default function SuggestPage() {
  const toast = useToast();
  const [preferences, setPreferences] = useState({
    occasion: '',
    style: '',
    colors: [] as string[],
    length: '',
    maintenance: '',
  });
  const [suggestions, setSuggestions] = useState<SuggestionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalImage, setSaveModalImage] = useState<{
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
  } | null>(null);

  const occasions = ['Everyday', 'Work/Professional', 'Wedding', 'Party', 'Date Night', 'Vacation'];
  const styles = ['Classic', 'Modern', 'Artistic', 'Minimalist', 'Bold', 'Cute'];
  const colorOptions = ['Pink', 'Red', 'Blue', 'Purple', 'Green', 'Yellow', 'Orange', 'Black', 'White', 'Nude', 'Metallic'];
  const lengths = ['Short', 'Medium', 'Long'];
  const maintenanceLevels = ['Low (easy to maintain)', 'Medium (some upkeep)', 'High (frequent touch-ups)'];

  const handleColorToggle = (color: string) => {
    setPreferences((prev) => ({
      ...prev,
      colors: prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color],
    }));
  };

  const buildQuery = () => {
    const parts: string[] = [];
    if (preferences.style) parts.push(preferences.style);
    if (preferences.colors.length > 0) parts.push(preferences.colors.join(' '));
    if (preferences.occasion) parts.push(preferences.occasion);
    if (preferences.length) parts.push(preferences.length + ' nails');
    // always add "nail art" at the end for relevance
    return parts.length > 0 ? parts.join(' ') + ' nail art' : 'trendy nail art';
  };

  const getSuggestions = async () => {
    setLoading(true);
    setError(null);

    const query = buildQuery();

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&count=12`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Search failed' }));
        throw new Error(data.error || 'Search failed');
      }

      const data = await response.json();
      const results: SuggestionResult[] = (data.results || []).map((r: any) => ({
        id: r.id,
        imageUrl: r.imageUrl,
        title: r.title,
        source: r.source,
        sourceUrl: r.sourceUrl,
      }));

      setSuggestions(results);

      if (results.length === 0) {
        toast.info('No results found — try different preferences');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to get suggestions';
      setError(msg);
      toast.error(msg);
    }

    setLoading(false);
  };

  const handleSaveClick = (s: SuggestionResult) => {
    setSaveModalImage({
      imageUrl: s.imageUrl,
      sourceUrl: s.sourceUrl,
      source: s.source,
      title: s.title,
    });
    setSaveModalOpen(true);
  };

  const resetPreferences = () => {
    setPreferences({ occasion: '', style: '', colors: [], length: '', maintenance: '' });
    setSuggestions([]);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-0" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help Me Decide 🤔</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Can&apos;t decide on your next nail design? Tell us your preferences and we&apos;ll suggest the perfect nail art for you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preferences Form */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tell us about yourself</h2>

            {/* Occasion */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">What&apos;s the occasion?</label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => setPreferences((prev) => ({ ...prev, occasion }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      preferences.occasion === occasion
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {occasion}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">What&apos;s your style?</label>
              <div className="grid grid-cols-3 gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setPreferences((prev) => ({ ...prev, style }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      preferences.style === style
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Favorite colors? (select multiple)</label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      preferences.colors.includes(color)
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Length */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Preferred nail length?</label>
              <div className="grid grid-cols-3 gap-2">
                {lengths.map((length) => (
                  <button
                    key={length}
                    onClick={() => setPreferences((prev) => ({ ...prev, length }))}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      preferences.length === length
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>

            {/* Maintenance */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">How much maintenance are you okay with?</label>
              <div className="space-y-2">
                {maintenanceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setPreferences((prev) => ({ ...prev, maintenance: level }))}
                    className={`w-full p-3 rounded-lg border text-sm font-medium transition-colors text-left ${
                      preferences.maintenance === level
                        ? 'bg-pink-500 text-white border-pink-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={getSuggestions}
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Finding perfect matches...
                  </div>
                ) : (
                  'Get My Suggestions ✨'
                )}
              </button>
              <button onClick={resetPreferences} className="btn-secondary">
                Reset
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            {error && (
              <div className="card p-6 mb-4 bg-red-50 border-red-200">
                <p className="text-red-600 text-sm">{error}</p>
                <button onClick={getSuggestions} className="btn-primary text-sm mt-3 py-2 px-4">
                  Try Again
                </button>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Perfect matches for you! 💅</h2>

                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex space-x-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={suggestion.imageUrl}
                          alt={suggestion.title}
                          className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{suggestion.title}</h3>
                          <p className="text-gray-500 text-xs mb-2">{suggestion.source}</p>
                          <button
                            onClick={() => handleSaveClick(suggestion)}
                            className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                          >
                            Save this idea →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {suggestions.length === 0 && !loading && !error && (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready when you are!</h3>
                <p className="text-gray-600">Fill out your preferences on the left and we&apos;ll find the perfect nail designs for you.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save to Collection Modal */}
      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => {
          setSaveModalOpen(false);
          setSaveModalImage(null);
        }}
        imageData={saveModalImage}
        onSaved={(name) => {
          toast.success(`Saved to ${name} ✨`);
        }}
      />
    </div>
  );
}
