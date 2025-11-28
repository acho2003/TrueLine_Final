// src/types.ts

// --- Enums ---
// This defines the possible states for a booking.
export enum BookingStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Canceled = 'Canceled',
}
export interface Testimonial {
  _id: string;
  name: string;
  location: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}
// --- Main Data Interfaces ---

// Service: Represents a service offered.
// Uses '_id' from MongoDB. 'id' is optional for frontend convenience.
export interface Service {
  _id: string; 
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  details: string[]; // <--- ADD THIS
}

// Booking: Represents a customer's booking request.
// Uses '_id' from MongoDB.
export interface Booking {
  _id: string;
  id: string; // Often, MongoDB drivers alias _id to id. Let's keep both for compatibility.
  name: string;
  phone: string;
  address: string;
  serviceType: string;
  preferredDateTime: string;
  notes: string;
  status: BookingStatus;
  beforePhotos: string[];
  afterPhotos: string[];
  createdAt: string;
}

// Review: Represents a customer's review.
// Uses '_id' from MongoDB. 'avatarUrl' is optional.
export interface Review {
  _id: string;
  id?: string;
  customerName: string;
  service: string;
  rating: number;
  comment: string;
  avatarUrl?: string; // Made optional as not all reviews will have an avatar
}

// User: Represents the logged-in admin user.
// Includes the token for authentication.
export interface User {
  _id: string;
  id?: string;
  token: string;
  name: string;
  email: string;
}

// ChatMessage: A single, consolidated definition for your chat widget.
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}