'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { dealer } from '@/config/dealerships/right-price';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Apply', href: dealer.creditAppUrl, external: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const saved: string[] = JSON.parse(localStorage.getItem('rpas_favorites') ?? '[]');
        setSavedCount(saved.length);
      } catch {}
    };
    read();
    window.addEventListener('rpas_favorites_changed', read);
    window.addEventListener('storage', read);
    return () => {
      window.removeEventListener('rpas_favorites_changed', read);
      window.removeEventListener('storage', read);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Transparent only on the home page before scrolling
  const isTransparent = pathname === '/' && !scrolled && !mobileOpen;
  const navBg = isTransparent ? 'bg-transparent' : 'bg-white shadow-sm';
  const textColor = isTransparent ? 'text-white' : 'text-secondary';
  const logoColor = isTransparent ? 'text-white' : 'text-primary';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${navBg}`}>
        <div className="relative flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">

            {/* Logo or Brand Text — text on home page, logo image everywhere else */}
            {pathname === '/' ? (
              <Link href="/" className="flex items-center">
                <span className={`font-semibold tracking-wider uppercase text-sm sm:text-base md:text-lg ${textColor}`}>
                  Right Price Auto Sales, Inc.
                </span>
              </Link>
            ) : (
              <Link href="/" className="flex items-center gap-5">
                <Image
                  src="/logo.png"
                  alt="Right Price Auto Sales"
                  width={200}
                  height={157}
                  className="h-10 w-auto"
                  priority
                />
                <span className="hidden sm:block text-xs font-normal tracking-widest uppercase text-muted">
                  Murfreesboro, TN · Est. 1993
                </span>
              </Link>
            )}

            {/* Desktop nav links */}
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6">
              {NAV_LINKS.map(({ label, href, external }) => (
                <Link
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={`text-sm font-medium hover:text-primary transition-colors ${textColor}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/inventory?saved=1" className="relative p-1.5 group" aria-label="Saved vehicles">
                <svg
                  className={`w-5 h-5 transition-colors ${isTransparent ? 'stroke-white fill-none group-hover:fill-white/20' : 'stroke-gray-400 fill-none group-hover:stroke-gray-600'}`}
                  viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {savedCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {savedCount}
                  </span>
                )}
              </Link>
              <a
                href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
                className={`text-sm font-medium border rounded-full px-4 py-1.5 transition-colors
                  ${isTransparent
                    ? 'border-white text-white hover:bg-white hover:text-secondary'
                    : 'border-secondary text-secondary hover:bg-secondary hover:text-white'
                  }`}
              >
                {dealer.phone}
              </a>
              <a
                href={dealer.creditAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold bg-primary text-white rounded-full px-4 py-1.5 hover:opacity-90 transition-opacity"
              >
                Apply Now
              </a>
            </div>

            {/* Mobile: call + hamburger */}
            <div className="flex md:hidden items-center gap-3">
              <a
                href={`tel:${dealer.phone.replace(/[^0-9]/g, '')}`}
                className="text-sm font-semibold bg-primary text-white rounded-full px-3 py-1.5"
              >
                Call
              </a>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-1.5 ${textColor}`}
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>

        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4">
            {NAV_LINKS.map(({ label, href, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="block text-sm font-medium text-secondary hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex">
        {NAV_LINKS.map(({ label, href, external }) => (
          <Link
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="flex-1 flex flex-col items-center justify-center py-2 text-xs font-medium text-muted hover:text-primary transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
