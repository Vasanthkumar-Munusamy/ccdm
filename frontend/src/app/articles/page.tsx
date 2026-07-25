"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch articles:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-xl md:text-3xl font-bold text-center text-[#c2185b] mb-6 md:mb-10">Take a look at the latest articles</h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8bc34a]"></div>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length === 0 ? (
          <div className="text-center text-slate-500 py-10">No articles available yet.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Link href={`/articles/${article.id}`} key={article.id}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden border border-slate-100 h-full group cursor-pointer">

                  {/* Image Section */}
                  <div className="w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden relative bg-slate-100">
                    <img
                      src={article.image_url.startsWith('/') ? `http://localhost:8080${article.image_url}` : article.image_url}
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-center">
                    <div className="mb-3">
                      <span className="inline-block border border-slate-200 text-slate-600 text-xs font-bold tracking-wider uppercase px-2 py-1 rounded">
                        {article.category}
                      </span>
                    </div>

                    <div 
                      className="text-xl md:text-2xl font-bold text-slate-800 mb-4 line-clamp-3 group-hover:text-[#c2185b] transition-colors break-words whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: article.title.replace(/&nbsp;|\u00A0/g, ' ') }} 
                    />

                    <div className="mt-auto flex items-center text-sm text-slate-500 font-medium">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span>{article.date}</span>
                      <span className="mx-3 text-slate-300">|</span>
                      <span>{article.author}</span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
