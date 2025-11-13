// src/services/api.ts

// --- FIX: IMPORT the types from your central types file ---
import { Booking, BookingStatus, Service, User } from '../types';

// --- Configuration ---

const API_URL = "https://trueline.onrender.com/api";

// --- Helper function for API requests (remains the same) ---
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

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}


// --- Gallery API Call ---
// Defines the structure of the data we expect for the gallery
interface GalleryWork {
  _id: string;
  serviceType: string;
  beforePhotos: string[];
  afterPhotos: string[];
}

export const getGalleryWorks = async (): Promise<GalleryWork[]> => {
  return request<GalleryWork[]>('gallery');
};


// --- Booking API Calls (remain the same) ---
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


// --- Authentication API Calls (remain the same) ---
export const loginUser = async (email: string, password: string): Promise<User> => {
  return request<User>('users/login', 'POST', { email, password });
};


// --- Service API Calls (remain the same)---
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

// src/services/api.ts
// ... (keep all existing imports and functions)

// --- Gallery API Calls ---

// This interface is for the new, managed gallery items
export interface GalleryItem {
  _id: string;
  serviceType: string;
  description: string;
  beforePhotos: string[];
  afterPhotos: string[];
  createdAt: string;
}

// Get all items for the admin management page
export const getManagedGalleryItems = async (): Promise<GalleryItem[]> => {
  return request<GalleryItem[]>('gallery/manage');
};

// Create a new gallery item using FormData for file uploads
export const createGalleryItem = async (formData: FormData): Promise<GalleryItem> => {
  return request<GalleryItem>('gallery/manage', 'POST', formData, true);
};

// Delete a gallery item by its ID
export const deleteGalleryItem = async (id: string): Promise<{ success: boolean }> => {
  await request(`gallery/manage/${id}`, 'DELETE');
  return { success: true };
};
// src/services/api.ts
// ... (add this with your other interfaces and functions)

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