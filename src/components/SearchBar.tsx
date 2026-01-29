'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBar({ 
  placeholder = "Search for nail art ideas...", 
  initialValue = "",
  onSearch,
  className = ""
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

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="search-bar pr-12 shadow-soft"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-pink-500 hover:text-pink-600 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      {/* Popular searches */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500">Popular:</span>
        {['French tips', 'Ombre nails', 'Gel nails', 'Nail art', 'Acrylic'].map((term) => (
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
            className="text-sm px-3 py-1 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors duration-200"
          >
            {term}
          </button>
        ))}
      </div>
    </form>
  );
}