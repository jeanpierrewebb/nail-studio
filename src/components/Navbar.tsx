'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSavedImages } from '@/lib/storage';

const navLinks = [
  { href: '/', label: 'Home', emoji: '🏠' },
  { href: '/search', label: 'Search', emoji: '🔍' },
  { href: '/collections', label: 'Collections', emoji: '📁' },
  { href: '/saves', label: 'My Saves', emoji: '💝' },
  { href: '/ideas', label: 'Ideas', emoji: '💡' },
  { href: '/suggest', label: 'Suggest', emoji: '✨' },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [saveCount, setSaveCount] = useState(0);

  useEffect(() => {
    setSaveCount(getSavedImages().length);

    // Re-check on storage events (other tabs) and on focus
    const update = () => setSaveCount(getSavedImages().length);
    window.addEventListener('storage', update);
    window.addEventListener('focus', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('focus', update);
    };
  }, []);

  return (
    <>
      {/* Desktop / Tablet Top Nav - hidden on mobile */}
      <nav style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #fce7f3' }}
           className="hidden sm:block sticky top-0 z-50">
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <span style={{ fontSize: '1.5rem' }}>💅</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#db2777' }}>
                Nail Studio
              </span>
            </Link>

            {/* Desktop Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: isActive(link.href) ? '#fce7f3' : 'transparent',
                    color: isActive(link.href) ? '#be185d' : '#6b7280',
                    position: 'relative',
                  }}
                >
                  {link.label}
                  {link.href === '/saves' && saveCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '0',
                      right: '-2px',
                      backgroundColor: '#ec4899',
                      color: 'white',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      minWidth: '18px',
                      height: '18px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}>
                      {saveCount > 99 ? '99+' : saveCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <div className="sm:hidden" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #fce7f3',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '3.5rem', padding: '0 0.25rem' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '2.75rem',
                minHeight: '3rem',
                textDecoration: 'none',
                color: isActive(link.href) ? '#db2777' : '#9ca3af',
                fontSize: '0.5625rem',
                fontWeight: isActive(link.href) ? 600 : 400,
                position: 'relative',
              }}
            >
              <span style={{ fontSize: '1.125rem', lineHeight: 1 }}>{link.emoji}</span>
              <span style={{ marginTop: '2px' }}>{link.label}</span>
              {link.href === '/saves' && saveCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '-2px',
                  backgroundColor: '#ec4899',
                  color: 'white',
                  fontSize: '0.5rem',
                  fontWeight: 700,
                  minWidth: '14px',
                  height: '14px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                }}>
                  {saveCount > 99 ? '99+' : saveCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
