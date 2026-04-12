'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ListingMapProps {
  coordinates?: {
    lat: number;
    lng: number;
  };
  title: string;
}

export function ListingMap({ coordinates, title }: ListingMapProps) {
  useEffect(() => {
    if (!coordinates) return;

    const map = L.map('listing-map').setView([coordinates.lat, coordinates.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([coordinates.lat, coordinates.lng])
      .addTo(map)
      .bindPopup(title)
      .openPopup();

    return () => {
      map.remove();
    };
  }, [coordinates, title]);

  if (!coordinates) {
    return (
      <div className="h-[400px] rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Location not available</p>
      </div>
    );
  }

  return <div id="listing-map" className="h-[400px] rounded-lg overflow-hidden border" />;
}