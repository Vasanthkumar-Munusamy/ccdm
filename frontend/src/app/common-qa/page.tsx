"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CommonQA = {
  id: number;
  question: string;
};

export default function CommonQAList() {
  const [qas, setQas] = useState<CommonQA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQAs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/common-qa");
        if (res.ok) {
          const data = await res.json();
          setQas(data);
        }
      } catch (err) {
        console.error("Failed to fetch Common QAs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQAs();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-xl md:text-3xl font-bold text-center text-[#c2185b] mb-6 md:mb-10">Common Questions</h1>
        
        {loading ? (
          <p className="text-center text-slate-600">Loading questions...</p>
        ) : qas.length === 0 ? (
          <p className="text-center text-slate-600">No questions available yet. Please check back later.</p>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md flex flex-col gap-4">
            {qas.map(qa => (
              <Link 
                key={qa.id} 
                href={`/common-qa/${qa.id}`}
                className="block text-[#c2185b] hover:text-[#ad1457] hover:underline font-medium text-sm md:text-lg border-b border-pink-100 pb-3 last:border-0 last:pb-0 transition-colors"
                style={{ wordBreak: 'break-word' }}
              >
                {qa.question}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
