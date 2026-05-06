"use client";

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddSpot() {
  const router = useRouter();
  
  // Local state for the main form inputs matching the backend schema
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    rating: 5,
    location: '',
    status: '',
    tags: '',
    occupancy: 'Medium',
    campus: 'None',
    info: ''
  });

  // Local state for specific amenity toggles (UI specific, converted to tags later)
  const [amenities, setAmenities] = useState({
    wifi: false,
    outlets: false,
    capacity: 'One or two people' // 'Good for groups' or 'One or two people'
  });

  const [isGeocoding, setIsGeocoding] = useState(false);

  // getCoordinates uses the free Nominatim API (OpenStreetMap) to convert a user-provided address
  // into latitude and longitude coordinates. This is necessary because our map component uses
  // coordinates, not text addresses.
  const getCoordinates = async (address: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    } catch (err) {
      console.error("Geocoding failed", err);
    }
    return { lat: 42.3601, lng: -71.0589 }; // Default to Boston if failed
  };

  // handleSubmit is triggered when the "Add Study Spot" form is submitted.
  // It handles geocoding the address, processing the tags, combining the data,
  // and finally making a POST request to the FastAPI backend.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeocoding(true);
    
    // Process tags from comma separated string to array
    const manualTags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Combine manual tags and amenity toggles
    const amenityTags = [];
    if (amenities.wifi) amenityTags.push('Free Wifi');
    if (amenities.outlets) amenityTags.push('Outlets');
    amenityTags.push(amenities.capacity);

    const processedTags = [...new Set([...manualTags, ...amenityTags])];
      
    // Set default image if none provided
    const image = formData.image.trim() !== '' 
      ? formData.image 
      : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'; 
      
    // Geocode the location string into latitude and longitude
    const coords = await getCoordinates(formData.location);

    // Construct the final object to match the FastAPI backend schema
    const newSpot = {
      name: formData.name,
      image: image,
      rating: Number(formData.rating),
      location: formData.location,
      status: formData.status,
      tags: processedTags.length > 0 ? processedTags : ['Study'],
      occupancy: formData.occupancy,
      campus: formData.campus,
      lat: coords.lat,
      lng: coords.lng,
      info: formData.info
    };
    
    // Send the new spot data to the FastAPI backend
    try {
      const backendUrl = `http://${window.location.hostname}:8000`;
      await fetch(`${backendUrl}/spots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSpot),
      });
      // Redirect to home page upon success
      router.push('/');
    } catch (err) {
      console.error("Failed to add spot to backend", err);
      alert("Failed to add spot. Ensure backend is running.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string, value: any) => {
    setAmenities(prev => ({ ...prev, [amenity]: value }));
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
                placeholder="e.g. Boston Athenaeum"
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7]"
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
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7] appearance-none"
              >
                <option value="None">None</option>
                <option value="Boston College">Boston College</option>
                <option value="Sattler College">Sattler College</option>
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
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7]"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-[14px] font-bold text-slate-700 mb-2">Address / Location*</label>
                <input
                  required
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. 700 Boylston St, Boston, MA"
                  className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7]"
                />
              </div>

              {/* Amenities */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h3 className="text-[14px] font-bold text-slate-700 mb-4 flex items-center gap-2">
                  Key Amenities
                </h3>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-slate-600">Free Wifi</span>
                    <div className="flex bg-white p-1 rounded-xl border border-[#e6f2e7] shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleAmenityToggle('wifi', true)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all border border-transparent ${amenities.wifi ? 'bg-[#0f3915] text-white border-[#e6f2e7] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAmenityToggle('wifi', false)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all border border-transparent ${!amenities.wifi ? 'bg-[#0f3915] text-white border-[#e6f2e7] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-slate-600">Good Outlets</span>
                    <div className="flex bg-white p-1 rounded-xl border border-[#e6f2e7] shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleAmenityToggle('outlets', true)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${amenities.outlets ? 'bg-[#0f3915] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAmenityToggle('outlets', false)}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${!amenities.outlets ? 'bg-[#0f3915] text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-slate-600">Capacity</span>
                    <div className="flex bg-white p-1 rounded-xl border border-[#e6f2e7] shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleAmenityToggle('capacity', 'Good for groups')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all border border-transparent ${amenities.capacity === 'Good for groups' ? 'bg-[#0f3915] text-white border-[#e6f2e7] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Groups
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAmenityToggle('capacity', 'One or two people')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all border border-transparent ${amenities.capacity === 'One or two people' ? 'bg-[#0f3915] text-white border-[#e6f2e7] shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Individual
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-[14px] font-bold text-slate-700 mb-2">Hours *</label>
                <input
                  required
                  type="text"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  placeholder="e.g. Mon - Fri: 8AM- 11PM"
                  className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7]"
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
                placeholder="e.g. Quiet, Free Wifi, Spacious"
                className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7]"
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
                    className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7] appearance-none"
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
                  className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7]"
                />
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="info" className="block text-[14px] font-bold text-slate-700 mb-2">About this spot</label>
                <textarea
                  id="info"
                  name="info"
                  rows={4}
                  value={formData.info}
                  onChange={handleChange}
                  placeholder="e.g. This library is known for its beautiful architecture and strictly quiet reading rooms. Perfect for deep focus..."
                  className="w-full bg-slate-50 text-slate-900 rounded-2xl py-3.5 px-4 focus:outline-none focus:ring-[3px] focus:ring-[#e6f2e7] focus:bg-white transition-all text-[15px] font-medium border border-slate-200 shadow-inner focus:border-[#e6f2e7] resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="mt-4">
              <button 
                type="submit"
                disabled={isGeocoding}
                className="w-full bg-[#0f3915] hover:bg-[#0f3915] text-white font-bold text-[16px] py-4 rounded-2xl transition-all shadow-[0_4px_12_rgba(15,57,21,0.3)] hover:shadow-[0_6px_16_rgba(15,57,21,0.4)] active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-[#e6f2e7]"
              >
                {isGeocoding ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Geocoding location...
                  </>
                ) : 'Add Study Spot'}
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}
