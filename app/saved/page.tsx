"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Star, Bookmark, Map as MapIcon, Home as HomeIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { StudySpot } from '../../lib/data';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { API_BASE_URL } from '../../lib/api';

export default function SavedSpots() {
  const router = useRouter();
  const [spots, setSpots] = useState<StudySpot[]>([]);
  const [loading, setLoading] = useState(true);

  // This useEffect fetches the user's saved spots when the component loads.
  // It first ensures the user is logged in, and then makes an API request to the backend.
  useEffect(() => {
    const fetchSavedSpots = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/${session.user.id}/saved`);
        const data = await response.json();
        setSpots(data);
      } catch (err) {
        console.error("Failed to fetch saved spots", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedSpots();
  }, [router]);

  // handleUnsave is called when a user clicks the bookmark icon on a saved spot.
  // It removes the spot from the database and updates the UI instantly by filtering it out.
  const handleUnsave = async (spotId: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      await fetch(`${API_BASE_URL}/users/${session.user.id}/saved/${spotId}`, {
        method: 'DELETE'
      });
      setSpots(prev => prev.filter(s => s.id !== spotId));
    } catch (err) {
      console.error("Failed to unsave spot", err);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 md:pt-8 md:pb-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="h-10 w-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm cursor-pointer">
            <ArrowLeft size={20} strokeWidth={2.5}/>
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Saved Spots
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-6 pt-8">
        {loading ? (
          <div className="text-slate-500 font-medium">Loading saved spots...</div>
        ) : spots.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-sm border border-slate-200/50">
            <Bookmark className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-lg font-bold text-slate-800 mb-2">No spots saved yet</h2>
            <p className="text-slate-500">Go explore and save some spots to see them here.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spots.map((spot) => (
              <Link key={spot.id} href={`/spots/${spot.id}`} className="bg-white rounded-[2rem] p-3.5 shadow-sm border border-slate-200/50 hover:border-[#dae2cb] hover:shadow-md transition-all group overflow-hidden block">
                {/* Image Section */}
                <div className="relative h-48 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100">
                  <Image src={spot.image} alt={spot.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" unoptimized loading="eager" />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-black/5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[13px] font-bold text-slate-800">{spot.rating}</span>
                  </div>
                  
                  <div className="absolute bottom-3 right-3">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleUnsave(spot.id); }} 
                      className="h-10 w-10 bg-[#0f3915] text-white backdrop-blur-md rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 border border-[#e6f2e7]"
                    >
                      <Bookmark size={18} strokeWidth={2.5} fill="currentColor"/>
                    </button>
                  </div>
                </div>
                
                {/* Info Section */}
                <div className="px-2 pb-2">
                  <h3 className="font-extrabold text-slate-900 text-[18px] md:text-xl leading-tight line-clamp-1 mb-2 pr-4 group-hover:text-[#0f3915] transition-colors">{spot.name}</h3>
                  <div className="flex items-center text-slate-500 text-[13px] md:text-[14px] font-semibold mb-4 gap-3">
                    <span className="flex items-center gap-1.5"><MapPin size={15} className="text-slate-400" /> {spot.location}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5 text-[#0f3915] bg-[#e6f2e7] px-2 py-0.5 rounded-md"><Clock size={14} /> {spot.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Modern Floating Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-6 w-full px-6 md:hidden z-50">
        <div className="bg-[#0f3915] backdrop-blur-xl rounded-[2rem] p-2 flex justify-between items-center shadow-2xl border border-slate-800">
          <Link href="/" className="flex flex-col items-center justify-center w-full py-2 text-[#647b66] hover:text-white transition-all">
            <HomeIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </Link>
          <Link href="/map" className="flex flex-col items-center justify-center w-full py-2 text-[#647b66] hover:text-white transition-all">
            <MapIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Map</span>
          </Link>
          <button onClick={() => window.location.reload()} className="flex flex-col items-center justify-center w-full py-2 bg-[#2b502e] rounded-2xl text-white transition-all">
            <Bookmark className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Saved</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
