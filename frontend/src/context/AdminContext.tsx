"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

type AdminContextType = {
  isAdmin: boolean;
  adminToken: string | null;
  loginAsAdmin: (token: string) => void;
  logoutAdmin: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function AdminLoginModal({
  onClose,
  onLoginSuccess,
}: {
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid admin username or password");
      }

      const data = await res.json();
      if (!data.token) {
        throw new Error("No token returned by server");
      }

      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message || "Failed to log in as admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-pink-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-[#c2185b] to-[#ad1457] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔐</span>
            <h3 className="font-bold text-lg">Admin Login</h3>
          </div>
          <button
            onClick={onClose}
            className="text-pink-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-xs rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#c2185b] focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 text-sm font-bold text-white bg-[#c2185b] hover:bg-[#ad1457] rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Checking..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Check initial adminToken
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
      setIsAdmin(true);
    }

    const handleStorage = () => {
      const t = localStorage.getItem("adminToken");
      setAdminToken(t);
      setIsAdmin(!!t);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const loginAsAdmin = (token: string) => {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
    setIsAdmin(true);
    setIsLoginModalOpen(false);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    setIsAdmin(false);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminToken,
        loginAsAdmin,
        logoutAdmin,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}

      {isLoginModalOpen && (
        <AdminLoginModal
          onClose={closeLoginModal}
          onLoginSuccess={loginAsAdmin}
        />
      )}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
