"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, User } from "lucide-react";

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
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    fetch(`http://localhost:8080/api/articles/${params.id}`)
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
  }, [params.id]);

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

  const imageUrl = article.image_url.startsWith('/') ? `http://localhost:8080${article.image_url}` : article.image_url;

  return (
    <div className="min-h-screen bg-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/articles" className="inline-block text-[#c2185b] hover:text-pink-700 mb-8 font-medium">
          &larr; Back to Articles
        </Link>

        {/* Article Header */}
        <header className="mb-10 text-center">
          <span className="inline-block border border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase px-2 py-1 rounded mb-4">
            {article.category}
          </span>
          <div 
            className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-normal break-words whitespace-pre-wrap [&>p:not(:last-child)]:mb-3" 
            dangerouslySetInnerHTML={{ __html: article.title.replace(/&nbsp;|\u00A0/g, ' ') }} 
          />
          <div className="flex justify-center items-center space-x-6 text-slate-500 font-medium">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{article.author}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-12 w-full h-[300px] md:h-[500px] relative rounded-2xl overflow-hidden shadow-lg">
            <img
              src={imageUrl}
              alt={article.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg md:prose-xl max-w-none text-slate-700 break-words whitespace-pre-wrap bg-pink-50/50 border border-pink-100 rounded-2xl p-6 md:p-10 md:px-12 shadow-sm"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/&nbsp;|\u00A0/g, ' ') }} 
        />
      </div>
    </div>
  );
}
