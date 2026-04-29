"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { PROFILE_AVATARS } from '../../lib/data';

export default function Login() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") return;
    
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const randomAvatar = PROFILE_AVATARS[Math.floor(Math.random() * PROFILE_AVATARS.length)];
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              avatar_url: randomAvatar
            }
          }
        });
        
        if (signUpError) throw signUpError;
        if (data.session) {
          router.push('/');
        } else if (data.user) {
          setError("Check your email to confirm your account, or disable 'Confirm Email' in Supabase to sign in immediately.");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        
        if (signInError) throw signInError;
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 font-sans flex flex-col pt-20 px-6">
      <div className="max-w-md w-full mx-auto bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center justify-center h-10 w-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors mb-6">
          <ArrowLeft size={18} strokeWidth={2.5}/>
        </Link>
        
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {isSignUp ? "Sign up to save your favorite study spots" : "Log in to continue"}
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-[14px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className="block text-[14px] font-bold text-slate-700 mb-2">Email</label>
            <input
              required
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. abby@example.com"
              className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#dae2cb] focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-slate-200 shadow-inner focus:border-[#dae2cb]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[14px] font-bold text-slate-700 mb-2">Password</label>
            <input
              required
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#dae2cb] focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-slate-200 shadow-inner focus:border-[#dae2cb]"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
              className="w-full bg-[#0f3915] hover:bg-[#0f3915] disabled:bg-[#dae2cb] text-white font-bold text-[16px] py-4 rounded-2xl transition-colors shadow-[0_4px_12px_rgba(15,57,21,0.3)] hover:shadow-[0_6px_16px_rgba(15,57,21,0.4)] active:scale-[0.98] mt-2"
          >
            {loading ? "Please wait..." : (isSignUp ? "Sign Up" : "Log In")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-[14px] font-medium">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="ml-2 text-[#0f3915] hover:text-[#0f3915] font-bold hover:underline transition-all"
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
