'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home', emoji: '🏠' },
  { href: '/search', label: 'Search', emoji: '🔍' },
  { href: '/ideas', label: 'Ideas', emoji: '💡' },
  { href: '/collections', label: 'Collections', emoji: '📁' },
  { href: '/suggest', label: 'Suggest', emoji: '✨' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop / Tablet Top Nav */}
      <nav style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #fce7f3' }}
           className="sticky top-0 z-50">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                 className="hidden sm:flex">
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
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger - hidden on sm+ */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden"
              style={{ padding: '0.5rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg style={{ width: '1.5rem', height: '1.5rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
                minWidth: '3rem',
                minHeight: '3rem',
                textDecoration: 'none',
                color: isActive(link.href) ? '#db2777' : '#9ca3af',
                fontSize: '0.625rem',
                fontWeight: isActive(link.href) ? 600 : 400,
              }}
            >
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{link.emoji}</span>
              <span style={{ marginTop: '2px' }}>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
