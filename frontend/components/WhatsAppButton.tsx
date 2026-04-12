'use client';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';
import api from '@/lib/api-client';

export default function WhatsAppButton({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  const handleClick = async () => {
    await api.post(`/listings/${listingId}/track-click`, { event: 'whatsapp' }).catch(() => {});
    window.open(generateWhatsAppUrl(phone, listingTitle), '_blank');
  };

  return (
    <button onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-colors font-medium">
      <MessageCircle size={20} />
      WhatsApp
    </button>
  );
}
