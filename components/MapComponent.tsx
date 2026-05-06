"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StudySpot } from '../lib/data';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  spots: StudySpot[];
  center?: [number, number];
  zoom?: number;
}

// Component to handle map centering/zooming dynamically if needed
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ spots, center = [42.355, -71.074], zoom = 14 }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-slate-100 animate-pulse rounded-[2.5rem]" />;

  // This creates a map, adds a tile layer, and then adds a marker for each spot.
  // The marker has a popup that shows the spot's info.
  // The popup has a button that scrolls to the spot in the list.
  return (
    <div className="w-full h-full relative overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-xl">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spots.map((spot) => (
          spot.lat && spot.lng ? (
            <Marker key={spot.id} position={[spot.lat, spot.lng]}>
              <Popup>
                <div className="p-1 min-w-[120px]">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{spot.name}</h3>
                  <p className="text-[11px] text-slate-500 mb-1">{spot.status}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-extrabold text-[#0f4f15]">{spot.rating.toFixed(1)} ★</span>
                    <button 
                      onClick={() => {
                        const element = document.getElementById(`spot-${spot.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                          element.classList.add('ring-2', 'ring-[#0f4f15]', 'ring-offset-2');
                          setTimeout(() => {
                            element.classList.remove('ring-2', 'ring-[#0f4f15]', 'ring-offset-2');
                          }, 2000);
                        }
                      }}
                      className="text-[10px] font-bold text-white bg-[#0f4f15] px-2 py-1 rounded-md hover:bg-[#d1e8d3] transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
        <MapUpdater center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}
