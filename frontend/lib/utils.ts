import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatPrice = (price: number | string) =>
  `₦${Number(price).toLocaleString('en-NG')}`;

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export const generateWhatsAppUrl = (phone: string, title: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(`I'm interested in: ${title}`)}`;
