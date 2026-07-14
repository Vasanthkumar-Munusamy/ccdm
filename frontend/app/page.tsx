"use client";

import { useState } from "react";
import { ArrowRight, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Future API call to Go backend will go here
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden text-slate-900">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Header / Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            Christian Caste Disclaimers <span className="text-blue-600">Movement</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
            Uniting believers in Christ by rejecting caste divisions. Join our community to foster true fellowship, equality, and spiritual growth.
          </p>
          <div className="flex justify-center items-center gap-4 text-blue-700 font-semibold">
            <HeartHandshake size={28} />
            <span>One Faith, One Body</span>
          </div>
        </div>

        {/* Survey Form Section */}
        <div className="w-full max-w-md mx-auto">
          <div className="glass rounded-3xl p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-900/10 hover:-translate-y-1 bg-white/60">
            
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank you!</h3>
                <p className="text-slate-600">Your response has been recorded. We will be in touch soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-blue-600 hover:underline font-medium"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold text-slate-800">Join the Movement</h2>
                  <p className="text-sm text-slate-500 mt-2">Fill out this quick survey to connect with us.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="interest" className="block text-sm font-semibold text-slate-700 mb-1">How would you like to participate?</label>
                    <select 
                      id="interest" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                    >
                      <option value="member">Become a member</option>
                      <option value="volunteer">Volunteer for events</option>
                      <option value="matrimonial">Matrimonial services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1">Message (Optional)</label>
                    <textarea 
                      id="message" 
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="Share your thoughts..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-500/30"
                  >
                    Submit Survey <ArrowRight size={18} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
        
      </main>
    </div>
  );
}
