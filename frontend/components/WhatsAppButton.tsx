'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

interface WhatsAppButtonProps {
  listingId?: string;
  phoneNumber?: string;
  message?: string;
  variant?: string;
  label?: string;
}

export function WhatsAppButton({ listingId, phoneNumber, message, label }: WhatsAppButtonProps) {
  const [isTracking, setIsTracking] = useState(false);

  const handleClick = async () => {
    if (isTracking) return;

    setIsTracking(true);
    try {
      if (listingId) await apiClient.trackClick(listingId, 'whatsapp');
    } catch (error) {
      console.error('Failed to track WhatsApp click:', error);
    } finally {
      setIsTracking(false);
    }

    const defaultMessage = message || 'Hi, I am interested in this property listing.';
    const url = phoneNumber
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 h-14 gap-2 rounded-full px-6 shadow-lg"
      size="lg"
    >
      <MessageCircle className="h-5 w-5" />
      {label || 'Contact via WhatsApp'}
    </Button>
  );
}
