'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';
import { Upload, X, Loader2 } from 'lucide-react';
import { generateSlug } from '@/lib/utils';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.number().min(0, 'Price must be positive'),
  location: z.string().min(2, 'Location is required'),
  state: z.string().min(2, 'State is required'),
  landType: z.string().min(2, 'Land type is required'),
  size: z.number().min(0, 'Size must be positive'),
  sizeUnit: z.string().min(1, 'Size unit is required'),
  status: z.enum(['available', 'sold', 'under_offer']),
});

type ListingFormData = z.infer<typeof listingSchema>;

export default function CreateListingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      status: 'available',
      sizeUnit: 'sqm',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Get upload signature
      const signatureResponse = await apiClient.getUploadSignature();
      const { signature, timestamp, cloudName, apiKey, folder } = signatureResponse.data;

      // Upload each file to Cloudinary
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', apiKey);
        formData.append('folder', folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        return data.secure_url;
      });

      const urls = await Promise.all(uploadPromises);
      setImages([...images, ...urls]);

      toast({
        title: 'Success',
        description: `${urls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ListingFormData) => {
    if (images.length === 0) {
      toast({
        title: 'Error',
        description: 'Please upload at least one image',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = generateSlug(data.title);
      
      const response = await apiClient.createListing({
        ...data,
        slug,
        images,
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Listing created successfully',
        });
        router.push('/dashboard/listings');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create listing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Listing</h1>
        <p className="mt-2 text-gray-600">Add a new property to your listings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g., 500 Sqm Land in Lekki Phase 1"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe the property in detail..."
                rows={5}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Details */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="5000000"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  onValueChange={(value) => setValue('status', value as any)}
                  defaultValue="available"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="under_offer">Under Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">Size *</Label>
                <Input
                  id="size"
                  type="number"
                  {...register('size', { valueAsNumber: true })}
                  placeholder="500"
                />
                {errors.size && (
                  <p className="mt-1 text-sm text-destructive">{errors.size.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sizeUnit">Size Unit *</Label>
                <Select
                  onValueChange={(value) => setValue('sizeUnit', value)}
                  defaultValue="sqm"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqm">Square Meters</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="plots">Plots</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="landType">Land Type *</Label>
              <Select onValueChange={(value) => setValue('landType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select land type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="mixed">Mixed Use</SelectItem>
                </SelectContent>
              </Select>
              {errors.landType && (
                <p className="mt-1 text-sm text-destructive">{errors.landType.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="Lagos"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="Lekki Phase 1"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-destructive">{errors.location.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="images"
                className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload images</p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </Label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || uploading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Listing'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}