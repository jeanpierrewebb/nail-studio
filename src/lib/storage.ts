// Client-side localStorage wrapper for collections
// This is a temporary solution until we set up Turso (cloud DB)
// Data persists per-browser — works great for single-user/device

export interface StoredCollection {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoredImage {
  id: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
  title: string | null;
  description: string | null;
  savedAt: string;
  collectionIds: string[]; // image can be in multiple collections
}

const COLLECTIONS_KEY = 'nail-studio-collections';
const IMAGES_KEY = 'nail-studio-saved-images';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ---- Collections ----

export function getCollections(): StoredCollection[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(COLLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getCollection(id: string): StoredCollection | null {
  return getCollections().find(c => c.id === id) || null;
}

export function createCollection(name: string, description?: string): StoredCollection {
  const collections = getCollections();
  const now = new Date().toISOString();
  const collection: StoredCollection = {
    id: generateId(),
    name: name.trim(),
    description: description?.trim() || null,
    createdAt: now,
    updatedAt: now,
  };
  collections.unshift(collection);
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  return collection;
}

export function updateCollection(id: string, updates: { name?: string; description?: string | null }): StoredCollection | null {
  const collections = getCollections();
  const index = collections.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  collections[index] = {
    ...collections[index],
    ...(updates.name !== undefined && { name: updates.name.trim() }),
    ...(updates.description !== undefined && { description: updates.description }),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
  return collections[index];
}

export function deleteCollection(id: string): boolean {
  const collections = getCollections();
  const filtered = collections.filter(c => c.id !== id);
  if (filtered.length === collections.length) return false;
  
  localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(filtered));
  
  // Remove collection reference from all images
  const images = getSavedImages();
  const updated = images.map(img => ({
    ...img,
    collectionIds: img.collectionIds.filter(cid => cid !== id),
  }));
  localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
  
  return true;
}

// ---- Saved Images ----

export function getSavedImages(): StoredImage[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(IMAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getImagesForCollection(collectionId: string): StoredImage[] {
  return getSavedImages().filter(img => img.collectionIds.includes(collectionId));
}

export function saveImageToCollection(
  imageData: {
    imageUrl: string;
    sourceUrl: string;
    source: string;
    title?: string;
    description?: string;
  },
  collectionId: string
): StoredImage {
  const images = getSavedImages();
  
  // Check if image already saved (by imageUrl)
  const existing = images.find(img => img.imageUrl === imageData.imageUrl);
  
  if (existing) {
    // Add to collection if not already there
    if (!existing.collectionIds.includes(collectionId)) {
      existing.collectionIds.push(collectionId);
      localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    }
    return existing;
  }
  
  // Create new saved image
  const image: StoredImage = {
    id: generateId(),
    imageUrl: imageData.imageUrl,
    sourceUrl: imageData.sourceUrl,
    source: imageData.source,
    title: imageData.title || null,
    description: imageData.description || null,
    savedAt: new Date().toISOString(),
    collectionIds: [collectionId],
  };
  images.unshift(image);
  localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  return image;
}

export function removeImageFromCollection(imageId: string, collectionId: string): boolean {
  const images = getSavedImages();
  const image = images.find(img => img.id === imageId);
  if (!image) return false;
  
  image.collectionIds = image.collectionIds.filter(cid => cid !== collectionId);
  localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
  return true;
}

export function getCollectionWithImages(collectionId: string) {
  const collection = getCollection(collectionId);
  if (!collection) return null;
  
  const images = getImagesForCollection(collectionId);
  return {
    ...collection,
    inspirationImages: images,
    _count: { inspirationImages: images.length },
  };
}

export function getCollectionsWithCounts() {
  const collections = getCollections();
  const images = getSavedImages();
  
  return collections.map(c => {
    const collectionImages = images.filter(img => img.collectionIds.includes(c.id));
    return {
      ...c,
      inspirationImages: collectionImages.slice(0, 4),
      _count: { inspirationImages: collectionImages.length },
    };
  });
}
