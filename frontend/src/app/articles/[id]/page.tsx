"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, User } from "lucide-react";
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
  content: string;
};

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin } = useAdmin();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const fetchArticle = () => {
    if (!params.id) return;
    fetch(`${API_BASE_URL}/api/articles/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article not found");
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch article:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const handleOpenEdit = () => {
    if (!article) return;
    setTitle(article.title || "");
    setCategory(article.category || "");
    setAuthor(article.author || "");
    setDate(article.date || "");
    setContent(article.content || "");
    setImageUrl(article.image_url || "");
    setSelectedFile(null);
    setPreviewUrl(
      article.image_url
        ? (article.image_url.startsWith("/") ? `${API_BASE_URL}${article.image_url}` : article.image_url)
        : null
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsEditModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !title.trim()) {
      alert("Please enter article title.");
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

      const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
        method: "PUT",
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
        const updatedArticle = await res.json();
        setArticle(updatedArticle);
        setIsEditModalOpen(false);
      } else {
        alert("Failed to update article.");
      }
    } catch (err) {
      console.error("Failed to update article:", err);
      alert("Error occurred while updating article.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!article) return;
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/articles");
      } else {
        alert("Failed to delete article.");
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
      alert("Error occurred while deleting article.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c2185b]"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Article Not Found</h1>
        <button onClick={() => router.push("/articles")} className="text-[#c2185b] underline">
          Go back to articles
        </button>
      </div>
    );
  }

  const imageUrlFormatted = article.image_url
    ? article.image_url.startsWith("/")
      ? `${API_BASE_URL}${article.image_url}`
      : article.image_url
    : null;

  return (
    <div className="min-h-screen bg-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation & Admin Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Link href="/articles" className="inline-block text-[#c2185b] hover:text-pink-700 font-medium">
            &larr; Back to Articles
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                ✏️ Edit Article
              </button>
              <button
                onClick={handleDeleteArticle}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                🗑️ Delete Article
              </button>
            </div>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-10 text-center">
          {article.category && (
            <span className="inline-block border border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase px-2 py-1 rounded mb-4">
              {article.category}
            </span>
          )}
          <div
            className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-normal break-words whitespace-pre-wrap [&>p:not(:last-child)]:mb-3"
            dangerouslySetInnerHTML={{ __html: (article.title || "").replace(/&nbsp;|\u00A0/g, " ") }}
          />
          <div className="flex justify-center items-center space-x-6 text-slate-500 font-medium">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{article.date}</span>
            </div>
            {article.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{article.author}</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {imageUrlFormatted && (
          <div className="mb-12 w-full h-[300px] md:h-[500px] relative rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <img
              src={imageUrlFormatted}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Article Content */}
        <div
          className="prose prose-lg md:prose-xl max-w-none text-slate-700 break-words whitespace-pre-wrap bg-pink-50/50 border border-pink-100 rounded-2xl p-6 md:p-10 md:px-12 shadow-sm"
          dangerouslySetInnerHTML={{ __html: (article.content || "").replace(/&nbsp;|\u00A0/g, " ") }}
        />

        {/* Edit Article Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in duration-150">
              {/* Modal Header */}
              <div className="bg-[#c2185b] text-white p-4 px-6 flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>✏️</span>
                  <span>Edit Article</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-white hover:text-pink-200 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleUpdateArticle} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Title (Rich Text) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={title}
                    onChange={setTitle}
                    placeholder="Enter article title..."
                    minHeight="90px"
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
                    minHeight="220px"
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-[#c2185b] hover:bg-[#ad1457] disabled:opacity-50 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {submitting && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span>Save Changes</span>
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
