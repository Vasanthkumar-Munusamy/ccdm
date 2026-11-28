"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import { useAdmin } from "@/context/AdminContext";

type CommonQA = {
  id: number;
  question: string;
  answer: string;
};

type Comment = {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
};

export default function CommonQAAnswer() {
  const { id } = useParams();
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const [qa, setQa] = useState<CommonQA | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nextQa, setNextQa] = useState<CommonQA | null>(null);

  // Admin inline edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);

  const [myCommentIds, setMyCommentIds] = useState<number[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);

    const fetchQAData = async () => {
      try {
        const [qaRes, commentsRes, allQasRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/common-qa/${id}`),
          fetch(`${API_BASE_URL}/api/common-qa/${id}/comments`),
          fetch(`${API_BASE_URL}/api/common-qa`)
        ]);

        if (qaRes.ok) {
          const qaData = await qaRes.json();
          setQa(qaData);
        } else {
          setError(true);
        }

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData || []);
        }

        if (allQasRes.ok) {
          const allQas: CommonQA[] = await allQasRes.json();
          const currentIndex = allQas.findIndex(q => q.id.toString() === id);
          if (currentIndex !== -1 && currentIndex < allQas.length - 1) {
            setNextQa(allQas[currentIndex + 1]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch Common QA data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQAData();

    // Check for saved commenter name in localStorage
    const savedName = localStorage.getItem("commonQACommenterName");
    if (savedName) {
      setNewCommentName(savedName);
      setIsReturningUser(true);
    }

    // Check for owned comments
    const savedCommentIds = localStorage.getItem("commonQAMyCommentIds");
    if (savedCommentIds) {
      try {
        setMyCommentIds(JSON.parse(savedCommentIds));
      } catch (e) {
        console.error("Failed to parse myCommentIds");
      }
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentContent.trim()) return;

    setCommentSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/common-qa/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: newCommentName,
          content: newCommentContent
        })
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setNewCommentContent("");

        // Save name to localStorage and mark as returning user
        localStorage.setItem("commonQACommenterName", newCommentName);
        setIsReturningUser(true);

        // Track ownership
        const newIds = [...myCommentIds, newComment.id];
        setMyCommentIds(newIds);
        localStorage.setItem("commonQAMyCommentIds", JSON.stringify(newIds));
      } else {
        alert("Failed to submit comment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the comment.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleEditSubmit = async (commentId: number) => {
    if (!editingCommentContent.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/common-qa/${id}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingCommentContent })
      });
      if (res.ok) {
        const updatedComment = await res.json();
        setComments(comments.map(c => c.id === commentId ? updatedComment : c));
        setEditingCommentId(null);
        setEditingCommentContent("");
      } else {
        alert("Failed to update comment.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating comment.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/common-qa/${id}/comments/${commentId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
        const newIds = myCommentIds.filter(myId => myId !== commentId);
        setMyCommentIds(newIds);
        localStorage.setItem("commonQAMyCommentIds", JSON.stringify(newIds));
      } else {
        alert("Failed to delete comment.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting comment.");
    }
  };

  const handleOpenEdit = () => {
    if (qa) {
      setEditQuestion(qa.question);
      setEditAnswer(qa.answer);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateQA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/common-qa/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: editQuestion.trim(), answer: editAnswer.trim() }),
      });
      if (res.ok) {
        setQa({ ...qa!, question: editQuestion.trim(), answer: editAnswer.trim() });
        setIsEditModalOpen(false);
      } else {
        alert("Failed to update question.");
      }
    } catch (e) {
      alert("Error updating question.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteQA = async () => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/common-qa/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/common-qa");
      } else {
        alert("Failed to delete question.");
      }
    } catch (e) {
      alert("Error deleting question.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 font-sans">

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/common-qa" className="text-[#c2185b] hover:text-[#ad1457] font-medium flex items-center gap-1">
            <span>←</span> Back to Questions
          </Link>

          {/* Admin Edit/Delete Bar */}
          {isAdmin && qa && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>✏️</span>
                <span>Edit Question & Answer</span>
              </button>
              <button
                onClick={handleDeleteQA}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#c2185b]">
          {loading ? (
            <p className="text-center text-slate-600 py-10">Loading answer...</p>
          ) : error || !qa ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Question Not Found</h2>
              <p className="text-slate-600 mb-6">The question you are looking for does not exist or has been removed.</p>
              <Link href="/common-qa" className="bg-[#c2185b] text-white px-6 py-2 rounded font-medium hover:bg-[#ad1457]">
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

              {nextQa && (
                <div className="mt-10 border-t border-pink-100 pt-6">
                  <Link
                    href={`/common-qa/${nextQa.id}`}
                    className="flex flex-col sm:items-end sm:text-right group"
                  >
                    <span className="text-sm font-semibold text-slate-500 mb-1 group-hover:text-[#c2185b] transition-colors">Next Question →</span>
                    <span className="text-lg font-medium text-[#c2185b] group-hover:text-[#ad1457] group-hover:underline transition-colors" style={{ wordBreak: 'break-word' }}>
                      {nextQa.question}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comments Section */}
        {!loading && !error && qa && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">Comments</h2>

            {/* Post Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 bg-slate-50 p-4 rounded-md border border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3">Leave a comment</h3>

              {isReturningUser ? (
                <div className="mb-4 flex items-center justify-between bg-white p-3 border border-slate-200 rounded">
                  <span className="text-slate-700">
                    Commenting as <strong className="text-slate-900">{newCommentName}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReturningUser(false);
                      setNewCommentName("");
                      localStorage.removeItem("commonQACommenterName");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:border-[#c2185b] text-slate-900"
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <textarea
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:border-[#c2185b] text-slate-900"
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={commentSubmitting}
                className="bg-[#c2185b] hover:bg-[#ad1457] text-white font-medium py-2 px-6 rounded transition-colors disabled:opacity-50"
              >
                {commentSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-slate-500 italic">No comments yet. Be the first to share your thoughts!</p>
              ) : (
                comments.map(comment => {
                  const isOwner = myCommentIds.includes(comment.id);
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="border-b border-slate-100 pb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-slate-800">{comment.author_name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                          {isOwner && !isEditing && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentContent(comment.content);
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="mt-2">
                          <textarea
                            className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:border-[#c2185b] text-slate-900 mb-2"
                            rows={3}
                            value={editingCommentContent}
                            onChange={(e) => setEditingCommentContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSubmit(comment.id)}
                              className="bg-[#c2185b] hover:bg-[#ad1457] text-white text-sm px-4 py-1 rounded transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingCommentId(null);
                                setEditingCommentContent("");
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm px-4 py-1 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 whitespace-pre-wrap">{comment.content}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </main>
      {/* Admin Inline Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-pink-200 my-8">
            <div className="bg-gradient-to-r from-[#c2185b] to-[#ad1457] text-white p-5 flex justify-between items-center">
              <h2 className="font-bold text-lg">Edit Question & Answer</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-pink-100 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateQA} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Answer *
                </label>
                <textarea
                  required
                  rows={10}
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-2.5 px-5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="py-2.5 px-6 text-sm font-bold text-white bg-[#c2185b] hover:bg-[#ad1457] rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
