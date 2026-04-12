'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Mail, Phone } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Inquiry } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInquiries();
  }, [search]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getInquiries({ search });
      if (response.success) {
        setInquiries(response.data.inquiries || response.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch inquiries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await apiClient.updateInquiry(id, { status });
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Inquiry status updated',
        });
        fetchInquiries();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update inquiry',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      new: { label: 'New', className: 'bg-blue-100 text-blue-800' },
      contacted: { label: 'Contacted', className: 'bg-yellow-100 text-yellow-800' },
      closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800' },
    };

    const variant = variants[status] || variants.new;
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="mt-2 text-gray-600">
          Manage customer inquiries and messages
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Listing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium">{inquiry.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">{inquiry.email}</span>
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          <span className="text-xs">{inquiry.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {inquiry.listing?.title || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => handleStatusChange(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatRelativeTime(inquiry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              {selectedInquiry && formatDate(selectedInquiry.createdAt)}
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="mt-1">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1">{selectedInquiry.email}</p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="mt-1">{selectedInquiry.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedInquiry.status)}</div>
                </div>
              </div>

              {/* Listing Info */}
              {selectedInquiry.listing && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Regarding Listing
                  </label>
                  <div className="mt-2 rounded-lg border p-4">
                    <p className="font-medium">{selectedInquiry.listing.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedInquiry.listing.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <div className="mt-2 rounded-lg border p-4 bg-gray-50">
                  <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedInquiry.email}`)}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                {selectedInquiry.phone && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${selectedInquiry.phone}`)}
                    className="gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}