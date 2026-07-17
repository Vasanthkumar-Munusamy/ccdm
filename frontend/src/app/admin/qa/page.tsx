"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type QA = {
  id: number;
  question: string;
  answer: string;
};

export default function QAManager() {
  const router = useRouter();
  const [qas, setQas] = useState<QA[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuth(true);
      fetchQAs();
    }
  }, [router]);

  const fetchQAs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/qa");
      if (res.ok) {
        const data = await res.json();
        setQas(data);
      }
    } catch (err) {
      console.error("Failed to fetch QAs", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingId 
      ? `http://localhost:8080/api/qa/${editingId}`
      : "http://localhost:8080/api/qa";
      
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer })
      });

      if (res.ok) {
        setQuestion("");
        setAnswer("");
        setEditingId(null);
        fetchQAs();
      } else {
        alert("Failed to save QA");
      }
    } catch (err) {
      console.error("Failed to save QA", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (qa: QA) => {
    setQuestion(qa.question);
    setAnswer(qa.answer);
    setEditingId(qa.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/qa/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchQAs();
      }
    } catch (err) {
      console.error("Failed to delete QA", err);
    }
  };

  if (!isAuth) return <div className="min-h-screen bg-slate-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-[#c2185b] text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-white hover:text-pink-200">← Back</Link>
          <h1 className="text-xl font-bold">Manage Caste Denial Q&A</h1>
        </div>
      </header>
      
      <main className="p-8 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Form Section */}
        <div className="w-full md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingId ? "Edit Q&A" : "Add New Q&A"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                <textarea 
                  value={question} 
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#c2185b]"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                <textarea 
                  value={answer} 
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-[#c2185b]"
                  rows={8}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-[#c2185b] hover:bg-[#ad1457] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {editingId ? "Update" : "Save"}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingId(null);
                      setQuestion("");
                      setAnswer("");
                    }}
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
        <div className="w-full md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Existing Questions ({qas.length})</h2>
            
            {qas.length === 0 ? (
              <p className="text-slate-500">No questions found. Add one on the left!</p>
            ) : (
              <div className="flex flex-col gap-4">
                {qas.map(qa => (
                  <div key={qa.id} className="border border-slate-200 rounded p-4 flex justify-between items-start">
                    <div className="pr-4">
                      <h3 className="font-bold text-slate-800 mb-2">{qa.question}</h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{qa.answer}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button 
                        onClick={() => handleEdit(qa)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(qa.id)}
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
