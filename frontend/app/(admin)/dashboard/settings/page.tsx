'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');

  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [subForm, setSubForm] = useState({ name: '', email: '', password: '' });
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState('');

  useEffect(() => {
    apiClient.listSubAdmins().then((res) => setSubAdmins(res.data || [])).catch(() => {});
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (form.newPassword !== form.confirmPassword) return setPwError('New passwords do not match');
    if (form.newPassword.length < 6) return setPwError('New password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await apiClient.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      if (res.success) {
        toast({ title: 'Password changed successfully' });
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwError(res.message || 'Failed to change password');
      }
    } catch (err: any) {
      setPwError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubError('');
    if (subForm.password.length < 6) return setSubError('Password must be at least 6 characters');
    setSubLoading(true);
    try {
      const res = await apiClient.createSubAdmin(subForm);
      setSubAdmins([res.data, ...subAdmins]);
      setSubForm({ name: '', email: '', password: '' });
      toast({ title: 'Sub-admin created successfully' });
    } catch (err: any) {
      setSubError(err.response?.data?.message || err.message || 'Failed to create sub-admin');
    } finally {
      setSubLoading(false);
    }
  };

  const handleDeleteSubAdmin = async (id: string) => {
    if (!confirm('Delete this sub-admin?')) return;
    try {
      await apiClient.deleteSubAdmin(id);
      setSubAdmins(subAdmins.filter((a) => a.id !== id));
      toast({ title: 'Sub-admin deleted' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Change Password */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input type="password" required value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" required value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" required value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          {pwError && <p className="text-sm text-destructive">{pwError}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>

      {/* Sub-admins */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Sub-Admins</h2>

        <form onSubmit={handleCreateSubAdmin} className="space-y-3 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Name</Label>
              <Input required value={subForm.name} placeholder="John Doe"
                onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" required value={subForm.email} placeholder="john@example.com"
                onChange={(e) => setSubForm({ ...subForm, email: e.target.value })} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required value={subForm.password} placeholder="Min 6 chars"
                onChange={(e) => setSubForm({ ...subForm, password: e.target.value })} />
            </div>
          </div>
          {subError && <p className="text-sm text-destructive">{subError}</p>}
          <Button type="submit" disabled={subLoading}>
            {subLoading ? 'Creating...' : 'Add Sub-Admin'}
          </Button>
        </form>

        {subAdmins.length === 0 ? (
          <p className="text-sm text-gray-500">No sub-admins yet.</p>
        ) : (
          <ul className="divide-y">
            {subAdmins.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-gray-500">{a.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteSubAdmin(a.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
