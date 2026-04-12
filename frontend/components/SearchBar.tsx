'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { STATES } from '@/data/nigeria-locations';

interface Filters { search: string; state: string; status: string; }

export default function SearchBar({ onSearch, className }: { onSearch: (f: Filters) => void; className?: string }) {
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSearch({ search, state, status }); };

  const selectCls = 'py-2.5 px-3 rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search land listings..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <select value={state} onChange={e => setState(e.target.value)} className={selectCls}>
        <option value="">All States</option>
        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls}>
        <option value="">All Status</option>
        <option value="AVAILABLE">Available</option>
        <option value="SOLD">Sold</option>
        <option value="UNDER_OFFER">Under Offer</option>
      </select>
      <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">
        Search
      </button>
    </form>
  );
}
