'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useToast } from '@/contexts/ToastContext';
import { getCollectionsWithCounts, createCollection, type StoredCollection } from '@/lib/storage';

interface CollectionWithImages extends StoredCollection {
  inspirationImages: Array<{ id: string; imageUrl: string }>;
  _count: { inspirationImages: number };
}

export default function CollectionsPage() {
  const toast = useToast();
  const [collections, setCollections] = useState<CollectionWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');

  const fetchCollections = () => {
    const data = getCollectionsWithCounts();
    setCollections(data as CollectionWithImages[]);
    setLoading(false);
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const newCollection = createCollection(newCollectionName, newCollectionDescription);
    setCollections(prev => [{
      ...newCollection,
      inspirationImages: [],
      _count: { inspirationImages: 0 },
    }, ...prev]);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setShowCreateModal(false);
    toast.success('Collection created! 📁');
  };

  useEffect(() => {
    fetchCollections();
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
         style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Collections</h1>
            <p className="text-gray-600">Organize your favorite nail art designs</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Collection
          </button>
        </div>

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {collections.map((collection) => {
              const coverImage = collection.inspirationImages[0]?.imageUrl;

              return (
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                  <div className="card hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    {/* Cover Image */}
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-pink-200 relative overflow-hidden">
                      {coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={coverImage}
                          alt={collection.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-pink-400 text-4xl">📁</div>
                        </div>
                      )}

                      {/* Image count badge */}
                      {collection._count.inspirationImages > 0 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                          {collection._count.inspirationImages}
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-gray-900 mb-0.5 line-clamp-1 text-sm sm:text-base">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-1.5 line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                      <p className="text-pink-600 text-xs sm:text-sm font-medium">
                        {collection._count.inspirationImages} {collection._count.inspirationImages === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No collections yet</h3>
            <p className="text-gray-600 mb-6">Create your first collection to start organizing your nail art inspiration</p>
            <button onClick={() => setShowCreateModal(true)} className="btn-primary">Create Collection</button>
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-md p-6 animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Collection</h2>

            <form onSubmit={handleCreateCollection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Collection Name</label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Summer Vibes, Wedding Nails"
                  className="input-field"
                  autoFocus
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
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
                  onClick={() => { setShowCreateModal(false); setNewCollectionName(''); setNewCollectionDescription(''); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">Create Collection</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
