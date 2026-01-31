'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  inspirationImages: Array<{
    id: string;
    imageUrl: string;
    title: string;
  }>;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDescription, setNewIdeaDescription] = useState('');
  const [newIdeaTags, setNewIdeaTags] = useState('');

  const fetchIdeas = async () => {
    try {
      const response = await fetch('/api/ideas');
      const data = await response.json();
      setIdeas(data.ideas || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
    setLoading(false);
  };

  const createIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;

    try {
      const tags = newIdeaTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newIdeaTitle,
          description: newIdeaDescription,
          tags: JSON.stringify(tags),
        }),
      });

      if (response.ok) {
        const newIdea = await response.json();
        setIdeas(prev => [newIdea, ...prev]);
        setNewIdeaTitle('');
        setNewIdeaDescription('');
        setNewIdeaTags('');
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating idea:', error);
    }
  };

  const parseTags = (tagsString: string) => {
    try {
      const parsed = JSON.parse(tagsString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

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
    <div className="min-h-screen pb-20 sm:pb-0" 
         style={{ 
           background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' 
         }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Ideas</h1>
            <p className="text-gray-600">Save and organize your nail art inspirations</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Idea
          </button>
        </div>

        {/* Ideas Grid */}
        {ideas.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="card hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {idea.title}
                    </h3>
                    {idea.description && (
                      <p className="text-gray-600 mb-3">
                        {idea.description}
                      </p>
                    )}
                    
                    {/* Tags */}
                    {parseTags(idea.tags).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {parseTags(idea.tags).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Images Preview */}
                  {idea.inspirationImages.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-4 gap-2">
                        {idea.inspirationImages.slice(0, 4).map((image) => (
                          <div key={image.id} className="aspect-square relative overflow-hidden rounded-lg">
                            <img
                              src={image.imageUrl}
                              alt={image.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {idea.inspirationImages.length > 4 && (
                        <p className="text-sm text-gray-500 mt-2">
                          +{idea.inspirationImages.length - 4} more images
                        </p>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Created {new Date(idea.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      {idea.inspirationImages.length} images
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No ideas yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first idea to start collecting nail art inspiration
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Idea
            </button>
          </div>
        )}
      </div>

      {/* Create Idea Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Idea</h2>
            
            <form onSubmit={createIdea}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idea Title
                </label>
                <input
                  type="text"
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  placeholder="e.g., French tips with florals"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newIdeaDescription}
                  onChange={(e) => setNewIdeaDescription(e.target.value)}
                  placeholder="Describe your idea..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  value={newIdeaTags}
                  onChange={(e) => setNewIdeaTags(e.target.value)}
                  placeholder="french tips, floral, spring (comma-separated)"
                  className="input-field"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate tags with commas
                </p>
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewIdeaTitle('');
                    setNewIdeaDescription('');
                    setNewIdeaTags('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}