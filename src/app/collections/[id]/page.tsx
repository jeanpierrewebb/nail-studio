'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MasonryGrid from '@/components/MasonryGrid';
import ImageCard from '@/components/ImageCard';
import ImageLightbox, { type LightboxImage } from '@/components/ImageLightbox';
import SaveToCollectionModal from '@/components/SaveToCollectionModal';
import { useToast } from '@/contexts/ToastContext';
import {
  getCollectionWithImages,
  updateCollection,
  deleteCollection,
  removeImageFromCollection,
  saveImageToCollection,
  enableSharing,
  disableSharing,
  type StoredImage,
} from '@/lib/storage';

interface CollectionData {
  id: string;
  name: string;
  description: string | null;
  shareId: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  inspirationImages: StoredImage[];
  _count: { inspirationImages: number };
}

export default function CollectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Save modal (from lightbox)
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalImage, setSaveModalImage] = useState<{
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
    description?: string;
  } | null>(null);

  const fetchCollection = () => {
    const data = getCollectionWithImages(id);
    if (!data) {
      setError('Collection not found');
    } else {
      setCollection(data as CollectionData);
      setEditName(data.name);
      setEditDescription(data.description || '');
    }
    setLoading(false);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated = updateCollection(id, {
      name: editName.trim(),
      description: editDescription.trim() || null,
    });

    if (updated) {
      setCollection(prev => prev ? { ...prev, name: updated.name, description: updated.description } : prev);
      setEditing(false);
      toast.success('Collection updated');
    }
  };

  const handleDelete = () => {
    if (!confirm('Delete this collection? Images will not be deleted, just unlinked.')) return;
    deleteCollection(id);
    toast.info('Collection deleted');
    router.push('/collections');
  };

  const handleShare = async () => {
    // If already public, just copy the link
    if (collection?.isPublic && collection.shareId) {
      const shareUrl = `${window.location.origin}/shared/${collection.shareId}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard! 📋');
      } catch {
        // Fallback for browsers that don't support clipboard API
        toast.info(`Share link: ${shareUrl}`);
      }
      return;
    }

    // Enable sharing and generate shareId
    const updated = enableSharing(id);
    if (updated) {
      setCollection(prev => prev ? { ...prev, shareId: updated.shareId, isPublic: updated.isPublic } : prev);
      const shareUrl = `${window.location.origin}/shared/${updated.shareId}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Sharing enabled! Link copied to clipboard 🔗');
      } catch {
        toast.info(`Share link: ${shareUrl}`);
      }
    }
  };

  const handleDisableSharing = () => {
    const updated = disableSharing(id);
    if (updated) {
      setCollection(prev => prev ? { ...prev, isPublic: false } : prev);
      toast.info('Sharing disabled');
    }
  };

  const handleAddByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setAddingUrl(true);

    try {
      let sourceDomain = 'Web';
      try {
        const url = new URL(newImageUrl);
        sourceDomain = url.hostname.replace('www.', '').split('.')[0];
        sourceDomain = sourceDomain.charAt(0).toUpperCase() + sourceDomain.slice(1);
      } catch {}

      saveImageToCollection(
        { imageUrl: newImageUrl.trim(), sourceUrl: newImageUrl.trim(), source: sourceDomain, title: newImageTitle.trim() || undefined },
        id,
      );

      const data = getCollectionWithImages(id);
      if (data) setCollection(data as CollectionData);

      setNewImageUrl('');
      setNewImageTitle('');
      setShowAddUrl(false);
      toast.success('Image added!');
    } catch (err) {
      console.error('Error adding image:', err);
      toast.error('Failed to add image');
    }
    setAddingUrl(false);
  };

  const handleRemoveImage = (imageId: string) => {
    removeImageFromCollection(imageId, id);
    setCollection(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        inspirationImages: prev.inspirationImages.filter(img => img.id !== imageId),
        _count: { inspirationImages: prev._count.inspirationImages - 1 },
      };
    });
    toast.info('Removed from collection');
  };

  const handleLightboxSave = (img: LightboxImage) => {
    setLightboxOpen(false);
    setSaveModalImage({ imageUrl: img.imageUrl, sourceUrl: img.sourceUrl, source: img.source, title: img.title, description: img.description });
    setSaveModalOpen(true);
  };

  useEffect(() => {
    fetchCollection();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="min-h-screen pb-20 sm:pb-0" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen pb-20 sm:pb-0" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || 'Collection not found'}</h2>
          <button onClick={() => router.push('/collections')} className="btn-primary mt-4">Back to Collections</button>
        </div>
      </div>
    );
  }

  const lightboxImages: LightboxImage[] = collection.inspirationImages.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    title: img.title || undefined,
    source: img.source,
    sourceUrl: img.sourceUrl,
    description: img.description || undefined,
    notes: img.notes,
  }));

  return (
    <div className="min-h-screen pb-20 sm:pb-0" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, white 100%)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button onClick={() => router.push('/collections')} className="flex items-center text-gray-400 hover:text-gray-600 mb-4 transition-colors text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Collections
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          {editing ? (
            <form onSubmit={handleUpdate} className="flex-1 max-w-lg">
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field text-2xl font-bold mb-2" required />
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="input-field resize-none mb-3" rows={2} placeholder="Description (optional)" />
              <div className="flex space-x-2">
                <button type="submit" className="btn-primary text-sm">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{collection.name}</h1>
              {collection.description && <p className="text-gray-600 mb-2">{collection.description}</p>}
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="text-pink-600 font-medium">
                  {collection._count.inspirationImages} {collection._count.inspirationImages === 1 ? 'item' : 'items'}
                </span>
                <span>·</span>
                <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
                {collection.updatedAt !== collection.createdAt && (
                  <>
                    <span>·</span>
                    <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {!editing && (
            <div className="flex items-center space-x-2 ml-4">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className={`p-2 rounded-lg transition-colors ${
                  collection.isPublic
                    ? 'text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={collection.isPublic ? 'Sharing enabled - click to copy link' : 'Share collection'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              {/* Disable sharing button (shown when public) */}
              {collection.isPublic && (
                <button
                  onClick={handleDisableSharing}
                  className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                  title="Disable sharing"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              )}
              <button onClick={() => setEditing(true)} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors" title="Edit collection">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={handleDelete} className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Delete collection">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Add Images Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button onClick={() => router.push(`/search?addTo=${id}`)} className="inline-flex items-center text-xs font-semibold py-2 px-3.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 transition-colors">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search & Add
          </button>
          <button onClick={() => setShowAddUrl(!showAddUrl)} className="inline-flex items-center text-xs font-semibold py-2 px-3.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Paste URL
          </button>
        </div>

        {/* Add by URL form */}
        {showAddUrl && (
          <div className="mb-6 p-4 bg-white rounded-xl border-2 border-pink-200 animate-slide-up">
            <form onSubmit={handleAddByUrl} className="space-y-3">
              <input type="url" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Paste image URL (from Pinterest, Instagram, anywhere)..." className="input-field text-sm" autoFocus required />
              <input type="text" value={newImageTitle} onChange={(e) => setNewImageTitle(e.target.value)} placeholder="Title or note (optional)" className="input-field text-sm" />
              <div className="flex items-center space-x-2">
                <button type="submit" disabled={addingUrl || !newImageUrl.trim()} className="btn-primary text-sm py-2 px-4">
                  {addingUrl ? 'Adding...' : 'Add to Collection'}
                </button>
                <button type="button" onClick={() => { setShowAddUrl(false); setNewImageUrl(''); setNewImageTitle(''); }} className="btn-secondary text-sm py-2 px-4">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Images */}
        {collection.inspirationImages.length > 0 ? (
          <MasonryGrid>
            {collection.inspirationImages.map((image, idx) => (
              <div key={image.id} className="group/item">
                <ImageCard
                  id={image.id}
                  imageUrl={image.imageUrl}
                  title={image.title || undefined}
                  description={image.description || undefined}
                  source={image.source}
                  sourceUrl={image.sourceUrl}
                  saved={true}
                  notes={image.notes}
                  onImageClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                />
                {/* Remove — subtle text link below card */}
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="w-full mt-1.5 py-1 text-[11px] text-gray-300 hover:text-red-500 active:text-red-500 transition-colors text-center"
                  title="Remove from collection"
                >
                  Remove
                </button>
              </div>
            ))}
          </MasonryGrid>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📌</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-500 text-sm">Search for nail art or paste an image URL to start filling this collection</p>
          </div>
        )}
      </div>

      <SaveToCollectionModal
        isOpen={saveModalOpen}
        onClose={() => { setSaveModalOpen(false); setSaveModalImage(null); }}
        imageData={saveModalImage}
        onSaved={(name) => toast.success(`Saved to ${name} ✨`)}
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
