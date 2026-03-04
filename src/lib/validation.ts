// Data validation utilities for improved type safety and data integrity

import { z } from 'zod';

// User validation schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'host', 'guest', 'stocker'], { message: 'Invalid role' }),
});

// Property validation schema
export const PropertySchema = z.object({
  id: z.string(),
  hostId: z.string(),
  name: z.string().min(1, 'Property name is required'),
  address: z.string().min(1, 'Address is required'),
  description: z.string(),
  amenities: z.array(z.string()),
  kitchenAmenities: z.array(z.string()),
  accessInstructions: z.string(),
  maxGuests: z.number().min(1, 'Must accommodate at least 1 guest'),
  iCalUrl: z.string().url('Invalid iCal URL').optional(),
  shoppingLink: z.string(),
  createdAt: z.date(),
  lastCalendarRefresh: z.date().optional(),
});

// Booking validation schema
export const BookingSchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  summary: z.string(),
  uid: z.string(),
  guestLink: z.string().optional(),
  guestLinkGenerated: z.date().optional(),
}).refine(
  (data) => data.startDate < data.endDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Shopping session validation schema
export const ShoppingSessionSchema = z.object({
  propertyId: z.string(),
  propertyName: z.string(),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  guests: z.number().min(1, 'Must have at least 1 guest'),
  method: z.enum(['ai', 'manual']),
}).refine(
  (data) => new Date(data.checkIn) < new Date(data.checkOut),
  {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  }
);

// Registration form validation schema
export const RegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['host', 'guest', 'stocker']).default('guest'),
});

// Login form validation schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Property creation form validation schema
export const PropertyCreationSchema = z.object({
  name: z.string().min(1, 'Property name is required').max(100, 'Name too long'),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
  description: z.string().max(1000, 'Description too long'),
  amenities: z.array(z.string()).default([]),
  kitchenAmenities: z.array(z.string()).default([]),
  accessInstructions: z.string().max(500, 'Instructions too long').default(''),
  maxGuests: z.number().min(1, 'Must accommodate at least 1 guest').max(50, 'Too many guests'),
  iCalUrl: z.string().url('Invalid URL').optional(),
});

// Date range validation schema
export const DateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(
  (data) => data.startDate < data.endDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

// Guest link parameters validation schema
export const GuestLinkParamsSchema = z.object({
  stay: z.string().regex(/^\d{4}-\d{2}-\d{2}_\d{4}-\d{2}-\d{2}$/, 'Invalid stay format'),
  booking: z.string(),
  property: z.string(),
});

// Type exports for use throughout the app
export type User = z.infer<typeof UserSchema>;
export type Property = z.infer<typeof PropertySchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type ShoppingSession = z.infer<typeof ShoppingSessionSchema>;
export type RegistrationData = z.infer<typeof RegistrationSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
export type PropertyCreationData = z.infer<typeof PropertyCreationSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type GuestLinkParams = z.infer<typeof GuestLinkParamsSchema>;

// Validation helper functions
export function validateUser(data: unknown): { success: true; data: User } | { success: false; errors: string[] } {
  const result = UserSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { 
    success: false, 
    errors: result.error.issues.map(e => e.message) 
  };
}

export function validateProperty(data: unknown): { success: true; data: Property } | { success: false; errors: string[] } {
  const result = PropertySchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { 
    success: false, 
    errors: result.error.issues.map(e => e.message) 
  };
}

export function validateBooking(data: unknown): { success: true; data: Booking } | { success: false; errors: string[] } {
  const result = BookingSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { 
    success: false, 
    errors: result.error.issues.map(e => e.message) 
  };
}

export function validateShoppingSession(data: unknown): { success: true; data: ShoppingSession } | { success: false; errors: string[] } {
  const result = ShoppingSessionSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { 
    success: false, 
    errors: result.error.issues.map(e => e.message) 
  };
}

export function validateEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function validateUrl(url: string): boolean {
  return z.string().url().safeParse(url).success;
}

export function sanitizeString(input: string): string {
  // Remove potentially harmful characters
  return input.replace(/[<>\"'&]/g, '').trim();
}

export function sanitizeHtml(input: string): string {
  // Very basic HTML sanitization - in production, use a proper library like DOMPurify
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/&/g, '&amp;');
}

// Rate limiting helper (simple in-memory implementation)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const key = identifier;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    // New window or expired
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime };
  }

  current.count++;
  return { allowed: true };
}