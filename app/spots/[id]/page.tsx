"use client";

import { useState, useEffect, use } from 'react';
import { ArrowLeft, ChessQueen, MapPin, Clock, Star, Bookmark, Wifi, Plug, Users, Info, Flame } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { StudySpot } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { API_BASE_URL } from '@/lib/api';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-48 bg-slate-100 animate-pulse rounded-3xl" />
});

export default function SpotDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [spot, setSpot] = useState<StudySpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      // Auth check
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        setUsername(session.user.user_metadata?.username || session.user.email?.split('@')[0]);
        
        // Check if saved
        try {
          const savedRes = await fetch(`${API_BASE_URL}/users/${session.user.id}/saved`);
          const savedData = await savedRes.json();
          if (Array.isArray(savedData)) {
            setIsSaved(savedData.some((s: any) => s.id === parseInt(id)));
          }
        } catch (e) {}
      } else {
        const localUser = localStorage.getItem('username');
        if (localUser) {
          setUsername(localUser);
          try {
            const savedRes = await fetch(`${API_BASE_URL}/users/${localUser}/saved`);
            const savedData = await savedRes.json();
            if (Array.isArray(savedData)) {
              setIsSaved(savedData.some((s: any) => s.id === parseInt(id)));
            }
          } catch (e) {}
        }
      }

      // Fetch spot
      try {
        const response = await fetch(`${API_BASE_URL}/spots/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSpot(data);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error("Failed to fetch spot details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, router]);

  // This gives you the ability to save spots to your profile
  const handleBookmark = async () => {
    const identifier = userId || username;
    if (!identifier) {
      router.push('/login');
      return;
    }

    try {
      if (isSaved) {
        await fetch(`${API_BASE_URL}/users/${identifier}/saved/${id}`, { method: 'DELETE' });
        setIsSaved(false);
      } else {
        await fetch(`${API_BASE_URL}/users/${identifier}/saved/${id}`, { method: 'POST' });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-[#e6f2e7] border-t-[#0f3915] rounded-full animate-spin" />
      </div>
    );
  }

  if (!spot) return null;

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-10">
      {/* Header */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image 
          src={spot.image} 
          alt={spot.name} 
          fill 
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Navigation Actions */}
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          <Link href="/" className="h-12 w-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-lg hover:bg-white transition-all active:scale-95">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </Link>
          <button 
            onClick={handleBookmark}
            className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 border border-[#e6f2e7] ${
              isSaved ? 'bg-[#0f3915] text-white' : 'bg-white/90 backdrop-blur-md text-slate-800'
            }`}
          >
            <Bookmark size={24} strokeWidth={2.5} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Info on header */}
        <div className="absolute bottom-8 left-6 right-6 text-white">
          <div className="hidden md:flex flex-wrap gap-2 mb-3">
             <span className="bg-[#0f3915] text-white px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 backdrop-blur-md">
               <Star size={14} className="fill-white" /> {spot.rating.toFixed(1)}
             </span>
             <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] font-bold border border-white/20">
               {spot.campus || 'General Spot'}
             </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-5xl font-black tracking-tight mb-2 max-w-[90%] md:max-w-none">{spot.name}</h1>
          <p className="hidden md:flex items-center gap-1.5 text-white/90 font-medium">
            <MapPin size={18} /> {spot.location}
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Status Card */}
            <div className="bg-white rounded-[2.5rem] p-5 md:p-8 shadow-xl shadow-slate-200/50 border border-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="hidden sm:flex h-14 w-14 bg-[#e6f2e7] rounded-2xl items-center justify-center text-[#0f3915] shrink-0">
                  <Clock size={28} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-slate-500 text-[12px] md:text-sm font-bold uppercase tracking-wider">Current Status</h3>
                    {/* Mobile Rating Badge */}
                    <div className="md:hidden flex items-center gap-1.5 bg-[#e6f2e7] text-[#0f3915] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#e6f2e7]">
                       <Star size={12} className="fill-[#0f3915]" /> {spot.rating.toFixed(1)}
                    </div>
                  </div>
                  <p className="text-lg md:text-xl font-extrabold text-slate-900 mb-3 sm:mb-0">{spot.status}</p>
                  
                  {/* Mobile Campus & Address */}
                  <div className="md:hidden flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                       <div className="h-5 w-5 bg-slate-100 rounded-md flex items-center justify-center">
                          <MapPin size={12} className="text-slate-500" />
                       </div>
                       {spot.location}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold pl-7">
                       {spot.campus || 'General Spot'}
                    </div>
                  </div>
                </div>
                <div className="sm:ml-auto">
                   <span className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
                     spot.occupancy === 'Low' ? 'bg-[#e6f2e7] text-[#0f3915]' :
                     spot.occupancy === 'Medium' ? 'bg-amber-100 text-amber-700' :
                     'bg-rose-100 text-rose-700'
                   }`}>
                     {spot.occupancy} Occupancy
                   </span>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-10">
                <h3 className="text-base md:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Info size={20} className="text-[#0f3915]" /> Important Information
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {spot.info || "No detailed information available for this spot yet. It's a great place to focus and get work done!"}
                </p>
              </div>

              {/* Vibe Section */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Flame size={16} className="text-[#0f3915]" /> The Vibe
                </h3>
                <p className="text-[#0f3915] text-lg font-bold italic">
                  "{spot.vibes || "A perfect balance of focus and comfort."}"
                </p>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-[2.5rem] p-5 md:p-8 shadow-xl shadow-slate-200/50 border border-white">
              <h3 className="text-base md:text-lg font-black text-slate-900 mb-6">Amenities & Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {spot.tags.map(tag => (
                  <div key={tag} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#e6f2e7] hover:bg-white transition-all">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[#0f3915] shadow-sm group-hover:bg-[#e6f2e7]">
                      {tag.toLowerCase().includes('wifi') ? <Wifi size={18} /> : 
                       tag.toLowerCase().includes('outlet') ? <Plug size={18} /> : 
                       tag.toLowerCase().includes('group') ? <Users size={18} /> : 
                       <ChessQueen size={18} />}
                    </div>
                    <span className="font-bold text-slate-700 text-xs md:text-sm">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Location/Map */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-white sticky top-24">
              <h3 className="text-lg font-black text-slate-900 mb-4">Location</h3>
              <div className="h-64 w-full rounded-3xl overflow-hidden mb-4 border border-slate-100">
                <MapComponent spots={[spot]} center={spot.lat && spot.lng ? [spot.lat, spot.lng] as [number, number] : undefined} zoom={15} />
              </div>
              <p className="text-slate-500 text-sm font-bold mb-6 flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                {spot.location}
              </p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(spot.location)}`, '_blank')}
                className="w-full bg-[#0f3915] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#346037] hover:text-white transition-all active:scale-[0.98] shadow-lg shadow-slate-900/20 border border-[#e6f2e7]"
              >
                Get Directions
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
