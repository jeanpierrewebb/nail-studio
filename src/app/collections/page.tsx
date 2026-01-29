'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Collection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  inspirationImages: Array<{
    id: string;
    imageUrl: string;
  }>;
  _count: {
    inspirationImages: number;
  };
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      const data = await response.json();
      setCollections(data.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
    setLoading(false);
  };

  const createCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCollectionName,
          description: newCollectionDescription,
        }),
      });

      if (response.ok) {
        const newCollection = await response.json();
        setCollections(prev => [newCollection, ...prev]);
        setNewCollectionName('');
        setNewCollectionDescription('');
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" 
         style={{ 
           background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' 
         }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Collections</h1>
            <p className="text-gray-600">Organize your favorite nail art designs</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Collection
          </button>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <div className="card hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  {/* Cover Image */}
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 relative overflow-hidden">
                    {collection.inspirationImages.length > 0 ? (
                      <div className="grid grid-cols-2 h-full">
                        {collection.inspirationImages.slice(0, 4).map((image, index) => (
                          <div key={image.id} className="relative">
                            <img
                              src={image.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-pink-400 text-4xl">📁</div>
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <p className="text-pink-600 text-sm font-medium">
                      {collection._count.inspirationImages} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No collections yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first collection to start organizing your nail art inspiration
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Collection
            </button>
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Collection</h2>
            
            <form onSubmit={createCollection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Summer Vibes, Wedding Nails"
                  className="input-field"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Describe this collection..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewCollectionName('');
                    setNewCollectionDescription('');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}