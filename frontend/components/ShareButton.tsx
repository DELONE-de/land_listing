'use client';

import { useState } from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';
import { Listing } from '@/lib/types';

interface ShareButtonProps {
  listing: Listing;
}

export function ShareButton({ listing }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : '';

  const trackShare = async () => {
    try {
      await apiClient.trackClick(listing.id, 'share');
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackShare();
      toast({
        title: 'Link copied!',
        description: 'Share link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (platform: string) => {
    trackShare();
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(listing.title)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(`${listing.title} - ${shareUrl}`)}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="mr-2 h-4 w-4" />
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="mr-2 h-4 w-4" />
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <Share2 className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Link
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}