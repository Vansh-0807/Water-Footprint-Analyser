import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, X, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapSelectorProps {
  onSelect: (lat: number, lon: number) => void;
  onClose: () => void;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

// Helper component to fly to the searched location
function MapUpdater({ center }: { center: L.LatLng | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function MapSelector({ onSelect, onClose }: MapSelectorProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<L.LatLng | null>(null);

  const handleConfirm = () => {
    if (position) {
      onSelect(position.lat, position.lng);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat);
        const newLon = parseFloat(result.lon);
        const newPos = new L.LatLng(newLat, newLon);
        
        setPosition(newPos);
        setMapCenter(newPos);
      } else {
        toast.error("Location not found.");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching for location.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-stone-200 dark:border-stone-800 flex flex-col h-[85vh]">
        <div className="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-800">
          <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Select Location on Map
          </h3>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="p-3 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city, region, or address..."
              className="flex-1 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 rounded-lg font-medium hover:bg-emerald-200 dark:hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </form>
        </div>

        <div className="flex-1 w-full bg-stone-100 dark:bg-stone-800 relative z-0">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} className="w-full h-full z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
            <MapUpdater center={mapCenter} />
          </MapContainer>
        </div>

        <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
          <div className="text-sm text-stone-600 dark:text-stone-400">
            {position ? `Selected: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Click on the map or search to select a location'}
          </div>
          <button
            onClick={handleConfirm}
            disabled={!position}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}
