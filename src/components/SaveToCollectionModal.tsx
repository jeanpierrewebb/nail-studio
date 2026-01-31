'use client';

import { useState, useEffect } from 'react';
import {
  getCollectionsWithCounts,
  createCollection,
  saveImageToCollection,
  getSavedImages,
} from '@/lib/storage';

interface CollectionItem {
  id: string;
  name: string;
  _count: { inspirationImages: number };
}

interface SaveToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: {
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
    description?: string;
  } | null;
  onSaved?: (collectionName: string) => void;
}

export default function SaveToCollectionModal({
  isOpen,
  onClose,
  imageData,
  onSaved,
}: SaveToCollectionModalProps) {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [savedTo, setSavedTo] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const data = getCollectionsWithCounts();
      setCollections(data);
      setSavedTo(new Set());

      // Check which collections this image is already in
      if (imageData) {
        const images = getSavedImages();
        const existing = images.find(img => img.imageUrl === imageData.imageUrl);
        if (existing) {
          setSavedTo(new Set(existing.collectionIds));
        }
      }
    }
  }, [isOpen, imageData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSaveToCollection = (collectionId: string, collectionName: string) => {
    if (!imageData) return;

    saveImageToCollection(imageData, collectionId);
    setSavedTo(prev => new Set(prev).add(collectionId));
    setToast(`Saved to ${collectionName} ✨`);
    onSaved?.(collectionName);

    // Update collection counts
    const data = getCollectionsWithCounts();
    setCollections(data);
  };

  const handleCreateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !imageData) return;

    const newCollection = createCollection(newName.trim());
    saveImageToCollection(imageData, newCollection.id);

    setSavedTo(prev => new Set(prev).add(newCollection.id));
    setToast(`Saved to ${newName.trim()} ✨`);
    onSaved?.(newName.trim());

    // Refresh list
    const data = getCollectionsWithCounts();
    setCollections(data);
    setNewName('');
    setShowCreate(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[70vh] flex flex-col animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Save to Collection</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Create new collection */}
          <div className="p-3 border-b border-gray-100">
            {showCreate ? (
              <form onSubmit={handleCreateAndSave} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Collection name..."
                  className="flex-1 input-field text-sm py-2"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
                >
                  Create & Save
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setNewName(''); }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-pink-50 transition-colors text-pink-600 font-medium"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span>New Collection</span>
              </button>
            )}
          </div>

          {/* Collection list */}
          <div className="flex-1 overflow-y-auto p-3">
            {collections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-3xl mb-2">📁</div>
                <p className="text-sm">No collections yet — create one above!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {collections.map((collection) => {
                  const isSaved = savedTo.has(collection.id);

                  return (
                    <button
                      key={collection.id}
                      onClick={() => !isSaved && handleSaveToCollection(collection.id, collection.name)}
                      disabled={isSaved}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isSaved
                          ? 'bg-pink-50 text-pink-700'
                          : 'hover:bg-gray-50 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                          isSaved ? 'bg-pink-200' : 'bg-gray-100'
                        }`}>
                          {isSaved ? '✓' : '📁'}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{collection.name}</div>
                          <div className="text-xs text-gray-500">
                            {collection._count.inspirationImages} {collection._count.inspirationImages === 1 ? 'item' : 'items'}
                          </div>
                        </div>
                      </div>

                      {isSaved && (
                        <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
}
