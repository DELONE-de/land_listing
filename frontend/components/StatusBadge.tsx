import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  AVAILABLE:   { label: 'Available',   cls: 'bg-green-100 text-available' },
  SOLD:        { label: 'Sold',        cls: 'bg-red-100 text-sold' },
  UNDER_OFFER: { label: 'Under Offer', cls: 'bg-yellow-100 text-underOffer' },
};

export default function StatusBadge({ status }: { status: string }) {
  const { label, cls } = STATUS_MAP[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', cls)}>{label}</span>;
}
