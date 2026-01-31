'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function SuggestPage() {
  const [preferences, setPreferences] = useState({
    occasion: '',
    style: '',
    colors: [] as string[],
    length: '',
    maintenance: '',
  });
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const occasions = ['Everyday', 'Work/Professional', 'Wedding', 'Party', 'Date Night', 'Vacation'];
  const styles = ['Classic', 'Modern', 'Artistic', 'Minimalist', 'Bold', 'Cute'];
  const colorOptions = ['Pink', 'Red', 'Blue', 'Purple', 'Green', 'Yellow', 'Orange', 'Black', 'White', 'Nude', 'Metallic'];
  const lengths = ['Short', 'Medium', 'Long'];
  const maintenanceLevels = ['Low (easy to maintain)', 'Medium (some upkeep)', 'High (frequent touch-ups)'];

  const handleColorToggle = (color: string) => {
    setPreferences(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const getSuggestions = async () => {
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock suggestions based on preferences
      const mockSuggestions = [
        {
          id: 1,
          title: 'Classic French Tips',
          description: 'Perfect for your professional setting with a timeless appeal',
          imageUrl: 'https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f?w=300&h=400&fit=crop',
          matchScore: 95,
          reasons: ['Professional appearance', 'Low maintenance', 'Timeless style']
        },
        {
          id: 2,
          title: 'Soft Pink Ombre',
          description: 'Elegant gradient that works for any occasion',
          imageUrl: 'https://images.unsplash.com/photo-1727199433231-346fd8101839?w=300&h=400&fit=crop',
          matchScore: 88,
          reasons: ['Versatile for work and play', 'Matches your color preference', 'Medium maintenance']
        },
        {
          id: 3,
          title: 'Red & Gold Glam',
          description: 'Stunning red and gold manicure for special events',
          imageUrl: 'https://images.unsplash.com/photo-1586973762963-9c610b87803d?w=300&h=400&fit=crop',
          matchScore: 82,
          reasons: ['Eye-catching design', 'Perfect for events', 'Suits any outfit']
        }
      ];
      
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 2000);
  };

  const resetPreferences = () => {
    setPreferences({
      occasion: '',
      style: '',
      colors: [],
      length: '',
      maintenance: '',
    });
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-0" 
         style={{ 
           background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' 
         }}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Help Me Decide 🤔
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Can't decide on your next nail design? Tell us your preferences and we'll suggest the perfect nail art for you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preferences Form */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tell us about yourself</h2>
            
            {/* Occasion */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's the occasion?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => setPreferences(prev => ({ ...prev, occasion }))}
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What's your style?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setPreferences(prev => ({ ...prev, style }))}
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Favorite colors? (select multiple)
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred nail length?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {lengths.map((length) => (
                  <button
                    key={length}
                    onClick={() => setPreferences(prev => ({ ...prev, length }))}
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How much maintenance are you okay with?
              </label>
              <div className="space-y-2">
                {maintenanceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setPreferences(prev => ({ ...prev, maintenance: level }))}
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
              <button
                onClick={resetPreferences}
                className="btn-secondary"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            {suggestions.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Perfect matches for you! 💅
                </h2>
                
                <div className="space-y-6">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex space-x-4">
                        <img
                          src={suggestion.imageUrl}
                          alt={suggestion.title}
                          className="w-20 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {suggestion.title}
                            </h3>
                            <div className="flex items-center">
                              <span className="text-pink-600 font-bold text-lg">
                                {suggestion.matchScore}%
                              </span>
                              <span className="text-gray-500 text-sm ml-1">match</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">
                            {suggestion.description}
                          </p>
                          
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Why it's perfect for you:</p>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.reasons.map((reason: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                >
                                  ✓ {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
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
            {suggestions.length === 0 && !loading && (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready when you are!
                </h3>
                <p className="text-gray-600">
                  Fill out your preferences on the left and we'll find the perfect nail designs for you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}