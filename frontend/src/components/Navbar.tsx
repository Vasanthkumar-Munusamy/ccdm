"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Script from "next/script";

export default function Navbar() {
  const [qaOpen, setQaOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasTranslateBanner, setHasTranslateBanner] = useState(false);

  // Fix for Google Translate leaving an empty space at the top when the popup is closed.
  useEffect(() => {
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,ta,ml,kn,te,hi'
          },
          'google_translate_element'
        );
      }
    };

    const fixGoogleTranslateGap = setInterval(() => {
      const isTranslated = document.documentElement.classList.contains('translated-ltr') ||
        document.documentElement.classList.contains('translated-rtl');

      const banner = document.querySelector('.goog-te-banner-frame, .skiptranslate > iframe') as HTMLElement;
      const isBannerVisible = banner && window.getComputedStyle(banner).display !== 'none' && banner.offsetHeight > 0;

      const isActive = isTranslated || !!isBannerVisible;
      setHasTranslateBanner(isActive);

      if (!isActive) {
        if (document.documentElement.style.top) {
          document.documentElement.style.top = '';
        }
        if (document.body.style.top) {
          document.body.style.top = '';
        }
      }
    }, 300);

    return () => clearInterval(fixGoogleTranslateGap);
  }, []);

  return (
    <>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      <nav
        className="sticky w-full z-50 bg-gradient-to-r from-[#d81b60] to-[#c2185b] text-white shadow-md transition-all duration-300"
        style={{ top: hasTranslateBanner ? '40px' : '0px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between md:justify-center h-16 md:h-12 items-center">

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-pink-200 focus:outline-none p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <span className="font-bold ml-2 md:hidden">CCDM</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-pink-200 transition-colors">Home</Link>

              {/* Gallery Dropdown */}
              <div className="relative h-full flex items-center" onMouseEnter={() => setGalleryOpen(true)} onMouseLeave={() => setGalleryOpen(false)}>
                <button className="flex items-center hover:text-pink-200 transition-colors focus:outline-none">
                  Gallery <span className="ml-1 text-[10px]">▼</span>
                </button>
                {galleryOpen && (
                  <div className="absolute top-10 left-0 w-40 bg-[#c2185b] rounded-b shadow-lg py-2">
                    <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Pictures</Link>
                    <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Audios</Link>
                    <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Videos</Link>
                  </div>
                )}
              </div>

              {/* Q&A Dropdown */}
              <div className="relative h-full flex items-center" onMouseEnter={() => setQaOpen(true)} onMouseLeave={() => setQaOpen(false)}>
                <button className="flex items-center hover:text-pink-200 transition-colors focus:outline-none">
                  Questions & Answers <span className="ml-1 text-[10px]">▼</span>
                </button>
                {qaOpen && (
                  <div className="absolute top-10 left-0 w-56 bg-[#c2185b] rounded-b shadow-lg py-2">
                    <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white whitespace-nowrap">Common Questions</Link>
                    <Link href="/caste-denial-qa" className="block px-4 py-2 hover:bg-[#ad1457] text-white whitespace-nowrap">Caste Denial Q & A</Link>
                  </div>
                )}
              </div>

              {/* Services Dropdown */}
              <div className="relative h-full flex items-center" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                <button className="flex items-center hover:text-pink-200 transition-colors focus:outline-none">
                  Services <span className="ml-1 text-[10px]">▼</span>
                </button>
                {servicesOpen && (
                  <div className="absolute top-10 left-0 w-40 bg-[#c2185b] rounded-b shadow-lg py-2">
                    <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Blood Bank</Link>
                    <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Matrimony</Link>
                  </div>
                )}
              </div>

              <Link href="#" className="hover:text-pink-200 transition-colors">Support us</Link>
              <Link href="#" className="hover:text-pink-200 transition-colors">Contact us</Link>
              <Link href="#" className="hover:text-pink-200 transition-colors">Articles</Link>
              <Link href="#" className="hover:text-pink-200 transition-colors">Kindle-Version-Books</Link>
            </div>

            {/* Google Translate Element (Shared) */}
            <div className="flex items-center ml-2 md:ml-6 flex-shrink-0 pt-3.5">
              <div id="google_translate_element" className="min-h-[30px] overflow-hidden flex items-center" style={{ maxWidth: '140px' }}></div>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#c2185b] border-t border-pink-700">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded hover:bg-[#ad1457] font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>

              <div className="px-3 py-2 font-medium border-b border-pink-700 text-pink-200">Gallery</div>
              <div className="pl-6 space-y-1">
                <Link href="#" className="block px-3 py-2 text-sm hover:bg-[#ad1457]" onClick={() => setMobileMenuOpen(false)}>Pictures</Link>
                <Link href="#" className="block px-3 py-2 text-sm hover:bg-[#ad1457]" onClick={() => setMobileMenuOpen(false)}>Audios</Link>
                <Link href="#" className="block px-3 py-2 text-sm hover:bg-[#ad1457]" onClick={() => setMobileMenuOpen(false)}>Videos</Link>
              </div>

              <div className="px-3 py-2 font-medium border-b border-pink-700 text-pink-200 mt-2">Questions & Answers</div>
              <div className="pl-6 space-y-1">
                <Link href="#" className="block px-3 py-2 text-sm hover:bg-[#ad1457]" onClick={() => setMobileMenuOpen(false)}>Common Questions</Link>
                <Link href="/caste-denial-qa" className="block px-3 py-2 text-sm hover:bg-[#ad1457]" onClick={() => setMobileMenuOpen(false)}>Caste Denial Q & A</Link>
              </div>

              <div className="px-3 py-2 font-medium border-b border-pink-700 text-pink-200 mt-2">Services</div>
              <div className="pl-6 space-y-1">
                <Link href="#" className="block px-3 py-2 text-sm hover:bg-[#ad1457]" onClick={() => setMobileMenuOpen(false)}>Blood Bank</Link>
                <Link href="#" className="block px-3 py-2 text-sm hover:bg-[#ad1457]" onClick={() => setMobileMenuOpen(false)}>Matrimony</Link>
              </div>

              <Link href="#" className="block px-3 py-2 rounded hover:bg-[#ad1457] font-medium mt-2" onClick={() => setMobileMenuOpen(false)}>Support us</Link>
              <Link href="#" className="block px-3 py-2 rounded hover:bg-[#ad1457] font-medium" onClick={() => setMobileMenuOpen(false)}>Contact us</Link>
              <Link href="#" className="block px-3 py-2 rounded hover:bg-[#ad1457] font-medium" onClick={() => setMobileMenuOpen(false)}>Articles</Link>
              <Link href="#" className="block px-3 py-2 rounded hover:bg-[#ad1457] font-medium" onClick={() => setMobileMenuOpen(false)}>Kindle-Version-Books</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
