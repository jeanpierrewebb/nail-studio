'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  size?: 'default' | 'hero';
}

export default function SearchBar({ 
  placeholder = "Search nail art ideas...", 
  initialValue = "",
  onSearch,
  className = "",
  size = "default"
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const isHero = size === 'hero';

  const popularTerms = ['French tips', 'Ombre', 'Gel nails', 'Floral', 'Glitter'];

  return (
    <form onSubmit={handleSubmit} className={className} style={{ width: '100%' }}>
      <div style={{ position: 'relative' }}>
        {/* Search icon */}
        <div style={{
          position: 'absolute',
          left: isHero ? '1.25rem' : '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#f472b6',
        }}>
          <svg style={{ width: isHero ? '1.375rem' : '1.125rem', height: isHero ? '1.375rem' : '1.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            backgroundColor: 'white',
            border: '2px solid #fbcfe8',
            borderRadius: '9999px',
            outline: 'none',
            transition: 'all 0.3s',
            color: '#374151',
            paddingLeft: isHero ? '3.25rem' : '2.75rem',
            paddingRight: isHero ? '3.75rem' : '3.25rem',
            paddingTop: isHero ? '1.125rem' : '0.75rem',
            paddingBottom: isHero ? '1.125rem' : '0.75rem',
            fontSize: isHero ? '1.125rem' : '1rem',
            minHeight: isHero ? '56px' : '44px',
          }}
        />

        {/* Search button */}
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #ec4899, #db2777)',
            color: 'white',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: isHero ? '2.75rem' : '2.25rem',
            height: isHero ? '2.75rem' : '2.25rem',
            transition: 'all 0.2s',
          }}
        >
          <svg style={{ width: '1.125rem', height: '1.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      {/* Popular searches */}
      <div style={{
        marginTop: '0.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}>
        <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Try:</span>
        {popularTerms.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setQuery(term);
              if (onSearch) {
                onSearch(term);
              } else {
                router.push(`/search?q=${encodeURIComponent(term)}`);
              }
            }}
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#fdf2f8',
              color: '#db2777',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
}
