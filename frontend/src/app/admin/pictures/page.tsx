"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import RichTextEditor from "@/components/RichTextEditor";

type Picture = {
  id: number;
  title: string;
  image_url: string;
  created_at: string;
};

export default function PicturesManager() {
  const router = useRouter();
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuth(true);
      fetchPictures();
    }
  }, [router]);

  const fetchPictures = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/pictures`);
      if (res.ok) {
        const data = await res.json();
        setPictures(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch pictures:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
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

      // 2. Save the picture metadata to /api/pictures
      const saveRes = await fetch(`${API_BASE_URL}/api/pictures`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          image_url: imageUrl,
        }),
      });

      if (!saveRes.ok) {
        let errorMsg = `Server returned ${saveRes.status}`;
        try {
          const errData = await saveRes.json();
          if (errData?.error) errorMsg += `: ${errData.error}`;
        } catch (_) {}
        throw new Error(`Failed to save picture record: ${errorMsg}`);
      }

      // Reset form
      setTitle("");
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Refresh list
      fetchPictures();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "An error occurred while uploading the picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this picture from the gallery?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/pictures/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPictures((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete picture.");
      }
    } catch (err) {
      console.error("Failed to delete picture:", err);
      alert("Error occurred while deleting picture.");
    }
  };

  if (!isAuth) return <div className="min-h-screen bg-slate-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-16">
      {/* Header */}
      <header className="bg-[#c2185b] text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Link href="/admin/dashboard" className="text-white hover:text-pink-200 w-fit">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-lg sm:text-xl font-bold">Manage Pictures Gallery</h1>
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
        {/* Upload Form Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 text-[#c2185b]">
            Upload New Picture
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Picture Title / Caption (Optional)
              </label>
              <RichTextEditor
                value={title}
                onChange={setTitle}
                placeholder="e.g. Community meeting, rally event..."
                minHeight="70px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Image File <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full border border-slate-300 rounded-lg p-2 text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#c2185b] hover:file:bg-pink-100 cursor-pointer"
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Image Preview:
                </p>
                <div className="relative w-48 h-48 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="bg-[#c2185b] hover:bg-[#ad1457] text-white px-6 py-2.5 rounded-lg font-medium shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading Picture...
                </>
              ) : (
                "Upload to Gallery"
              )}
            </button>
          </form>
        </div>

        {/* Gallery List Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Uploaded Pictures ({pictures.length})
            </h2>
            <button
              onClick={fetchPictures}
              className="text-xs text-[#c2185b] hover:underline font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center items-center text-slate-500">
              <div className="w-6 h-6 border-2 border-[#c2185b] border-t-transparent rounded-full animate-spin mr-2"></div>
              Loading gallery...
            </div>
          ) : pictures.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
              <p>No pictures uploaded yet.</p>
              <p className="text-sm mt-1">Upload an image above to display it in the gallery.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pictures.map((pic) => {
                const fullImageUrl = pic.image_url.startsWith("/")
                  ? `${API_BASE_URL}${pic.image_url}`
                  : pic.image_url;

                return (
                  <div
                    key={pic.id}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col group relative"
                  >
                    <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={fullImageUrl}
                        alt={pic.title || "Gallery picture"}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      {pic.title && (
                        <div
                          className="text-xs font-semibold text-slate-800 truncate mb-2 [&>p]:inline [&>p]:m-0"
                          dangerouslySetInnerHTML={{ __html: pic.title.replace(/&nbsp;|\u00A0/g, ' ') }}
                        />
                      )}
                      <button
                        onClick={() => handleDelete(pic.id)}
                        className="w-full text-xs text-red-600 hover:text-white hover:bg-red-600 border border-red-300 rounded py-1.5 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
