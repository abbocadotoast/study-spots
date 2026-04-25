"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Clock, Star, Map as MapIcon, Bookmark, Home as HomeIcon, User, Filter, Navigation, Plus, GraduationCap } from 'lucide-react';
import { initialSpots, StudySpot } from '../lib/data';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [studySpots, setStudySpots] = useState<StudySpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  // Fetch spots from backend
  useEffect(() => {
    const user = localStorage.getItem('username');
    setUsername(user);
    
    const fetchSpots = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/spots");
        const data = await response.json();
        setStudySpots(data);
      } catch (err) {
        console.error("Failed to fetch from Fast API", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  // Filter study spots based on activeFilter
  const filteredSpots = studySpots.filter((spot) => {
    if (activeFilter === 'All') return true;
    return spot.tags.includes(activeFilter);
  });

  const handleBookmark = async (spotId: number) => {
    if (!username) {
      router.push('/login');
      return;
    }
    // Call fast API backend to save the spot
    try {
      await fetch(`http://127.0.0.1:8000/users/${username}/saved/${spotId}`, {
        method: 'POST'
      });
      router.push('/saved');
    } catch (err) {
      console.error("Failed to save spot", err);
    }
  };

  const handleProfileClick = () => {
    if (!username) {
      router.push('/login');
    } else {
      router.push('/saved');
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
              <p className="text-slate-500 text-sm font-semibold mb-1 hidden md:block">Good afternoon,</p>
              <h1 className="text-2xl md:text-[1.7rem] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="md:hidden">Find your focus.</span>
                <span className="hidden md:flex items-center gap-2.5">
                  <span className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <MapIcon size={18} className="text-white shrink-0" strokeWidth={2.5}/>
                  </span>
                  StudySpots
                </span>
              </h1>
            </div>
            {/* Mobile User Avatar */}
            <button onClick={handleProfileClick} className="md:hidden h-12 w-12 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center text-blue-600 transition-colors shadow-sm">
              <User size={22} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative group w-full max-w-2xl flex-1 flex gap-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                className="w-full bg-slate-100/70 text-slate-900 rounded-2xl py-3.5 md:py-3 pl-12 pr-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium placeholder:text-slate-400 border border-transparent focus:border-blue-300 shadow-inner"
                placeholder="Search spots, buildings, or vibes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Filter button for desktop, visible next to search bar */}
            <button className="hidden md:flex h-[46px] px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl items-center justify-center text-slate-600 transition-colors shrink-0 gap-2 font-bold text-sm">
              <Filter size={18} strokeWidth={2.5} />
              Filters
            </button>
          </div>

          {/* Desktop Right Nav Items */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <button onClick={handleSavedClick} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-[14px] transition-colors">
              <Bookmark size={18} strokeWidth={2.5} /> Saved
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <button onClick={handleProfileClick} className="flex items-center gap-3 text-slate-700 font-bold hover:opacity-80 transition-opacity">
              <span>{username ? username : 'Guest'}</span>
              <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full shadow-md text-white flex items-center justify-center p-0.5">
               <div className="bg-white/20 w-full h-full rounded-full flex items-center justify-center">
                 <User size={18} className="text-white" strokeWidth={2.5} />
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
          <div className="flex overflow-x-auto hide-scrollbar gap-2.5 mb-6 lg:mb-8 pb-3 -mx-5 px-5 md:mx-0 md:px-0 snap-x">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`snap-start whitespace-nowrap px-4 md:px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-200/60'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Section title */}
          <div className="flex justify-between items-end mb-5 px-1 flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Top spots nearby</h2>
            <div className="flex items-center gap-3">
              <Link href="/campus" className="text-blue-600 bg-blue-50 text-[13px] md:text-[14px] font-bold hover:bg-blue-100 hover:text-blue-800 px-3 py-1.5 md:py-2 rounded-xl transition-colors flex items-center gap-1.5">
                <GraduationCap size={16} strokeWidth={2.5} /> Campus
              </Link>
              <Link href="/addspots" className="text-white text-[13px] md:text-[14px] font-bold bg-blue-600 hover:bg-blue-700 px-3 py-1.5 md:py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
                <Plus size={16} strokeWidth={2.5} /> Add Spot
              </Link>
              <button className="text-blue-600 text-[14px] font-bold hover:text-blue-800 transition-colors lg:hidden flex items-center gap-1.5">
                <MapIcon size={16} strokeWidth={2.5} /> See map
              </button>
            </div>
          </div>

          {/* Spot Cards List (Grid on tablet, flex list on mobile & desktop side panel) */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-col gap-6">
            {loading ? (
              <div className="text-slate-500 font-medium py-4 px-2">Loading spots...</div>
            ) : filteredSpots.map((spot) => (
              <div key={spot.id} className="bg-white rounded-[2rem] p-3.5 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer active:scale-[0.98] sm:active:scale-[0.99]">
                {/* Image Section */}
                <div className="relative h-48 md:h-52 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100">
                  <Image 
                    src={spot.image} 
                    alt={spot.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    unoptimized 
                  />
                  
                  {/* Badges overlaying image */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-black/5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[13px] font-bold text-slate-800">{spot.rating}</span>
                  </div>
                  
                  {spot.occupancy === 'Low' && (
                    <div className="absolute top-3 left-3 bg-emerald-500/95 backdrop-blur-md px-3 py-1.5 text-white text-[12px] font-bold rounded-full shadow-sm">
                      Plenty of seats
                    </div>
                  )}
                  {spot.occupancy === 'High' && (
                    <div className="absolute top-3 left-3 bg-rose-500/95 backdrop-blur-md px-3 py-1.5 text-white text-[12px] font-bold rounded-full shadow-sm">
                      Almost full
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); handleBookmark(spot.id); }} className="h-10 w-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:text-blue-600 transition-colors">
                      <Bookmark size={18} strokeWidth={2.5}/>
                    </button>
                  </div>
                </div>
                
                {/* Info Section for quick scanning */}
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-slate-900 text-[18px] md:text-xl leading-tight line-clamp-1 pr-4">{spot.name}</h3>
                  </div>
                  
                  <div className="flex items-center text-slate-500 text-[13px] md:text-[14px] font-semibold mb-4 gap-3">
                    <span className="flex items-center gap-1.5"><MapPin size={15} className="text-slate-400 group-hover:text-blue-500 transition-colors"/> {spot.distance}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"><Clock size={14} /> {spot.status}</span>
                  </div>

                  {/* Clear tags */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {spot.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-[12px] md:text-[13px] font-bold px-3 py-1.5 rounded-[12px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
          <div className="w-full h-full bg-slate-200 rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-xl relative cursor-grab">
            {/* Visual map placeholder */}
            <Image 
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" 
              alt="Map View" 
              fill 
              className="object-cover opacity-90 saturate-50" 
              unoptimized 
            />
            {/* Add an overlay to match the brand color slightly */}
            <div className="absolute inset-0 bg-[#F4F7FB]/40 mix-blend-overlay pointer-events-none"></div>

            {/* Fake Pins for UI flair */}
            <div className="absolute top-[30%] left-[40%]">
              <div className="bg-white rounded-full px-3 py-1.5 shadow-lg border border-slate-100 flex items-center gap-1.5 text-sm font-bold text-slate-800 -translate-x-1/2 -translate-y-full hover:bg-slate-50 transition-colors cursor-pointer group">
                <span className="text-amber-500">★</span> 4.8
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[80%] border-[6px] border-transparent border-t-white group-hover:border-t-slate-50"></div>
              </div>
            </div>


            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-lg hover:bg-slate-50 transition-colors">
                <Navigation size={20} strokeWidth={2.5}/>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Floating Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-6 w-full px-6 md:hidden z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-[2rem] p-2 flex justify-between items-center shadow-2xl border border-slate-800">
          <button className="flex flex-col items-center justify-center w-full py-2 bg-slate-800/80 rounded-2xl text-white transition-all">
            <HomeIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full py-2 text-slate-400 hover:text-white transition-all">
            <MapIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Map</span>
          </button>
          <button className="flex flex-col items-center justify-center w-full py-2 text-slate-400 hover:text-white transition-all">
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
