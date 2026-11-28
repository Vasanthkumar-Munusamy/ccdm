"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import { useAdmin } from "@/context/AdminContext";

type QA = {
  id: number;
  question: string;
  answer?: string;
};

export default function CasteDenialQAList() {
  const { isAdmin } = useAdmin();
  const [qas, setQas] = useState<QA[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [questionInput, setQuestionInput] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const fetchQAs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/qa`);
      if (res.ok) {
        const data = await res.json();
        setQas(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch QAs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQAs();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setQuestionInput("");
    setAnswerInput("");
    setIsModalOpen(true);
  };

  const openEditModal = async (qa: QA) => {
    setEditingId(qa.id);
    setQuestionInput(qa.question);
    setAnswerInput(qa.answer || "");
    setIsModalOpen(true);

    // If answer not yet loaded, fetch from detail endpoint
    if (!qa.answer) {
      setFetchingDetails(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/qa/${qa.id}`);
        if (res.ok) {
          const detailed = await res.json();
          setAnswerInput(detailed.answer || "");
        }
      } catch (e) {
        console.error("Failed to fetch full answer", e);
      } finally {
        setFetchingDetails(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim() || !answerInput.trim()) return;

    setSubmitting(true);
    const url = editingId
      ? `${API_BASE_URL}/api/qa/${editingId}`
      : `${API_BASE_URL}/api/qa`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionInput.trim(),
          answer: answerInput.trim(),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        setQuestionInput("");
        setAnswerInput("");
        fetchQAs();
      } else {
        alert("Failed to save Caste Denial Question. Please check server status.");
      }
    } catch (err) {
      console.error("Failed to save QA", err);
      alert("Error occurred while saving question.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, questionText: string) => {
    if (!confirm(`Are you sure you want to delete this question?\n\n"${questionText}"`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/qa/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQas((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete question.");
      }
    } catch (err) {
      console.error("Failed to delete QA", err);
      alert("Error occurred while deleting question.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans">
      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-10">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl md:text-3xl font-bold text-[#c2185b]">Caste Denial Q & A</h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Biblical questions and answers against caste discrimination in Christian life.
            </p>
          </div>

          {/* Admin Action: Add New Question */}
          {isAdmin && (
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 bg-[#c2185b] hover:bg-[#ad1457] text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span>➕</span>
                <span>Add Question</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin Bar Notification */}
        {isAdmin && (
          <div className="mb-4 bg-pink-100 border border-pink-300 text-pink-900 text-xs py-2 px-3.5 rounded-lg flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <span>👑</span>
              <span><strong>Admin Mode Active:</strong> You can add, edit, or delete questions directly here. Regular visitors only see the contents.</span>
            </span>
          </div>
        )}

        {/* Content List */}
        {loading ? (
          <p className="text-center text-slate-600">Loading questions...</p>
        ) : qas.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-slate-600">
            <p>No questions available yet.</p>
            {isAdmin && (
              <button
                onClick={openAddModal}
                className="mt-3 inline-block bg-[#c2185b] text-white text-xs px-4 py-2 rounded font-medium hover:bg-[#ad1457]"
              >
                + Add the first question
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-md flex flex-col divide-y divide-pink-100">
            {qas.map((qa) => (
              <div
                key={qa.id}
                className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 group"
              >
                <Link
                  href={`/caste-denial-qa/${qa.id}`}
                  className="flex-1 text-[#c2185b] hover:text-[#ad1457] hover:underline font-medium text-sm md:text-lg transition-colors leading-snug"
                  style={{ wordBreak: "break-word" }}
                >
                  {qa.question}
                </Link>

                {/* Admin Inline Action Buttons */}
                {isAdmin && (
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                    <button
                      onClick={() => openEditModal(qa)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit this question and answer"
                    >
                      <span>✏️</span>
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(qa.id, qa.question)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Delete this question"
                    >
                      <span>🗑️</span>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Admin Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-pink-200 my-8">
            <div className="bg-gradient-to-r from-[#c2185b] to-[#ad1457] text-white p-5 flex justify-between items-center">
              <h2 className="font-bold text-lg">
                {editingId ? "Edit Caste Denial Question & Answer" : "Add New Caste Denial Question"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-pink-100 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              {fetchingDetails && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                  Loading answer content...
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question *
                </label>
                <textarea
                  required
                  rows={2}
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="Enter question text..."
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Answer *
                </label>
                <textarea
                  required
                  rows={8}
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Enter full answer explanation..."
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 px-6 text-sm font-bold text-white bg-[#c2185b] hover:bg-[#ad1457] rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving..." : editingId ? "Update Question" : "Save Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
