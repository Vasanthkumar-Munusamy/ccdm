"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) return <div className="min-h-screen bg-slate-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-[#c2185b] text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
          }}
          className="text-sm bg-[#ad1457] hover:bg-pink-800 px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>
      
      <main className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome, Admin</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link href="/admin/qa" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-slate-200">
            <h3 className="text-lg font-bold text-[#c2185b] mb-2">Caste Denial Q & A</h3>
            <p className="text-slate-600 text-sm">Manage questions and answers shown on the public website.</p>
          </Link>
          <Link href="/admin/common-qa" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-slate-200">
            <h3 className="text-lg font-bold text-[#c2185b] mb-2">Common Questions</h3>
            <p className="text-slate-600 text-sm">Manage common questions shown on the public website.</p>
          </Link>
          <Link href="/admin/articles" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-slate-200">
            <h3 className="text-lg font-bold text-[#c2185b] mb-2">Articles</h3>
            <p className="text-slate-600 text-sm">Manage articles and upload images for the public website.</p>
          </Link>
          <Link href="/admin/matrimony" className="block bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-slate-200">
            <h3 className="text-lg font-bold text-[#c2185b] mb-2">Matrimonial Profiles</h3>
            <p className="text-slate-600 text-sm">Manage and delete uploaded biodata profiles.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
