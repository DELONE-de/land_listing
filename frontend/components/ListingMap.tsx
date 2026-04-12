'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { formatPrice } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

interface Listing { id: string; title: string; price: number; lat: number; lng: number; slug: string; }

export default function ListingMap({ listings, center = [9.082, 8.6753], zoom = 6 }: {
  listings: Listing[]; center?: [number, number]; zoom?: number;
}) {
  return (
    <MapContainer center={center} zoom={zoom} className="w-full h-full rounded-xl z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {listings.filter(l => l.lat && l.lng).map(l => (
        <Marker key={l.id} position={[l.lat, l.lng]}>
          <Popup>
            <a href={`/listings/${l.slug}`} className="font-semibold text-primary">{l.title}</a>
            <p className="text-sm">{formatPrice(l.price)}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
