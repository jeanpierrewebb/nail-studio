'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { updateImageNotes, getSavedImages } from '@/lib/storage';
import { useToast } from '@/contexts/ToastContext';

export interface LightboxImage {
  id: string;
  imageUrl: string;
  title?: string;
  source: string;
  sourceUrl: string;
  description?: string;
  notes?: string;
}

interface ImageLightboxProps {
  images: LightboxImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (image: LightboxImage) => void;
}

export default function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  onSave,
}: ImageLightboxProps) {
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [notesValue, setNotesValue] = useState('');
  const [isSavedImage, setIsSavedImage] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  // Update notes when current image changes
  useEffect(() => {
    if (!isOpen || images.length === 0) return;
    const img = images[currentIndex];
    if (!img) return;

    // Check if this image exists in saved images (has notes capability)
    const saved = getSavedImages();
    const savedImg = saved.find((s) => s.imageUrl === img.imageUrl || s.id === img.id);
    setIsSavedImage(!!savedImg);
    setNotesValue(savedImg?.notes || img.notes || '');
  }, [isOpen, currentIndex, images]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback(
    (idx: number) => {
      if (idx >= 0 && idx < images.length) setCurrentIndex(idx);
    },
    [images.length],
  );

  const handleNotesBlur = () => {
    const img = images[currentIndex];
    if (!img) return;

    const saved = getSavedImages();
    const savedImg = saved.find((s) => s.imageUrl === img.imageUrl || s.id === img.id);
    if (savedImg) {
      const oldNotes = savedImg.notes || '';
      if (notesValue !== oldNotes) {
        updateImageNotes(savedImg.id, notesValue);
        toast.success('Note saved! 📝');
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) goTo(currentIndex + 1);
    else if (diff < -threshold) goTo(currentIndex - 1);
  };

  if (!isOpen || images.length === 0) return null;

  const img = images[currentIndex];
  if (!img) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 flex flex-col" onClick={onClose}>
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 sm:p-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-white/70 text-sm">{currentIndex + 1} / {images.length}</span>
        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative min-h-0"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {currentIndex > 0 && (
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-10"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.imageUrl}
          alt={img.title || 'Nail art'}
          className="max-h-full max-w-full object-contain select-none"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          draggable={false}
        />

        {currentIndex < images.length - 1 && (
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors z-10"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom info bar */}
      <div
        className="flex-shrink-0 bg-black/60 backdrop-blur-sm overflow-y-auto max-h-[40vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="px-4 pt-3 pb-3 max-w-2xl mx-auto">
          {img.title && (
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-2">{img.title}</h3>
          )}

          <div className="flex items-center justify-between gap-3 mb-3">
            <a
              href={img.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 text-xs hover:text-white/90 transition-colors truncate"
            >
              {img.source} ↗
            </a>
            <button
              onClick={() => onSave(img)}
              className="btn-primary text-sm py-2.5 px-5 whitespace-nowrap flex-shrink-0"
            >
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              Save to Collection
            </button>
          </div>

          {/* Notes area — only for saved images */}
          {isSavedImage && (
            <div>
              <textarea
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add a note about this design..."
                rows={2}
                className="w-full bg-white/10 text-white placeholder-white/40 rounded-lg p-3 text-sm border border-white/20 focus:border-pink-400 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
