'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  listingId: string;
  listingTitle: string;
}

export function InquiryForm({ listingId, listingTitle }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.createInquiry({
        ...data,
        listingId,
      });

      if (response.success) {
        toast({
          title: 'Inquiry Sent!',
          description: 'We will get back to you shortly.',
        });
        reset();
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send inquiry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Send an Inquiry</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Interested in <strong>{listingTitle}</strong>? Send us a message.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="+234 800 000 0000"
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            {...register('message')}
            placeholder="Tell us about your interest..."
            rows={4}
          />
          {errors.message && (
            <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </Button>
      </form>
    </div>
  );
}