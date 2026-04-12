import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'available' | 'sold' | 'under_offer';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    available: {
      label: 'Available',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    sold: {
      label: 'Sold',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    under_offer: {
      label: 'Under Offer',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
  };

  const variant = variants[status] || variants.available;

  return (
    <Badge className={cn(variant.className, className)} variant="outline">
      {variant.label}
    </Badge>
  );
}