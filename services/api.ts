// src/services/api.ts

import { Booking, BookingStatus, Service, User } from '../types';

// --- Configuration ---
const API_URL = "https://trueline.onrender.com/api";

// --- Helper function for API requests ---
async function request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  hasFile?: boolean,
  headers?: Record<string, string>
): Promise<T> {
    const token = localStorage.getItem('authToken');

    const requestOptions: RequestInit = {
        method,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            // If sending a file (FormData), do NOT set Content-Type manually; browser does it.
            ...(!hasFile && { 'Content-Type': 'application/json' }),
            ...headers,
        },
        ...(body && !hasFile && { body: JSON.stringify(body) }),
        ...(body && hasFile && { body: body }),
    };

    const response = await fetch(`${API_URL}/${endpoint}`, requestOptions);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content (common for deletes)
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// ==========================================
// AUTHENTICATION
// ==========================================

export const loginUser = async (email: string, password: string): Promise<User> => {
  return request<User>('users/login', 'POST', { email, password });
};

// ==========================================
// SERVICES
// ==========================================

export const getServices = async (): Promise<Service[]> => {
  return request<Service[]>('services');
};

export const createService = async (serviceData: FormData): Promise<Service> => {
  return request<Service>('services', 'POST', serviceData, true);
};

export const updateService = async (id: string, serviceData: FormData): Promise<Service> => {
  return request<Service>(`services/${id}`, 'PUT', serviceData, true);
};

export const deleteService = async (id: string): Promise<{ success: boolean }> => {
  await request(`services/${id}`, 'DELETE');
  return { success: true };
};

// ==========================================
// BOOKINGS
// ==========================================

export const getBookings = async (): Promise<Booking[]> => {
  return request<Booking[]>('bookings');
};

export const createBooking = async (
  data: Omit<Booking, '_id' | 'id' | 'status' | 'beforePhotos' | 'afterPhotos' | 'createdAt'>
): Promise<Booking> => {
  return request<Booking>('bookings', 'POST', data);
};

export const updateBookingStatus = async (id: string, status: BookingStatus): Promise<Booking> => {
  return request<Booking>(`bookings/${id}/status`, 'PUT', { status });
};

export const uploadPhotos = async (id: string, type: 'before' | 'after', photos: File[]): Promise<Booking> => {
  const formData = new FormData();
  formData.append('type', type);
  photos.forEach((photo) => formData.append('photos', photo));
  return request<Booking>(`bookings/${id}/photos`, 'POST', formData, true);
};

export const deleteBooking = async (id: string): Promise<{ success: boolean }> => {
  await request(`bookings/${id}`, 'DELETE');
  return { success: true };
};

// ==========================================
// GALLERY
// ==========================================

export interface GalleryItem {
  _id: string;
  serviceType: string;
  description: string;
  beforePhotos: string[];
  afterPhotos: string[];
  createdAt: string;
}

// Used by Public Gallery (Alias for convenience)
export type GalleryWork = GalleryItem;

// Fetch all items (Public & Admin use the same endpoint in your setup)
export const getGalleryWorks = async (): Promise<GalleryWork[]> => {
  // Pointing to 'manage' because that is where the GET route is defined in backend
  return request<GalleryWork[]>('gallery/manage');
};

export const getManagedGalleryItems = async (): Promise<GalleryItem[]> => {
  return request<GalleryItem[]>('gallery/manage');
};

export const createGalleryItem = async (formData: FormData): Promise<GalleryItem> => {
  return request<GalleryItem>('gallery/manage', 'POST', formData, true);
};

export const deleteGalleryItem = async (id: string): Promise<{ success: boolean }> => {
  await request(`gallery/manage/${id}`, 'DELETE');
  return { success: true };
};

// ==========================================
// BLOG
// ==========================================

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  return request<BlogPost[]>('blog');
};

export const createBlogPost = async (formData: FormData): Promise<BlogPost> => {
  return request<BlogPost>('blog', 'POST', formData, true);
};

export const deleteBlogPost = async (id: string): Promise<{ success: boolean }> => {
  await request(`blog/${id}`, 'DELETE');
  return { success: true };
};

// ==========================================
// TESTIMONIALS
// ==========================================

export interface Testimonial {
  _id: string;
  name: string;
  location: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  return request<Testimonial[]>('testimonials');
};

// Note: Testimonials usually don't need FormData unless you add avatar images later.
// We use Omit to exclude auto-generated fields.
export const createTestimonial = async (data: Omit<Testimonial, '_id' | 'createdAt'>): Promise<Testimonial> => {
  return request<Testimonial>('testimonials', 'POST', data);
};

export const deleteTestimonial = async (id: string): Promise<{ success: boolean }> => {
  await request(`testimonials/${id}`, 'DELETE');
  return { success: true };
};