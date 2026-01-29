'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-pink-200 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">💅</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-gold bg-clip-text text-transparent">
              Nail Studio
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-pink-600 border-b-2 border-pink-600' 
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/ideas" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/ideas') 
                  ? 'text-pink-600 border-b-2 border-pink-600' 
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              My Ideas
            </Link>
            <Link 
              href="/collections" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/collections') 
                  ? 'text-pink-600 border-b-2 border-pink-600' 
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              Collections
            </Link>
            <Link 
              href="/suggest" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/suggest') 
                  ? 'text-pink-600 border-b-2 border-pink-600' 
                  : 'text-gray-600 hover:text-pink-600'
              }`}
            >
              Help Me Decide
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button className="text-gray-600 hover:text-pink-600 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}