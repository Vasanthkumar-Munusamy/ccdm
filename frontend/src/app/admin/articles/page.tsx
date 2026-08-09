"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['color', 'background'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
    handlers: {
      color: function () {
        let input = document.getElementById('hidden-color-picker') as HTMLInputElement;
        if (!input) {
          input = document.createElement('input');
          input.setAttribute('type', 'color');
          input.setAttribute('id', 'hidden-color-picker');
          input.style.position = 'absolute';
          input.style.opacity = '0';
          input.style.pointerEvents = 'none';
          document.body.appendChild(input);
        }
        input.onchange = () => {
          // @ts-ignore
          this.quill.format('color', input.value);
        };
        input.click();
      },
      background: function () {
        let input = document.getElementById('hidden-bg-picker') as HTMLInputElement;
        if (!input) {
          input = document.createElement('input');
          input.setAttribute('type', 'color');
          input.setAttribute('id', 'hidden-bg-picker');
          input.style.position = 'absolute';
          input.style.opacity = '0';
          input.style.pointerEvents = 'none';
          document.body.appendChild(input);
        }
        input.onchange = () => {
          // @ts-ignore
          this.quill.format('background', input.value);
        };
        input.click();
      }
    }
  }
};

type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  content: string;
};

export default function ArticlesManager() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuth(true);
      fetchArticles();
    }
    
    // Inject custom text icons for the color buttons since they are now simple buttons instead of dropdowns
    setTimeout(() => {
      document.querySelectorAll('button.ql-color').forEach(btn => {
        if (!btn.innerHTML.includes('font-weight:bold')) {
          btn.innerHTML = '<span style="font-weight:bold; color:#ff0000; font-size: 14px; text-decoration:underline;">A</span>';
          (btn as HTMLElement).title = "Text Color";
        }
      });
      document.querySelectorAll('button.ql-background').forEach(btn => {
        if (!btn.innerHTML.includes('font-weight:bold')) {
          btn.innerHTML = '<span style="font-weight:bold; background-color:#ffeb3b; color:#000; padding:0 2px; font-size: 12px;">Bg</span>';
          (btn as HTMLElement).title = "Background Color";
        }
      });
    }, 500); // Wait slightly for Quill to mount

  }, [router]);

  const fetchArticles = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/articles");
      if (res.ok) {
        const data = await res.json();
        setArticles(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch Articles", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (err) {
      console.error("Failed to upload image", err);
    } finally {
      setUploading(false);
    }
    return null;
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("");
    setAuthor("");
    setDate("");
    setContent("");
    setImageUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // First, upload the image if a new one is selected
    let finalImageUrl = imageUrl;
    if (selectedFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        alert("Image upload failed. Cannot save article.");
        setLoading(false);
        return;
      }
    }

    const url = editingId
      ? `http://localhost:8080/api/articles/${editingId}`
      : "http://localhost:8080/api/articles";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          author,
          date,
          content,
          image_url: finalImageUrl
        })
      });

      if (res.ok) {
        resetForm();
        fetchArticles();
      } else {
        alert("Failed to save Article");
      }
    } catch (err) {
      console.error("Failed to save Article", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setAuthor(article.author);
    setDate(article.date);
    setContent(article.content);
    setImageUrl(article.image_url);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/articles/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error("Failed to delete Article", err);
    }
  };

  if (!isAuth) return <div className="min-h-screen bg-slate-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-[#c2185b] text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Link href="/admin/dashboard" className="text-white hover:text-pink-200 w-fit">← Back</Link>
          <h1 className="text-lg sm:text-xl font-bold">Manage Articles</h1>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">

        {/* Form Section */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4">
              {editingId ? "Edit Article" : "Add New Article"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <div className="bg-white text-slate-900 border border-slate-300 rounded">
                  <ReactQuill theme="snow" value={title} onChange={setTitle} modules={quillModules} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Q & A"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#c2185b]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. 27 Mar 2023"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#c2185b]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Bro. Agustine"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#c2185b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Suitable Image for the Article</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-[#c2185b]"
                />
                {imageUrl && !selectedFile && (
                  <div className="mt-2 text-xs text-green-600 font-medium break-all">
                    Current Image: {imageUrl}
                  </div>
                )}
                {selectedFile && (
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    New file selected: {selectedFile.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <div className="bg-white text-slate-900 border border-slate-300 rounded pb-12 mb-4">
                  <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} className="h-64" />
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 bg-[#c2185b] hover:bg-[#ad1457] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : (editingId ? "Update Article" : "Save Article")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-2 px-4 rounded transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4">Published Articles ({articles.length})</h2>

            {articles.length === 0 ? (
              <p className="text-slate-500">No articles found. Add one on the left!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {articles.map(article => (
                  <div key={article.id} className="border border-slate-200 rounded p-4 flex flex-col sm:flex-row items-center gap-4">
                    {/* Tiny thumbnail */}
                    {article.image_url && (
                      <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-slate-100 rounded overflow-hidden">
                        <img
                          src={article.image_url.startsWith('/') ? `http://localhost:8080${article.image_url}` : article.image_url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="w-full flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#c2185b] uppercase tracking-wider mb-1">
                        {article.category} &bull; {article.date}
                      </div>
                      <div className="font-bold text-slate-800 mb-1 text-sm sm:text-base line-clamp-1 break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: article.title.replace(/&nbsp;|\u00A0/g, ' ') }} />
                      <p className="text-slate-500 text-xs sm:text-sm line-clamp-2">By {article.author}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-end border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                      <button
                        onClick={() => handleEdit(article)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
