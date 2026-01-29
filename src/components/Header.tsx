'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const profileRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignOut = async () => {
    closeMenu();
    setIsProfileOpen(false);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get user display name or email
  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <>
      {/* Skip Link for Keyboard Navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <div className="nav-brand">
            <Link href="/" aria-label="Voigen.ai - Go to homepage">
              <img 
                src="/assets/voigen-logo-header.png" 
                alt="Voigen.ai Logo" 
                className="nav-logo-img"
                style={{ width: 'auto', height: '60px' }}
              />
            </Link>
          </div>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu" role="menubar">
          <li role="none"><Link href="/pricing" className="nav-link" role="menuitem" onClick={closeMenu}>Pricing</Link></li>
          <li role="none"><Link href="/blog" className="nav-link" role="menuitem" onClick={closeMenu}>Blog</Link></li>
          <li role="none"><Link href="/contact-us" className="nav-link" role="menuitem" onClick={closeMenu}>Contact Us</Link></li>
          
          {loading ? (
            <li><span className="nav-link">Loading...</span></li>
          ) : user ? (
            <li className="profile-menu-container" ref={profileRef}>
              <button 
                className="profile-trigger"
                onClick={toggleProfile}
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="profile-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="profile-avatar-img" />
                  ) : (
                    <span className="profile-avatar-initials">{getUserInitials()}</span>
                  )}
                </div>
                <span className="profile-name">{getUserDisplayName()}</span>
                <svg 
                  className={`profile-chevron ${isProfileOpen ? 'open' : ''}`}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" />
                      ) : (
                        <span>{getUserInitials()}</span>
                      )}
                    </div>
                    <div className="profile-dropdown-info">
                      <span className="profile-dropdown-name">{getUserDisplayName()}</span>
                      <span className="profile-dropdown-email">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <Link 
                    href="/auth/confirmation" 
                    className="profile-dropdown-item"
                    onClick={() => { setIsProfileOpen(false); closeMenu(); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Dashboard
                  </Link>
                  
                  <Link 
                    href="/purchases" 
                    className="profile-dropdown-item"
                    onClick={() => { setIsProfileOpen(false); closeMenu(); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Your Purchases
                  </Link>
                  
                  <div className="profile-dropdown-divider"></div>
                  
                  <button 
                    className="profile-dropdown-item logout-item"
                    onClick={handleSignOut}
                    aria-label="Sign out of your account"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li className="nav-auth-group" role="none">
              <Link href="/auth/signin" className="nav-link nav-login" role="menuitem" onClick={closeMenu}>
                Login
              </Link>
              <span className="nav-separator" aria-hidden="true">|</span>
              <Link href="/auth/signup" className="btn btn-primary btn-with-subtext" role="menuitem" onClick={closeMenu} aria-label="Start free trial, no credit card required">
                <span className="btn-main-text">Start Free Trial</span>
                <span className="btn-sub-text" aria-hidden="true">No CC required</span>
              </Link>
              <button 
                className="btn btn-outline btn-header" 
                data-cal-namespace="democall"
                data-cal-link="voigen-mvcmgc/democall"
                data-cal-config='{"layout":"month_view"}'
                onClick={closeMenu}
                aria-label="Book a demo call with our team"
              >
                Book a Demo
              </button>
            </li>
          )}
        </ul>
        <button 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
          id="navToggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="navMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    </>
  );
}
