"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StudySpot } from '@/lib/data';
import { API_BASE_URL } from '@/lib/api';
import { Home as HomeIcon, Map as MapIcon, Bookmark } from 'lucide-react';
import Link from 'next/link';

const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse" />
});

export default function MapPage() {
  const [spots, setSpots] = useState<StudySpot[]>([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/spots`);
        const data = await response.json();
        setSpots(data);
      } catch (err) {
        console.error("Failed to fetch spots", err);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div className="h-screen w-full relative">
      <div className="absolute inset-0 z-0">
        <MapComponent spots={spots} />
      </div>

      {/* Modern Floating Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-6 w-full px-6 md:hidden z-50">
        <div className="bg-[#0f3915] backdrop-blur-xl rounded-[2rem] p-2 flex justify-between items-center shadow-2xl border border-slate-800">
          <Link href="/" className="flex flex-col items-center justify-center w-full py-2 text-[#647b66] hover:text-white transition-all">
            <HomeIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </Link>
          <button onClick={() => window.location.reload()} className="flex flex-col items-center justify-center w-full py-2 bg-[#2b502e] rounded-2xl text-white transition-all">
            <MapIcon className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Map</span>
          </button>
          <Link href="/saved" className="flex flex-col items-center justify-center w-full py-2 text-[#647b66] hover:text-white transition-all">
            <Bookmark className="h-5 w-5 mb-1" strokeWidth={2.5}/>
            <span className="text-[10px] font-bold tracking-wide">Saved</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
