"use client";

import Image from "next/image";
import { useState } from "react";

// Placeholder images for the gallery until the actual images are uploaded
const galleryImages = [
  { id: 1, src: "/images/photo1.jpg", alt: "photo 1" },
  { id: 2, src: "/images/photo2.jpg", alt: "photo 2" },
  { id: 3, src: "/images/photo3.jpg", alt: "photo 3" },
  { id: 4, src: "/images/photo4.jpg", alt: "photo 4" },
  { id: 5, src: "/images/photo5.jpg", alt: "photo 5" },
  { id: 6, src: "/images/photo6.jpg", alt: "photo 6" },
  { id: 7, src: "/images/photo7.jpg", alt: "photo 7" },
  { id: 8, src: "/images/photo8.jpg", alt: "photo 8" },
  { id: 9, src: "/images/photo9.jpg", alt: "photo 9" },
  { id: 10, src: "/images/photo10.jpg", alt: "photo 10" },
  { id: 11, src: "/images/photo11.jpg", alt: "photo 11" },
  { id: 12, src: "/images/photo12.jpg", alt: "photo 12" },
  { id: 13, src: "/images/photo13.jpg", alt: "photo 13" },
  { id: 14, src: "/images/photo14.jpg", alt: "photo 14" },
  { id: 15, src: "/images/photo15.jpg", alt: "photo 15" },
  { id: 16, src: "/images/photo16.jpg", alt: "photo 16" },
  { id: 17, src: "/images/photo17.jpg", alt: "photo 17" },
  { id: 18, src: "/images/photo18.jpg", alt: "photo 18" },
  { id: 19, src: "/images/photo19.jpg", alt: "photo 19" },
  { id: 20, src: "/images/photo20.jpg", alt: "photo 20" },
  { id: 21, src: "/images/photo21.jpg", alt: "photo 21" },
  { id: 22, src: "/images/photo22.jpg", alt: "photo 22" },
  { id: 23, src: "/images/photo23.jpg", alt: "photo 23" },
  { id: 24, src: "/images/photo24.jpg", alt: "photo 24" },
  { id: 25, src: "/images/photo25.jpg", alt: "photo 25" },
  { id: 26, src: "/images/photo26.jpg", alt: "photo 26" },
  { id: 27, src: "/images/photo27.jpg", alt: "photo 27" },
  { id: 28, src: "/images/photo28.jpg", alt: "photo 28" },
  { id: 29, src: "/images/photo29.jpg", alt: "photo 29" },
  { id: 30, src: "/images/photo30.jpg", alt: "photo 30" },
  { id: 31, src: "/images/photo31.jpg", alt: "photo 31" },
  { id: 32, src: "/images/photo32.jpg", alt: "photo 32" },
  { id: 33, src: "/images/photo33.jpg", alt: "photo 33" },
  { id: 34, src: "/images/photo34.jpg", alt: "photo 34" },
  { id: 35, src: "/images/photo35.jpg", alt: "photo 35" },
  { id: 36, src: "/images/photo36.jpg", alt: "photo 36" },
  { id: 37, src: "/images/photo37.jpg", alt: "photo 37" },
  { id: 38, src: "/images/photo38.jpg", alt: "photo 38" },
  { id: 39, src: "/images/photo39.jpg", alt: "photo 39" },
];

export default function PicturesPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-pink-50 font-sans p-4 py-12">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-3xl font-bold text-center text-[#c2185b] mb-4">
          Pictures Gallery
        </h1>
        <p className="text-center text-slate-600 mb-10 max-w-2xl mx-auto">
          Explore our collection of images. Click on any image to view it in full screen.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="group aspect-square md:aspect-[4/5] bg-white rounded-2xl shadow-md border-t-4 border-[#c2185b] cursor-pointer p-2 transition-shadow hover:shadow-lg flex flex-col"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Fullscreen Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-pink-300 transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full max-w-4xl h-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedImage}
                alt="Selected Fullscreen"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
