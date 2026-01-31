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
  onSave,
  onUnsave,
  className = ""
}: ImageCardProps) {
  const [isSaved, setIsSaved] = useState(saved);
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSaveToggle = async () => {
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

  return (
    <div className={`card group hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Image — use regular <img> to support any domain */}
      <div className="relative aspect-auto">
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
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt={title || 'Nail art inspiration'}
            className="w-full h-auto object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        
        {/* Overlay with actions */}
        {!imgError && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
            <div className="w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center justify-between">
                {/* Source badge */}
                <button
                  onClick={handleSourceClick}
                  className="px-3 py-1 bg-white bg-opacity-90 rounded-full text-sm font-medium text-gray-800 hover:bg-opacity-100 transition-all duration-200"
                >
                  {source}
                </button>
                
                {/* Save button */}
                <button
                  onClick={handleSaveToggle}
                  disabled={isLoading}
                  className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                    isSaved 
                      ? 'bg-pink-500 text-white hover:bg-pink-600' 
                      : 'bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      {(title || description) && (
        <div className="p-4">
          {title && (
            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
