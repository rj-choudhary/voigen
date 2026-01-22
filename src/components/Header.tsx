'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/">
            <img 
              src="/assets/voigen ai logo.png" 
              alt="Voigen.ai Logo" 
              className="nav-logo-img"
              style={{ width: 'auto', height: '60px' }}
            />
          </Link>
        </div>
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
          <li><Link href="/#about" className="nav-link" onClick={closeMenu}>About Us</Link></li>
          <li><Link href="/#features" className="nav-link" onClick={closeMenu}>Features</Link></li>
          <li><Link href="/blog" className="nav-link" onClick={closeMenu}>Blog</Link></li>
          <li><Link href="/#contact" className="nav-link" onClick={closeMenu}>Contact Us</Link></li>
          <li><Link href="/#contact" className="btn btn-primary" onClick={closeMenu}>Get Started Free</Link></li>
        </ul>
        <button 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
          id="navToggle"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
