"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { useAdmin } from "@/context/AdminContext";
import RichTextEditor from "@/components/RichTextEditor";

type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  content?: string;
};

export default function ArticlesPage() {
  const { isAdmin } = useAdmin();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchArticles = () => {
    fetch(`${API_BASE_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch articles:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setTitle("");
    setCategory("ANSWER TO PUBLIC QUESTION");
    setAuthor("Bro. Agathiyan");

    const today = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    setDate(`${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`);

    setContent("");
    setImageUrl("");
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsModalOpen(true);
  };

  const openEditModal = async (article: Article, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setModalMode("edit");
    setEditingId(article.id);
    setTitle(article.title || "");
    setCategory(article.category || "");
    setAuthor(article.author || "");
    setDate(article.date || "");
    setImageUrl(article.image_url || "");
    setSelectedFile(null);
    setPreviewUrl(
      article.image_url
        ? (article.image_url.startsWith("/") ? `${API_BASE_URL}${article.image_url}` : article.image_url)
        : null
    );
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (article.content) {
      setContent(article.content);
    } else {
      setContent("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`);
        if (res.ok) {
          const fullArticle = await res.json();
          setContent(fullArticle.content || "");
        }
      } catch (err) {
        console.error("Failed to load article detail for edit", err);
      }
    }

    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = imageUrl;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalImageUrl = uploadData.url;
        } else {
          alert("Image upload failed. Please try again.");
          setSubmitting(false);
          return;
        }
      }

      const url =
        modalMode === "edit" && editingId
          ? `${API_BASE_URL}/api/articles/${editingId}`
          : `${API_BASE_URL}/api/articles`;

      const method = modalMode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          author,
          date,
          content,
          image_url: finalImageUrl,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchArticles();
      } else {
        alert(`Failed to ${modalMode === "edit" ? "update" : "create"} article.`);
      }
    } catch (err) {
      console.error("Failed to save article:", err);
      alert("Error occurred while saving article.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        alert("Failed to delete article.");
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
      alert("Error occurred while deleting article.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl md:text-3xl font-bold text-[#c2185b]">
              Take a look at the latest articles
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Read in-depth Christian articles, teachings, and biblical answers.
            </p>
          </div>

          {/* Admin Action: Add New Article */}
          {isAdmin && (
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 bg-[#c2185b] hover:bg-[#ad1457] text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span>➕</span>
                <span>Add Article</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin Bar Notification */}
        {isAdmin && (
          <div className="mb-6 bg-pink-100 border border-pink-300 text-pink-900 text-xs py-2 px-3.5 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span>👑</span>
              <span>
                <strong>Admin Mode Active:</strong> You can add new articles, or edit and delete existing ones directly here. Regular visitors only see the published articles.
              </span>
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c2185b]"></div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No articles available yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {articles.map((article) => (
              <div key={article.id} className="relative group">
                <Link href={`/articles/${article.id}`}>
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden border border-slate-100 h-full cursor-pointer relative">
                    {/* Image Section */}
                    <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative bg-slate-100">
                      {article.image_url ? (
                        <img
                          src={
                            article.image_url.startsWith("/")
                              ? `${API_BASE_URL}${article.image_url}`
                              : article.image_url
                          }
                          alt={article.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="inline-block border border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase px-2 py-1 rounded">
                          {article.category || "General"}
                        </span>
                      </div>

                      <div
                        className="text-xl md:text-2xl font-bold text-slate-800 mb-4 line-clamp-3 group-hover:text-[#c2185b] transition-colors break-words whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: (article.title || "").replace(/&nbsp;|\u00A0/g, " "),
                        }}
                      />

                      <div className="mt-auto flex items-center text-sm text-slate-500 font-medium">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{article.date}</span>
                        {article.author && (
                          <>
                            <span className="mx-3 text-slate-300">|</span>
                            <span>{article.author}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Admin Action Buttons on Card */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm p-1 rounded-lg border border-slate-200 shadow-md">
                    <button
                      onClick={(e) => openEditModal(article, e)}
                      className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                      title="Edit Article"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(article.id, e)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                      title="Delete Article"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Article Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in duration-150">
              {/* Modal Header */}
              <div className="bg-[#c2185b] text-white p-4 px-6 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>{modalMode === "edit" ? "✏️" : "➕"}</span>
                  <span>{modalMode === "edit" ? "Edit Article" : "Add New Article"}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-white hover:text-pink-200 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Title (Rich Text) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={title}
                    onChange={setTitle}
                    placeholder="Enter article title..."
                    minHeight="60px"
                    maxHeight="110px"
                  />
                </div>

                {/* Category, Author, Date Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Q & A, Teaching"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Bro. Agathiyan"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. 28 Nov 2026"
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                    />
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Cover Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-[#c2185b] hover:file:bg-pink-100 cursor-pointer"
                    />
                    {previewUrl && (
                      <div className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 flex-shrink-0">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content (Rich Text) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Article Content
                  </label>
                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write article content here..."
                    minHeight="320px"
                    maxHeight="550px"
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-[#c2185b] hover:bg-[#ad1457] disabled:opacity-50 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                  >
                    {submitting && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span>{modalMode === "edit" ? "Save Changes" : "Publish Article"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
