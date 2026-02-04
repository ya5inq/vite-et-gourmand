'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CartIcon } from '@/components/molecules/CartIcon';
import { CartDrawer } from '@/components/molecules/CartDrawer';

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function getInitials(): string {
    if (profile?.first_name || profile?.last_name) {
      const first = profile.first_name?.charAt(0)?.toUpperCase() || '';
      const last = profile.last_name?.charAt(0)?.toUpperCase() || '';
      return first + last || first || last || '?';
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  }

  function getDisplayName(): string {
    if (profile?.first_name || profile?.last_name) {
      return [profile.first_name, profile.last_name].filter(Boolean).join(' ');
    }
    return user?.email || '';
  }

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/menus', label: 'Menus' },
    { href: '/contact', label: 'Contact' },
  ];

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon.svg"
              alt="Vite & Gourmand"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-lg sm:text-xl font-bold text-foreground">
              Vite <span className="text-primary">&amp;</span> Gourmand
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.href) ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <CartIcon onClick={() => setCartOpen(true)} />

              {isLoading ? (
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              ) : isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                    aria-label="Menu profil"
                  >
                    {getInitials()}
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <UserIcon size={16} />
                        Mon compte
                      </Link>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-muted transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        Deconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>

          {/* Mobile icons */}
          <div className="md:hidden flex items-center gap-2">
            <CartIcon onClick={() => setCartOpen(true)} />
            {!isLoading && isAuthenticated && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-xs">
                {getInitials()}
              </div>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-foreground cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                  >
                    Mon compte
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                    className="block py-2 text-sm font-medium text-muted-foreground hover:text-destructive"
                  >
                    Deconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-medium text-primary"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
