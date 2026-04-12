'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api-client';
import { STATES, LGA_BY_STATE } from '@/data/nigeria-locations';

const DOC_TYPES = ['C_OF_O','DEED_OF_ASSIGNMENT','SURVEY_PLAN','GOVERNORS_CONSENT','OTHER'];
const inputCls = 'w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

export default function CreateListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title:'', description:'', price:'', state:'', lga:'', address:'', size:'', sizeUnit:'sqm', documentType:'C_OF_O', status:'AVAILABLE', features:'', lat:'', lng:'' });
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'features') fd.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (images) Array.from(images).forEach(f => fd.append('images', f));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      router.push('/admin/listings');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-6">Create Listing</h1>
      {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Title" value={form.title} onChange={e => set('title', e.target.value)} className={inputCls} />
        <textarea required placeholder="Description" value={form.description} onChange={e => set('description', e.target.value)} rows={4} className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <input required type="number" placeholder="Price (₦)" value={form.price} onChange={e => set('price', e.target.value)} className={inputCls} />
          <div className="flex gap-2">
            <input required type="number" placeholder="Size" value={form.size} onChange={e => set('size', e.target.value)} className={inputCls} />
            <select value={form.sizeUnit} onChange={e => set('sizeUnit', e.target.value)} className={inputCls}>
              <option>sqm</option><option>acres</option><option>hectares</option><option>plots</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select required value={form.state} onChange={e => set('state', e.target.value)} className={inputCls}>
            <option value="">Select State</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={form.lga} onChange={e => set('lga', e.target.value)} className={inputCls}>
            <option value="">Select LGA</option>
            {(LGA_BY_STATE[form.state] ?? []).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <input required placeholder="Address" value={form.address} onChange={e => set('address', e.target.value)} className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.documentType} onChange={e => set('documentType', e.target.value)} className={inputCls}>
            {DOC_TYPES.map(d => <option key={d} value={d}>{d.replace(/_/g, ' ')}</option>)}
          </select>
          <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls}>
            <option value="AVAILABLE">Available</option>
            <option value="SOLD">Sold</option>
            <option value="UNDER_OFFER">Under Offer</option>
          </select>
        </div>
        <input placeholder="Features (comma separated)" value={form.features} onChange={e => set('features', e.target.value)} className={inputCls} />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" step="any" placeholder="Latitude (optional)" value={form.lat} onChange={e => set('lat', e.target.value)} className={inputCls} />
          <input type="number" step="any" placeholder="Longitude (optional)" value={form.lng} onChange={e => set('lng', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium text-textPrimary block mb-1">Images</label>
          <input type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} className="text-sm text-textSecondary" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
