"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type QA = {
  id: number;
  question: string;
  answer: string;
};

export default function CasteDenialQAAnswer() {
  const { id } = useParams();
  const router = useRouter();
  const [qa, setQa] = useState<QA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchQA = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/qa/${id}`);
        if (res.ok) {
          const data = await res.json();
          setQa(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch QA details", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQA();
  }, [id]);

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-6">
          <Link href="/caste-denial-qa" className="text-[#c2185b] hover:text-[#ad1457] font-medium flex items-center gap-1">
            <span>←</span> Back to Questions
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#c2185b]">
          {loading ? (
            <p className="text-center text-slate-600 py-10">Loading answer...</p>
          ) : error || !qa ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Question Not Found</h2>
              <p className="text-slate-600 mb-6">The question you are looking for does not exist or has been removed.</p>
              <Link href="/caste-denial-qa" className="bg-[#c2185b] text-white px-6 py-2 rounded font-medium hover:bg-[#ad1457]">
                Return to Q&A List
              </Link>
            </div>
          ) : (
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 pb-4 border-b border-slate-200" style={{ wordBreak: 'break-word' }}>
                {qa.question}
              </h1>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm md:text-lg">
                {qa.answer}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
