export interface OSMNode {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    amenity?: string;
    "opening_hours"?: string;
    [key: string]: any;
  };
}

export async function fetchNearbySpotsFromOSM(lat: number, lng: number, radius: number = 2000) {
  // Query for libraries and cafes within the radius of given coordinates
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="cafe"](around:${radius},${lat},${lng});
      way["amenity"="cafe"](around:${radius},${lat},${lng});
      node["amenity"="library"](around:${radius},${lat},${lng});
      way["amenity"="library"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Overpass API request failed');
    
    const data = await response.json();
    
    return data.elements.map((element: any) => ({
      id: element.id,
      name: element.tags?.name || (element.tags?.amenity === 'cafe' ? 'Unnamed Cafe' : 'Unnamed Library'),
      image: element.tags?.amenity === 'cafe' 
        ? 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' 
        : 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      rating: 4.0 + Math.random() * 1.0, // Mock rating as OSM doesn't provide it
      location: 'Live from OSM',
      status: element.tags?.opening_hours || 'Check hours online',
      tags: [element.tags?.amenity === 'cafe' ? 'Coffee' : 'Quiet', 'Live'],
      occupancy: 'Unknown',
      lat: element.lat || element.center?.lat,
      lng: element.lon || element.center?.lon,
    }));
  } catch (error) {
    console.error('Error fetching from Overpass:', error);
    return [];
  }
}
