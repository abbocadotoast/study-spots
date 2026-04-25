"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddSpot() {
  const router = useRouter();
  
  // Local state for the form inputs
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: 5,
    distance: '',
    status: '',
    tags: '',
    occupancy: 'Medium',
    campus: 'Boston College'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process tags from comma separated string to array
    const processedTags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    // Set default image if none provided
    const image = formData.image.trim() !== '' 
      ? formData.image 
      : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'; 
      
    // Create new spot payload matching FastAPI schema
    const newSpot = {
      name: formData.name,
      image: image,
      rating: Number(formData.rating),
      distance: formData.distance,
      status: formData.status,
      tags: processedTags.length > 0 ? processedTags : ['Study'],
      occupancy: formData.occupancy,
      campus: formData.campus
    };
    
    // POST data to FastAPI backend
    try {
      await fetch("http://127.0.0.1:8000/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpot),
      });
      // Redirect to home page upon success
      router.push('/');
    } catch (err) {
      console.error("Failed to add spot to backend", err);
      alert("Failed to add spot. Ensure backend is running.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 font-sans pb-10">
      {/* Header */}
      <header className="bg-white px-6 pt-12 pb-6 md:pt-8 md:pb-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/" className="h-10 w-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm cursor-pointer">
            <ArrowLeft size={20} strokeWidth={2.5}/>
          </Link>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Add a Study Spot
          </h1>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-2xl mx-auto px-5 md:px-6 pt-8">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200/50">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Form Fields - Name */}
            <div>
              <label htmlFor="name" className="block text-[14px] font-bold text-slate-700 mb-2">Spot Name*</label>
              <input
                required
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Main Library 3rd Floor"
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300"
              />
            </div>

            {/* Campus dropdown */}
            <div>
              <label htmlFor="campus" className="block text-[14px] font-bold text-slate-700 mb-2">Campus*</label>
              <select
                required
                id="campus" 
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300 appearance-none"
              >
                <option value="Boston College">Boston College</option>
                <option value="Suffolk University">Suffolk University</option>
              </select>
            </div>
            
            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-[14px] font-bold text-slate-700 mb-2">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="e.g. https://images.unsplash.com/..."
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Distance */}
              <div>
                <label htmlFor="distance" className="block text-[14px] font-bold text-slate-700 mb-2">Distance*</label>
                <input
                  required
                  type="text"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="e.g. 0.3 mi away"
                  className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-[14px] font-bold text-slate-700 mb-2">Hours/Status*</label>
                <input
                  required
                  type="text"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="e.g. Open until 10 PM"
                  className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-[14px] font-bold text-slate-700 mb-2">Tags (comma separated)*</label>
              <input
                required
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. Quiet, Outlets, Coffee"
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Occupancy */}
              <div>
                <label htmlFor="occupancy" className="block text-[14px] font-bold text-slate-700 mb-2">Occupancy</label>
                <div className="relative">
                  <select
                    id="occupancy"
                    name="occupancy"
                    value={formData.occupancy}
                    onChange={handleChange}
                    className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300 appearance-none"
                  >
                    <option value="Low">Low (Plenty of seats)</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Almost full)</option>
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-[14px] font-bold text-slate-700 mb-2">Rating (0.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-blue-100 focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-blue-300"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-4">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-[16px] py-4 rounded-2xl transition-colors shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] active:scale-[0.98] flex justify-center items-center gap-2"
              >
                Add Study Spot
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}
