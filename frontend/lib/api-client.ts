import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/admin/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    const response = await this.client.post('/admin/auth/login', credentials);
    const token = response.data?.data?.token;
    if (token) {
      localStorage.setItem('admin_token', token);
    }
    return response.data;
  }

  async getMe() {
    const response = await this.client.get('/admin/auth/me');
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const response = await this.client.post('/admin/auth/change-password', data);
    return response.data;
  }

  // Listing methods
  async getListings(params?: any) {
    const response = await this.client.get('/listings', { params });
    return response.data;
  }

  async getListing(id: string) {
    const response = await this.client.get(`/listings/${id}`);
    return response.data;
  }

  async getListingBySlug(slug: string) {
    const response = await this.client.get(`/listings/slug/${slug}`);
    return response.data;
  }

  async getRelatedListings(id: string) {
    const response = await this.client.get(`/listings/${id}/related`);
    return response.data;
  }

  async trackView(id: string) {
    const response = await this.client.post(`/listings/${id}/view`);
    return response.data;
  }

  async trackClick(id: string, type: 'whatsapp' | 'share') {
    const response = await this.client.post(`/listings/${id}/track-click`, { type });
    return response.data;
  }

  // Admin listing methods
  async createListing(data: any) {
    const response = await this.client.post('/admin/listings', data);
    return response.data;
  }

  async updateListing(id: string, data: any) {
    const response = await this.client.patch(`/admin/listings/${id}`, data);
    return response.data;
  }

  async deleteListing(id: string) {
    const response = await this.client.delete(`/admin/listings/${id}`);
    return response.data;
  }

  async getAdminListings(params?: any) {
    const response = await this.client.get('/admin/listings', { params });
    return response.data;
  }

  // Inquiry methods
  async createInquiry(data: any) {
    const response = await this.client.post('/inquiries', data);
    return response.data;
  }

  async getInquiries(params?: any) {
    const response = await this.client.get('/admin/inquiries', { params });
    return response.data;
  }

  async getInquiry(id: string) {
    const response = await this.client.get(`/admin/inquiries/${id}`);
    return response.data;
  }

  async updateInquiry(id: string, data: any) {
    const response = await this.client.patch(`/admin/inquiries/${id}`, data);
    return response.data;
  }

  // Analytics methods
  async getDashboard() {
    const response = await this.client.get('/admin/dashboard');
    return response.data;
  }

  async getPopularAnalytics() {
    const response = await this.client.get('/admin/analytics/popular');
    return response.data;
  }

  async getConversionAnalytics() {
    const response = await this.client.get('/admin/analytics/conversion');
    return response.data;
  }

  async getAnalyticsSummary() {
    const response = await this.client.get('/admin/analytics/summary');
    return response.data;
  }

  async getStats() {
    const response = await this.client.get('/admin/stats');
    return response.data;
  }

  // Utility methods
  async getLocations() {
    const response = await this.client.get('/listings/locations');
    return response.data;
  }

  async getLandTypes() {
    const response = await this.client.get('/listings/land-types');
    return response.data;
  }

  async getAmenities() {
    const response = await this.client.get('/listings/amenities');
    return response.data;
  }

  // Upload methods
  async getUploadSignature() {
    const response = await this.client.get('/admin/upload-signature');
    return response.data;
  }

  // Sub-admin methods
  async listSubAdmins() {
    const response = await this.client.get('/admin/sub-admins');
    return response.data;
  }

  async createSubAdmin(data: { name: string; email: string; password: string }) {
    const response = await this.client.post('/admin/sub-admins', data);
    return response.data;
  }

  async deleteSubAdmin(id: string) {
    const response = await this.client.delete(`/admin/sub-admins/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;