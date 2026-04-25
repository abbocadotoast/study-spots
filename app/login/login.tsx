"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  
  // State for username input
  const [username, setUsername] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "") return;
    
    // Save username to localStorage as our "mock authentication" token
    localStorage.setItem('username', username.trim());
    
    // Redirect back to home
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 font-sans flex flex-col pt-20 px-6">
      <div className="max-w-md w-full mx-auto bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center justify-center h-10 w-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors mb-6">
          <ArrowLeft size={18} strokeWidth={2.5}/>
        </Link>
        
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
        <p className="text-slate-500 font-medium mb-8">Enter a username to continue (Mock Auth).</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label htmlFor="username" className="block text-[14px] font-bold text-slate-700 mb-2">Username</label>
            <input
              required
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Abby"
              className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-slate-200 shadow-inner focus:border-blue-300"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[16px] py-4 rounded-2xl transition-colors shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] active:scale-[0.98]"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
