'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive(i => (i - 1 + images.length) % images.length);
  const next = () => setActive(i => (i + 1) % images.length);

  if (!images.length) return <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center text-textSecondary">No images</div>;

  return (
    <div className="space-y-2">
      <div className="relative h-80 w-full rounded-xl overflow-hidden">
        <Image src={images[active]} alt="listing" fill className="object-cover" />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"><ChevronLeft size={20} /></button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full hover:bg-black/60"><ChevronRight size={20} /></button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} className={`relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${i === active ? 'border-primary' : 'border-transparent'}`}>
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
