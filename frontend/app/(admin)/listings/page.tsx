'use client';
import useSWR from 'swr';
import api from '@/lib/api-client';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function AdminListingsPage() {
  const { data, mutate } = useSWR('/listings?limit=100', () => api.get<any>('/listings?limit=100'));
  const listings = data?.data ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    await api.delete(`/listings/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    mutate();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Listings</h1>
        <Link href="/admin/listings/create" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          <Plus size={16} /> New Listing
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background text-textSecondary">
            <tr>{['Title','Price','Location','Status','Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {listings.map((l: any) => (
              <tr key={l.id} className="border-t border-border hover:bg-background">
                <td className="px-4 py-3 font-medium text-textPrimary">{l.title}</td>
                <td className="px-4 py-3 text-primary font-semibold">{formatPrice(l.price)}</td>
                <td className="px-4 py-3 text-textSecondary">{l.lga}, {l.state}</td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3 flex gap-2">
                  <Link href={`/admin/listings/${l.id}/edit`} className="p-1.5 rounded hover:bg-blue-50 text-secondary"><Pencil size={15} /></Link>
                  <button onClick={() => handleDelete(l.id)} className="p-1.5 rounded hover:bg-red-50 text-sold"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
