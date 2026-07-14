"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [qaOpen, setQaOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-[#d81b60] to-[#c2185b] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-12 items-center space-x-6 text-sm font-medium">
          
          <Link href="/" className="hover:text-pink-200 transition-colors">
            Home
          </Link>
          
          {/* Gallery Dropdown */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setGalleryOpen(true)}
            onMouseLeave={() => setGalleryOpen(false)}
          >
            <button className="flex items-center hover:text-pink-200 transition-colors focus:outline-none">
              Gallery <span className="ml-1 text-[10px]">▼</span>
            </button>
            {galleryOpen && (
              <div className="absolute top-12 left-0 mt-0 w-40 bg-[#c2185b] rounded-b shadow-lg py-2">
                <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Photos</Link>
                <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Videos</Link>
              </div>
            )}
          </div>

          {/* Q&A Dropdown */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setQaOpen(true)}
            onMouseLeave={() => setQaOpen(false)}
          >
            <button className="flex items-center hover:text-pink-200 transition-colors focus:outline-none">
              Questions & Answers <span className="ml-1 text-[10px]">▼</span>
            </button>
            {qaOpen && (
              <div className="absolute top-12 left-0 mt-0 w-56 bg-[#c2185b] rounded-b shadow-lg py-2">
                <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white whitespace-nowrap">
                  Caste Denial Q & A
                </Link>
                <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white whitespace-nowrap">
                  An Interview with you
                </Link>
              </div>
            )}
          </div>

          {/* Services Dropdown */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="flex items-center hover:text-pink-200 transition-colors focus:outline-none">
              Services <span className="ml-1 text-[10px]">▼</span>
            </button>
            {servicesOpen && (
              <div className="absolute top-12 left-0 mt-0 w-40 bg-[#c2185b] rounded-b shadow-lg py-2">
                <Link href="#" className="block px-4 py-2 hover:bg-[#ad1457] text-white">Matrimony</Link>
              </div>
            )}
          </div>

          <Link href="#" className="hover:text-pink-200 transition-colors">
            Support us
          </Link>
          
          <Link href="#" className="hover:text-pink-200 transition-colors">
            Contact us
          </Link>
          
          <Link href="#" className="hover:text-pink-200 transition-colors">
            Articles
          </Link>
          
          <Link href="#" className="hover:text-pink-200 transition-colors">
            Kindle-Version-Books
          </Link>

        </div>
      </div>
    </nav>
  );
}
