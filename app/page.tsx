"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Search, MapPin, Clock, Star, Map as MapIcon, Bookmark, Home as HomeIcon, User, Filter, Navigation, Plus, GraduationCap } from 'lucide-react';
import { initialSpots, StudySpot } from '../lib/data';
import { supabase } from '../lib/supabase';
import { API_BASE_URL } from '../lib/api';

const MapComponent = dynamic(() => import('../components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-[2.5rem]" />
});

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [studySpots, setStudySpots] = useState<StudySpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [savedSpotIds, setSavedSpotIds] = useState<number[]>([]);

  // Fetch spots from backend and sync with Supabase session
  useEffect(() => {
    const fetchUserAndSpots = async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUsername(session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User');
        setAvatarUrl(session.user.user_metadata?.avatar_url || null);
        setUserId(session.user.id);

        // Fetch saved spot IDs for this user
        try {
          const savedRes = await fetch(`${API_BASE_URL}/users/${session.user.id}/saved`);
          const savedData = await savedRes.json();
          if (Array.isArray(savedData)) {
            setSavedSpotIds(savedData.map((s: any) => s.id));
          }
        } catch (e) {
          console.error("Failed to fetch saved spots", e);
        }
      } else {
        // Fallback to localStorage for guest/legacy users
        const localUser = localStorage.getItem('username');
        setUsername(localUser);
        if (localUser) {
           try {
            const savedRes = await fetch(`${API_BASE_URL}/users/${localUser}/saved`);
            const savedData = await savedRes.json();
            if (Array.isArray(savedData)) {
              setSavedSpotIds(savedData.map((s: any) => s.id));
            }
          } catch (e) {}
        }
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUsername(session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User');
          setAvatarUrl(session.user.user_metadata?.avatar_url || null);
          setUserId(session.user.id);
        } else {
          setUsername(null);
          setAvatarUrl(null);
          setUserId(null);
          setSavedSpotIds([]);
        }
      });

      try {
        const response = await fetch(`${API_BASE_URL}/spots`);
        const data = await response.json();
        setStudySpots(data);
      } catch (err) {
        console.error("Failed to fetch from Fast API", err);
      } finally {
        setLoading(false);
      }

      return () => subscription.unsubscribe();
    };
    
    fetchUserAndSpots();
  }, []);

  // Filter study spots based on activeFilter
  const filteredSpots = studySpots.filter((spot) => {
    if (activeFilter === 'All') return true;
    return spot.tags.includes(activeFilter);
  });

  const handleBookmark = async (spotId: number) => {
    // Prefer Supabase ID, fallback to username for legacy
      const identifier = userId || username;
    
    if (!identifier) {
      router.push('/login');
      return;
    }

    const isSaved = savedSpotIds.includes(spotId);
    
    try {
      if (isSaved) {
        // Unsave logic
        await fetch(`${API_BASE_URL}/users/${identifier}/saved/${spotId}`, {
          method: 'DELETE'
        });
        setSavedSpotIds(prev => prev.filter(id => id !== spotId));
      } else {
        // Save logic
        await fetch(`${API_BASE_URL}/users/${identifier}/saved/${spotId}`, {
          method: 'POST'
        });
        setSavedSpotIds(prev => [...prev, spotId]);
      }
    } catch (err) {
      console.error("Failed to toggle bookmark", err);
    }
  };

  const handleProfileClick = () => {
    if (!username) {
      router.push('/login');
    } else {
      router.push('/profile');
    }
  };

  const handleSavedClick = () => {
    if (!username) {
      router.push('/login');
    } else {
      router.push('/saved');
    }
  };


  const filters = ['All', 'Quiet', 'Good for groups', 'Open late', 'Outlets', 'Coffee nearby'];

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 font-sans pb-28 md:pb-8 flex flex-col">
      {/* Header section (Responsive: Curved bottom on mobile, flat on desktop) */}
      <header className="bg-white px-6 pt-12 pb-8 sm:pt-6 sm:pb-6 rounded-b-[2.5rem] md:rounded-b-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] md:shadow-sm mb-6 md:mb-0 md:sticky md:top-0 z-40 border-b border-transparent md:border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 lg:gap-10">
          
          {/* Top nav / Brand */}
          <div className="flex justify-between items-center w-full md:w-auto shrink-0">
            <div>
              <p className="text-slate-500 text-sm font-semibold mb-1 hidden md:block">Find Your Focus</p>
              <h1 className="text-xl md:text-[1.7rem] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="md:hidden">Find Your Focus.</span>
                <span className="hidden md:flex items-center gap-2.5">
                  <span className="h-8 w-8 bg-[#0f4f15] rounded-xl flex items-center justify-center shadow-lg shadow-[#0f4f15]/30">
                    <MapIcon size={18} className="text-white shrink-0" strokeWidth={2.5}/>
                  </span>
                  StudySpots
                </span>
              </h1>
            </div>
            {/* Mobile User Avatar */}
            <button onClick={handleProfileClick} className="md:hidden flex items-center gap-3 text-slate-700 font-bold hover:opacity-80 transition-opacity">
              <div className="h-10 w-10 bg-gradient-to-tr from-[#0f3915] to-[#0f4f15] rounded-full shadow-md text-white flex items-center justify-center p-0.5 overflow-hidden">
               <div className="bg-white/20 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                 {avatarUrl ? (
                   <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <User size={18} className="text-white" strokeWidth={2.5} />
                 )}
               </div>
              </div>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative group w-full max-w-2xl flex-1 flex gap-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                className="w-full bg-slate-100/70 text-slate-900 rounded-2xl py-3.5 md:py-3 pl-12 pr-4 focus:outline-none focus:ring-[3px] focus:ring-slate-900 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-transparent focus:border-slate-900 shadow-inner"
                placeholder="Search spots, buildings, or vibes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Right Nav Items */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <button onClick={handleSavedClick} className="flex items-center gap-2 text-slate-500 hover:text-[#0f3915] font-bold text-[14px] transition-colors">
              <Bookmark size={18} strokeWidth={2.5} /> Saved
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button onClick={handleProfileClick} className="flex items-center gap-3 text-slate-700 font-bold hover:opacity-80 transition-opacity">
              <span>{username ? username : 'Guest'}</span>
              <div className="h-10 w-10 bg-gradient-to-tr from-[#0f3915] to-[#0f4f15] rounded-full shadow-md text-white flex items-center justify-center p-0.5 overflow-hidden">
               <div className="bg-white/20 w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                 {avatarUrl ? (
                   <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                 ) : (
                   <User size={18} className="text-white" strokeWidth={2.5} />
                 )}
               </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Container (Split View on Large Desktop, Flow on Mobile/Tablet) */}
      <main className="max-w-7xl mx-auto px-5 md:px-6 w-full flex-1 flex flex-col lg:flex-row gap-8 lg:py-6">
        
        {/* Left Column: Spots Feed */}
        <div className="w-full lg:w-[500px] xl:w-[580px] shrink-0 flex flex-col">

          {/* Quick Filters */}

          <div className="relative">
            <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-16 z-10 bg-gradient-to-r from-transparent to-[#f4f7fb] hidden md:block" />

            <div className="flex overflow-x-auto hide-scrollbar gap-2.5 mb-6 lg:mb-8 pb-3 -mx-5 px-5 md:mx-0 md:px-0 snap-x">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`snap-start whitespace-nowrap px-4 md:px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all ${
                    activeFilter === filter
                      ? 'bg-[#0f4f15] text-white shadow-[#e6f2e7]'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-200/60'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Section title */}
          <div className="flex justify-between items-end mb-5 px-1 flex-wrap gap-4">
            <h2 className="text-lg md:text-2xl font-extrabold text-slate-900 tracking-tight">Top spots nearby</h2>
            <div className="flex items-center gap-3">
              <Link href="/campus" className="text-[12px] md:text-[14px] font-bold text-[#0f4f15] bg-[#d1e8d3] hover:bg-[#0f4f15] hover:text-[#ffffff] px-3 py-1.5 md:py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <GraduationCap size={16} strokeWidth={2.5} /> Campus
              </Link>
            </div>
          </div>

          {/* Spot Cards List (Grid on tablet, flex list on mobile & desktop side panel) */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-6">
            {loading ? (
              <div className="text-slate-500 font-medium py-4 px-2">Loading spots...</div>
            ) : filteredSpots.map((spot) => (
              <Link key={spot.id} href={`/spots/${spot.id}`} id={`spot-${spot.id}`} className="bg-white rounded-[2rem] p-3.5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50 hover:border-[#0f3915]/20 hover:shadow-md transition-all group cursor-pointer active:scale-[0.98] sm:active:scale-[0.99] scroll-mt-24 block">
                {/* Image Section */}
                <div className="relative h-48 md:h-52 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100">
                  <Image 
                    src={spot.image} 
                    alt={spot.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    unoptimized 
                    loading="eager"
                  />
                  
                  {/* Badges overlaying image */}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/95 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 shadow-sm border border-black/5">
                    <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[11px] md:text-[13px] font-bold text-slate-800">{spot.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 transition-opacity ${savedSpotIds.includes(spot.id) ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBookmark(spot.id); }} 
                      className={`h-8 w-8 md:h-10 md:w-10 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center transition-all border border-[#e6f2e7] ${
                        savedSpotIds.includes(spot.id) 
                          ? 'bg-[#0f3915] text-white' 
                          : 'bg-white/80 text-slate-600 hover:bg-white hover:text-[#0f3915]'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2.5} fill={savedSpotIds.includes(spot.id) ? "currentColor" : "none"}/>
                    </button>
                  </div>
                </div>
                
                {/* Info Section for quick scanning */}
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-slate-900 text-base md:text-xl leading-tight line-clamp-1 pr-4 group-hover:text-[#0f3915] transition-colors">{spot.name}</h3>
                  </div>
                  
                  <div className="flex items-center text-slate-500 text-xs md:text-[14px] font-semibold mb-4 gap-3">
                    <span className="flex items-center gap-1.5 text-[#0f3915] bg-[#e6f2e7] px-2 py-0.5 rounded-md"><Clock size={14} /> {spot.status}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {spot.location}</span>
                  </div>

                  {/* Clear tags */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {spot.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-[11px] md:text-[13px] font-bold px-3 py-1.5 rounded-[12px]">
                        {tag}
                      </span>
                    ))}
                    {spot.tags.length > 3 && (
                      <span className="text-slate-400 text-[12px] font-bold py-1.5">+{spot.tags.length - 3}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {!loading && filteredSpots.length === 0 && (
              <div className="text-slate-500 font-medium py-4 px-2 text-center bg-white rounded-[2rem] border border-slate-200/50 p-6">
                No spots matched your filter. Be the first to add one!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Desktop Map Panel */}
        <div className="hidden lg:block flex-1 h-[calc(100vh-140px)] sticky top-[108px]">
          <MapComponent spots={studySpots} />
        </div>
      </main>

      {/* Modern Floating Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-6 w-full px-6 md:hidden z-50">
        <div className="bg-[#0f3915] backdrop-blur-xl rounded-[2rem] p-2 flex justify-between items-center shadow-2xl border border-slate-800">
          <button onClick={() => window.location.reload()} className="flex flex-col items-center justify-center w-full py-2 bg-[#2b502e] rounded-2xl text-white transition-all">
            <HomeIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </button>
          <Link href="/map" className="flex flex-col items-center justify-center w-full py-2 text-[#647b66] hover:text-white transition-all">
            <MapIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Map</span>
          </Link>
          <button onClick={handleSavedClick} className="flex flex-col items-center justify-center w-full py-2 text-[#647b66] hover:text-white transition-all">
            <Bookmark className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Saved</span>
          </button>
        </div>
      </nav>

      {/* Global utility styles scoped to this file context */}
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
