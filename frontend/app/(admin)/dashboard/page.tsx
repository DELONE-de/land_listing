'use client';
import useSWR from 'swr';
import api from '@/lib/api-client';
import { Eye, MessageCircle, Share2, TrendingUp, List, Mail } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}><Icon size={20} className="text-white" /></div>
    <div>
      <p className="text-textSecondary text-sm">{label}</p>
      <p className="text-2xl font-bold text-textPrimary">{value ?? '—'}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { data } = useSWR('/admin/stats', () => api.get<any>('/admin/stats', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-textPrimary">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Listings"   value={data?.totalListings}   icon={List}          color="bg-primary" />
        <StatCard label="Total Views"      value={data?.views}           icon={Eye}           color="bg-secondary" />
        <StatCard label="WhatsApp Clicks"  value={data?.whatsappClicks}  icon={MessageCircle} color="bg-green-500" />
        <StatCard label="Shares"           value={data?.shares}          icon={Share2}        color="bg-accent" />
        <StatCard label="Conversion Rate"  value={data?.conversionRate}  icon={TrendingUp}    color="bg-purple-500" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-textPrimary mb-3 flex items-center gap-2"><Mail size={18} /> Recent Inquiries</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background text-textSecondary">
              <tr>{['Name','Email','Listing','Message'].map(h => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody>
              {(data?.recentInquiries ?? []).map((inq: any) => (
                <tr key={inq.id} className="border-t border-border">
                  <td className="px-4 py-3">{inq.name}</td>
                  <td className="px-4 py-3 text-textSecondary">{inq.email}</td>
                  <td className="px-4 py-3 text-primary">{inq.listing?.title}</td>
                  <td className="px-4 py-3 text-textSecondary truncate max-w-xs">{inq.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
