"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, MapPin, Bookmark, Plus, Check, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { PROFILE_AVATARS } from '../../lib/data';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [campus, setCampus] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      const user = session.user;
      setEmail(user.email || '');
      setUsername(user.user_metadata?.username || '');
      setCampus(user.user_metadata?.campus || '');
      setAvatarUrl(user.user_metadata?.avatar_url || PROFILE_AVATARS[0]);
      setLoading(false);
    };
    fetchUser();
  }, [router]);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('username'); // Clear legacy login if present
    router.push('/');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      const updates: any = {
        data: {
          username,
          campus,
          avatar_url: avatarUrl
        }
      };

      if (password) {
        updates.password = password;
      }

      if (email) {
        updates.email = email;
      }

      const { data, error } = await supabase.auth.updateUser(updates);

      console.log('Update result:', data, error); // check this in your browser console


      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (password) setPassword(''); // Clear password field after successful update

      const { data: { user: updatedUser } } = await supabase.auth.getUser();

      if (updatedUser) {
        setUsername(updatedUser.user_metadata?.username || '');
        setCampus(updatedUser.user_metadata?.campus || '');
        setAvatarUrl(updatedUser.user_metadata?.avatar_url || PROFILE_AVATARS[0]);
        setEmail(updatedUser.email || '');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center font-sans text-slate-500 font-medium">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 font-sans flex flex-col pt-12 md:pt-20 px-6 pb-20">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center justify-center h-10 w-10 bg-white hover:bg-slate-50 text-slate-600 rounded-full shadow-sm transition-colors border border-slate-200/60">
            <ArrowLeft size={18} strokeWidth={2.5}/>
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Your Profile</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-[14px] font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Quick Actions (Sidebar on desktop) */}
          <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-3 md:gap-4 order-2 md:order-1">
            <Link href="/saved" className="flex-1 bg-white rounded-[1.5rem] p-3 md:p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50 hover:border-[#dae2cb] hover:shadow-md transition-all flex flex-row md:flex-col items-center justify-center gap-3 text-center group cursor-pointer active:scale-[0.98]">
              <div className="h-10 w-10 md:h-14 md:w-14 bg-[#dae2cb] text-[#0f3915] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Bookmark className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5}/>
              </div>
              <div className="text-left md:text-center">
                <h3 className="font-bold text-slate-800 text-[13px] md:text-[16px]">Saved Spots</h3>
                <p className="text-slate-500 text-[12px] md:text-[13px] font-medium hidden md:block">View your bookmarks</p>
              </div>
            </Link>

            <Link href="/addspots" className="flex-1 bg-white rounded-[1.5rem] p-3 md:p-5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50 hover:border-[#dae2cb] hover:shadow-md transition-all flex flex-row md:flex-col items-center justify-center gap-3 text-center group cursor-pointer active:scale-[0.98]">
              <div className="h-10 w-10 md:h-14 md:w-14 bg-[#dae2cb] text-[#0f3915] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5}/>
              </div>
              <div className="text-left md:text-center">
                <h3 className="font-bold text-slate-800 text-[13px] md:text-[16px]">Add a Spot</h3>
                <p className="text-slate-500 text-[12px] md:text-[13px] font-medium hidden md:block">Share a new place</p>
              </div>
            </Link>
          </div>

          {/* Profile Form (Main Content) */}
          <div className="w-full md:w-2/3 bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50 order-1 md:order-2">
            <form onSubmit={handleUpdate} className="flex flex-col gap-6 md:gap-8">
              
              {/* Current Avatar Preview */}
              <div className="flex flex-col items-center mb-2 md:mb-4">
                <div className="relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Current profile picture" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <User size={40} strokeWidth={2.5}/>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-[15px] font-bold text-slate-800 mb-3 md:mb-4">Profile Picture</label>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                  {PROFILE_AVATARS.map((avatar, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(avatar)}
                      className={`relative shrink-0 snap-start h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden border-4 transition-all ${avatarUrl === avatar ? 'border-[#0f3915] scale-[1.02] shadow-md' : 'border-transparent hover:border-[#dae2cb] opacity-80 hover:opacity-100'}`}
                    >
                      <img src={avatar} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                      {avatarUrl === avatar && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Check className="text-white drop-shadow-md" size={28} strokeWidth={3}/>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full my-1"></div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="username" className="block text-[13px] md:text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-2"><User size={16} className="text-slate-400"/> Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your display name"
                    className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#dae2cb] focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-slate-200 shadow-inner focus:border-[#dae2cb]"
                  />
                </div>
                <div>
                  <label htmlFor="campus" className="block text-[13px] md:text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> Campus</label>
                  <input
                    type="text"
                    id="campus"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    placeholder="e.g. Boston College"
                    className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#dae2cb] focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-slate-200 shadow-inner focus:border-[#dae2cb]"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100 w-full my-1"></div>

              {/* Account Security */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="email" className="block text-[13px] md:text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-2"><Mail size={16} className="text-slate-400"/> Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#dae2cb] focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-slate-200 shadow-inner focus:border-[#dae2cb]"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-[13px] md:text-[14px] font-bold text-slate-700 mb-2 flex items-center gap-2"><Lock size={16} className="text-slate-400"/> New Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#dae2cb] focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-slate-200 shadow-inner focus:border-[#dae2cb]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={updating}
                className="w-full bg-[#0f3915] hover:bg-[#0f3915] disabled:bg-[#dae2cb] text-white font-bold text-[15px] md:text-[16px] py-4 rounded-2xl transition-colors shadow-[0_4px_12px_rgba(15,57,21,0.3)] hover:shadow-[0_6px_16px_rgba(15,57,21,0.4)] active:scale-[0.98] mt-4"
              >
                {updating ? "Saving Changes..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-500 font-bold text-[15px] md:text-[16px] py-4 rounded-2xl transition-colors border border-red-100 hover:border-red-200 mt-3"
              >
                <LogOut size={18} strokeWidth={2.5} />
                Log Out
              </button>
            </form>
          </div>
        </div>
        <h3 className="text-slate-500 text-[12px] md:text-sm font-bold tracking-wider">For any questions or to edit or delete spots, contact me at abigailghoch2606@gmail.com</h3>
        <h3 className="text-slate-500 text-[12px] md:text-sm font-bold tracking-wider">Happy Stuying!</h3>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
