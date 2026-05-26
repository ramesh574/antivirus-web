'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const AccountSection = dynamic(() => import('./AccountSection'), { ssr: false });

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBannerVisible(sessionStorage.getItem('banner-hidden') !== 'true');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hideBanner = () => {
    setBannerVisible(false);
    sessionStorage.setItem('banner-hidden', 'true');
  };

  return (
    <>
      {bannerVisible && (
        <div className="delivery-banner">
          <div className="delivery-content">
            <i className="fas fa-shield-virus"></i>
            <span>24/7 Virus Protection | Instant Delivery of License Keys</span>
            <a href="tel:+919321812823"><i className="fas fa-phone"></i> Call Now</a>
          </div>
          <button className="banner-close" onClick={hideBanner}>&times;</button>
        </div>
      )}

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="5" fill="#a27341"/>
            <path d="M7 21V11.5L14 8.5L21 11.5V21" stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
            <path d="M10 21V15.5H18V21" stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
            <path d="M7 11.5H21" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
          <span className="logo-text">
            <span className="logo-main">SECUREGUARD</span>
            <span className="logo-sub">Antivirus Solutions</span>
          </span>
        </Link>
        <nav className={`navbar ${menuOpen ? 'active' : ''}`} id="navbar">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              suppressHydrationWarning
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="icons">
          <AccountSection />
          <div id="menu-btn" className="fas fa-bars" onClick={() => setMenuOpen(!menuOpen)}></div>
        </div>
      </header>
    </>
  );
}
