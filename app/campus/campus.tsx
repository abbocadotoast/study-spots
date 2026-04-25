"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Star, Map as MapIcon, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { StudySpot } from '../../lib/data';

export default function Campus() {
  const [spots, setSpots] = useState<StudySpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState('Boston College');

  const campuses = ['Boston College', 'Suffolk University'];

  useEffect(() => {
    const fetchSpots = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/spots");
        const data = await response.json();
        setSpots(data);
      } catch (err) {
        console.error("Failed to fetch spots", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  // Filter spots based on the selected campus
  // We handle the edge case where older spots might not have a "campus" field,
  // by treating empty/undefined as a match for 'Boston College' for legacy purposes,
  // or simply matching what is on the string.
  const filteredSpots = spots.filter(spot => {
    const spotCampus = spot.campus || 'Boston College';
    return spotCampus === selectedCampus;
  });

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 font-sans pb-10 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 md:pt-8 md:pb-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="h-10 w-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm cursor-pointer">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Near My Campus
          </h1>
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-5 md:px-6 pt-8 flex-1 flex flex-col">
        {/* Campus Selector */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2.5 mb-6 pb-3 snap-x">
          {campuses.map((campus) => (
            <button
              key={campus}
              onClick={() => setSelectedCampus(campus)}
              className={`snap-start whitespace-nowrap px-4 md:px-5 py-3 rounded-2xl text-[14px] font-bold transition-all ${selectedCampus === campus
                ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-200/60'
                }`}
            >
              {campus}
            </button>
          ))}
        </div>

        {/* Spot List */}
        {loading ? (
          <div className="text-slate-500 font-medium py-4 px-2">Loading campus spots...</div>
        ) : filteredSpots.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-8 text-center shadow-sm border border-slate-200/50 mt-4">
            <MapIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h2 className="text-lg font-bold text-slate-800 mb-2">No spots found</h2>
            <p className="text-slate-500">We couldn't find any study spots directly tied to {selectedCampus}. Try adding one!</p>
          </div>
        ) : (
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpots.map((spot) => (
              <div key={spot.id} className="bg-white rounded-[2rem] p-3.5 shadow-sm border border-slate-200/50 hover:border-blue-200 hover:shadow-md transition-all group overflow-hidden">
                {/* Image Section */}
                <div className="relative h-48 w-full rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100">
                  <Image src={spot.image} alt={spot.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" unoptimized />
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
                </div>

                {/* Info Section */}
                <div className="px-2 pb-2">
                  <h3 className="font-extrabold text-slate-900 text-[18px] md:text-xl leading-tight line-clamp-1 mb-2 pr-4">{spot.name}</h3>
                  <div className="flex items-center text-slate-500 text-[13px] md:text-[14px] font-semibold mb-4 gap-3">
                    <span className="flex items-center gap-1.5"><MapPin size={15} className="text-slate-400" /> {spot.distance}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"><Clock size={14} /> {spot.status}</span>
                  </div>
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
          </div>
        )}
      </main>
      <style dangerouslySetInnerHTML={{
        __html: `
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
