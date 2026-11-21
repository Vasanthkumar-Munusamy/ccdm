"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";

type DynamicPicture = {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
};

// Default placeholder images
const defaultImages = Array.from({ length: 39 }, (_, i) => ({
  id: `default-${i + 1}`,
  src: `/images/photo${i + 1}.jpg`,
  alt: `photo ${i + 1}`,
  title: "",
}));

export default function PicturesPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dynamicPictures, setDynamicPictures] = useState<DynamicPicture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pictures`);
        if (res.ok) {
          const data = await res.json();
          setDynamicPictures(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch gallery pictures:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPictures();
  }, []);

  // Format dynamic pictures into unified gallery format
  const formattedDynamic = dynamicPictures.map((pic) => ({
    id: `dynamic-${pic.id}`,
    src: pic.image_url.startsWith("/")
      ? `${API_BASE_URL}${pic.image_url}`
      : pic.image_url,
    alt: pic.title || "Gallery picture",
    title: pic.title,
  }));

  // Newly uploaded pictures appear first, followed by default photos
  const allImages = [...formattedDynamic, ...defaultImages];

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
          {allImages.map((image) => (
            <div
              key={image.id}
              className="group aspect-square md:aspect-[4/5] bg-white rounded-2xl shadow-md border-t-4 border-[#c2185b] cursor-pointer p-2 transition-shadow hover:shadow-lg flex flex-col justify-between"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="relative w-full flex-1 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center min-h-0">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {image.title && (
                <p className="text-xs font-semibold text-slate-700 text-center truncate pt-2 px-1">
                  {image.title}
                </p>
              )}
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
            <div
              className="relative w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Selected Fullscreen"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
