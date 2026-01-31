'use client';

import { useState } from 'react';

interface ImageCardProps {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  source: string;
  sourceUrl: string;
  saved?: boolean;
  notes?: string;
  onSaveToCollection?: (imageData: { imageUrl: string; sourceUrl: string; source: string; title?: string; description?: string }) => void;
  onImageClick?: () => void;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
  className?: string;
}

export default function ImageCard({
  id,
  imageUrl,
  title,
  description,
  source,
  sourceUrl,
  saved = false,
  notes,
  onSaveToCollection,
  onImageClick,
  onSave,
  onUnsave,
  className = ""
}: ImageCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleSaveClick = async () => {
    if (onSaveToCollection) {
      onSaveToCollection({ imageUrl, sourceUrl, source, title, description });
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await onUnsave?.(id);
        setIsSaved(false);
      } else {
        await onSave?.(id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
    setIsLoading(false);
  };

  const handleSourceClick = () => {
    window.open(sourceUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCardTap = () => {
    if (onImageClick) {
      onImageClick();
      return;
    }
    if (onSaveToCollection) {
      onSaveToCollection({ imageUrl, sourceUrl, source, title, description });
    }
  };

  return (
    <div className={`card group hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Image — tap to open lightbox */}
      <div className="relative aspect-auto cursor-pointer" onClick={handleCardTap}>
        {imgError ? (
          <div
            className="w-full flex items-center justify-center"
            style={{
              minHeight: '200px',
              background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
            }}
          >
            <div className="text-center p-4">
              <span className="text-4xl block mb-2">💅</span>
              <span className="text-pink-400 text-sm">Image not available</span>
            </div>
          </div>
        ) : (
          <>
            {!imgLoaded && !imgError && (
              <div
                className="w-full flex items-center justify-center animate-pulse"
                style={{
                  minHeight: '200px',
                  background: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
                }}
              >
                <span className="text-3xl">💅</span>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title || 'Nail art inspiration'}
              className={`w-full h-auto object-cover ${imgLoaded ? '' : 'absolute opacity-0'}`}
              loading="lazy"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.naturalWidth < 10 || img.naturalHeight < 10) {
                  setImgError(true);
                } else {
                  setImgLoaded(true);
                }
              }}
              onError={() => setImgError(true)}
            />
          </>
        )}
      </div>

      {/* Content footer — title, notes, source, save button */}
      <div className="px-3 pt-2.5 pb-3">
        {title && (
          <h3 className="font-medium text-gray-900 text-xs leading-snug mb-1 line-clamp-2">
            {title}
          </h3>
        )}
        {notes && (
          <p className="text-gray-500 text-[11px] mb-1 line-clamp-1 italic">
            📝 {notes}
          </p>
        )}
        <div className="flex items-center justify-between mt-1.5">
          {/* Source badge */}
          <button
            onClick={(e) => { e.stopPropagation(); handleSourceClick(); }}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500 hover:bg-pink-100 hover:text-pink-700 transition-colors duration-200"
          >
            <svg className="w-2.5 h-2.5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {source}
          </button>

          {/* Save button — inline in footer, not overlaying image */}
          <button
            onClick={(e) => { e.stopPropagation(); handleSaveClick(); }}
            disabled={isLoading}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isSaved
                ? 'text-pink-500 hover:text-pink-600'
                : 'text-gray-300 hover:text-pink-400'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isSaved ? 'Saved' : 'Save to collection'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isSaved ? 0 : 2} viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
