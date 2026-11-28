"use client";

import { useEffect, useState, useRef } from "react";
import { API_BASE_URL } from "@/config/api";
import { useAdmin } from "@/context/AdminContext";

type DynamicPicture = {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
};

// Default placeholder images
const defaultImages = Array.from({ length: 39 }, (_, i) => ({
  id: `default-${i + 1}`,
  numericId: null as number | null,
  isDynamic: false,
  src: `/images/photo${i + 1}.jpg`,
  alt: `photo ${i + 1}`,
  title: "",
}));

export default function PicturesPage() {
  const { isAdmin } = useAdmin();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dynamicPictures, setDynamicPictures] = useState<DynamicPicture[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    fetchPictures();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image file to upload.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload the image file to /api/upload
      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image file to server.");
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // 2. Save picture record to /api/pictures
      const saveRes = await fetch(`${API_BASE_URL}/api/pictures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleInput.trim(),
          image_url: imageUrl,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save picture record in database.");
      }

      // Reset and close
      setTitleInput("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsUploadModalOpen(false);
      fetchPictures();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred while uploading the picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePicture = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this picture from the gallery?")) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/pictures/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDynamicPictures((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete picture.");
      }
    } catch (err) {
      console.error("Failed to delete picture:", err);
      alert("Error occurred while deleting picture.");
    }
  };

  // Format dynamic pictures into unified gallery format
  const formattedDynamic = dynamicPictures.map((pic) => ({
    id: `dynamic-${pic.id}`,
    numericId: pic.id,
    isDynamic: true,
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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl md:text-3xl font-bold text-[#c2185b]">
              Pictures Gallery
            </h1>
            <p className="text-slate-600 text-xs md:text-sm mt-1">
              Explore our collection of images. Click on any image to view it in full screen.
            </p>
          </div>

          {/* Admin Action: Upload Picture */}
          {isAdmin && (
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#c2185b] hover:bg-[#ad1457] text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span>📷</span>
                <span>Upload Picture</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin Bar Notification */}
        {isAdmin && (
          <div className="mb-6 bg-pink-100 border border-pink-300 text-pink-900 text-xs py-2 px-3.5 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span>👑</span>
              <span><strong>Admin Mode Active:</strong> You can upload new photos or delete uploaded photos directly here. Regular visitors only see the gallery.</span>
            </span>
          </div>
        )}

        {/* Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allImages.map((image) => (
            <div
              key={image.id}
              className="group aspect-square md:aspect-[4/5] bg-white rounded-2xl shadow-md border-t-4 border-[#c2185b] cursor-pointer p-2 transition-shadow hover:shadow-lg flex flex-col justify-between relative"
              onClick={() => setSelectedImage(image.src)}
            >
              {/* Delete Button for Admin on Dynamic Pictures */}
              {isAdmin && image.isDynamic && image.numericId && (
                <button
                  onClick={(e) => handleDeletePicture(image.numericId!, e)}
                  title="Delete picture"
                  className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}

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

        {/* Admin Upload Picture Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-pink-200 my-8">
              <div className="bg-gradient-to-r from-[#c2185b] to-[#ad1457] text-white p-5 flex justify-between items-center">
                <h2 className="font-bold text-lg">Upload Picture to Gallery</h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-pink-100 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Image File *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-[#c2185b] hover:file:bg-pink-100 cursor-pointer border border-slate-200 rounded-lg p-2"
                  />
                </div>

                {previewUrl && (
                  <div className="mt-1 flex flex-col items-center">
                    <span className="text-xs text-slate-500 mb-1 font-medium">Image Preview:</span>
                    <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Caption / Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Enter short picture caption..."
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="py-2.5 px-5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="py-2.5 px-6 text-sm font-bold text-white bg-[#c2185b] hover:bg-[#ad1457] rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {uploading ? "Uploading..." : "Upload Picture"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
