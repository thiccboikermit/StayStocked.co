// Simple authentication utilities
// In a production app, you'd use NextAuth.js or similar

import { storage, StorageKeys } from './storage';
import { type GroceryOrder } from './groceries';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'host' | 'guest' | 'stocker';
  phone?: string;
}

// Mock users for demonstration - with secure storage persistence
function loadMockUsers(): Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'host' | 'guest' | 'stocker';
}> {
  const stored = storage.get<Array<{
    id: string;
    email: string;
    password: string;
    name: string;
    role: 'admin' | 'host' | 'guest' | 'stocker';
  }>>(StorageKeys.USERS);
  
  if (stored) {
    return stored;
  }
  
  // Default users if nothing in storage
  return [
    {
      id: '1',
      email: 'admin@staystocked.com',
      password: 'admin123', // In production, this would be hashed
      name: 'Admin User',
      role: 'admin',
    },
    {
      id: '2',
      email: 'host@example.com',
      password: 'host123',
      name: 'Host User',
      role: 'host',
    }
  ];
}

function saveMockUsers(users: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'host' | 'guest' | 'stocker';
}>) {
  storage.set(StorageKeys.USERS, users);
}

let mockUsers: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'host' | 'guest' | 'stocker';
}> = [];

// Initialize users on first load
if (typeof window !== 'undefined') {
  mockUsers = loadMockUsers();
} else {
  // Server-side, use default users
  mockUsers = [
    {
      id: '1',
      email: 'admin@staystocked.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    },
    {
      id: '2',
      email: 'host@example.com',
      password: 'host123',
      name: 'Host User',
      role: 'host',
    }
  ];
}

// Mock properties for demonstration - with secure storage persistence
function loadMockProperties(): Property[] {
  const stored = storage.get<(Property & { createdAt: string; lastCalendarRefresh?: string })[]>(StorageKeys.PROPERTIES);
  
  if (stored) {
    return stored.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      lastCalendarRefresh: p.lastCalendarRefresh ? new Date(p.lastCalendarRefresh) : undefined
    }));
  }
  
  return [];
}

function saveMockProperties(properties: Property[]) {
  storage.set(StorageKeys.PROPERTIES, properties);
}

let mockProperties: Property[] = [];

// Initialize properties on first load
if (typeof window !== 'undefined') {
  mockProperties = loadMockProperties();
}

export interface Property {
  id: string;
  hostId: string;
  name: string;
  address: string;
  description: string;
  amenities: string[];
  kitchenAmenities: string[];
  accessInstructions: string;
  maxGuests: number;
  iCalUrl?: string;
  shoppingLink: string;
  createdAt: Date;
  lastCalendarRefresh?: Date;
}

export interface Booking {
  id: string;
  propertyId: string;
  startDate: Date;
  endDate: Date;
  summary: string;
  uid: string; // iCal UID
  guestLink?: string;
  guestLinkGenerated?: Date;
}

export async function authenticate(email: string, password: string): Promise<User | null> {
  // Ensure mockUsers is loaded
  if (mockUsers.length <= 2 && typeof window !== 'undefined') {
    mockUsers = loadMockUsers();
  }
  
  // In production, you'd hash the password and check against database
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
  
  return null;
}

export function setAuthToken(user: User) {
  // In production, you'd create a JWT token
  const token = btoa(JSON.stringify(user)); // Simple base64 encoding for demo
  
  // Set cookie (in production, use secure HttpOnly cookies)
  document.cookie = `auth-token=${token}; path=/; max-age=2592000`; // 30 days
  
  // Also store in secure storage for persistence during development
  storage.set(StorageKeys.AUTH_TOKEN, token);
  
  return token;
}

export function getAuthToken(): User | null {
  if (typeof window === 'undefined') return null;
  
  // First try cookies
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
  
  if (authCookie) {
    try {
      const token = authCookie.split('=')[1];
      return JSON.parse(atob(token));
    } catch {
      // If cookie is corrupted, fall through to localStorage
    }
  }
  
  // Fallback to secure storage
  try {
    const token = storage.get<string>(StorageKeys.AUTH_TOKEN);
    if (token) {
      return JSON.parse(atob(token));
    }
  } catch {
    // If storage is corrupted, return null
  }
  
  return null;
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    // Clear cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Clear secure storage
    storage.remove(StorageKeys.AUTH_TOKEN);
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isHost(user: User | null): boolean {
  return user?.role === 'host';
}

export function isGuest(user: User | null): boolean {
  return user?.role === 'guest';
}

export function isStocker(user: User | null): boolean {
  return user?.role === 'stocker';
}

export async function registerUser(email: string, password: string, name: string, role: 'host' | 'guest' | 'stocker' = 'host'): Promise<User | null> {
  // Ensure mockUsers is loaded
  if (mockUsers.length === 0 && typeof window !== 'undefined') {
    mockUsers = loadMockUsers();
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    email,
    password, // In production, this would be hashed
    name,
    role,
  };

  mockUsers.push(newUser);
  saveMockUsers(mockUsers);

  // Return user without password
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  };
}

// Property management functions
export function getPropertiesByHostId(hostId: string): Property[] {
  // Ensure mockProperties is loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  return mockProperties.filter(property => property.hostId === hostId);
}

function generateShoppingLink(propertyId: string, propertyName: string): string {
  // Generate a unique, SEO-friendly shopping link
  const slug = propertyName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `/shop/${slug}-${propertyId}`;
}

export function addProperty(property: Omit<Property, 'id' | 'createdAt' | 'shoppingLink'>): Property {
  // Ensure mockProperties is loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  
  const propertyId = (mockProperties.length + 1).toString();
  const shoppingLink = generateShoppingLink(propertyId, property.name);
  
  const newProperty: Property = {
    ...property,
    id: propertyId,
    shoppingLink,
    createdAt: new Date(),
  };
  
  mockProperties.push(newProperty);
  saveMockProperties(mockProperties);
  return newProperty;
}

export function getPropertyById(id: string): Property | null {
  // Ensure mockProperties is loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  return mockProperties.find(property => property.id === id) || null;
}

export function getPropertyByShoppingLink(slug: string): Property | null {
  // Ensure mockProperties is loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  
  // First try exact match on shopping link
  const exactMatch = mockProperties.find(property => 
    property.shoppingLink === `/shop/${slug}`
  );
  if (exactMatch) return exactMatch;
  
  // Fallback: extract property ID from slug (format: property-name-{id})
  const parts = slug.split('-');
  const propertyId = parts[parts.length - 1];
  
  return mockProperties.find(property => property.id === propertyId) || null;
}

// Booking management functions
function loadBookings(): Booking[] {
  const stored = storage.get<(Booking & { startDate: string; endDate: string; guestLinkGenerated?: string })[]>(StorageKeys.BOOKINGS);
  
  if (stored) {
    return stored.map((b) => ({
      ...b,
      startDate: new Date(b.startDate),
      endDate: new Date(b.endDate),
      guestLinkGenerated: b.guestLinkGenerated ? new Date(b.guestLinkGenerated) : undefined,
    }));
  }
  
  return [];
}

function saveBookings(bookings: Booking[]) {
  storage.set(StorageKeys.BOOKINGS, bookings);
}

let mockBookings: Booking[] = [];

// Initialize bookings on first load
if (typeof window !== 'undefined') {
  mockBookings = loadBookings();
}

export function getBookingsByPropertyId(propertyId: string): Booking[] {
  // Ensure bookings are loaded
  if (mockBookings.length === 0 && typeof window !== 'undefined') {
    mockBookings = loadBookings();
  }
  
  return mockBookings.filter(booking => booking.propertyId === propertyId)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}

export function generateGuestLink(bookingId: string, propertyId: string, regenerate = false): string {
  // Ensure bookings are loaded
  if (mockBookings.length === 0 && typeof window !== 'undefined') {
    mockBookings = loadBookings();
  }
  
  const booking = mockBookings.find(b => b.id === bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }
  
  const property = getPropertyById(propertyId);
  if (!property) {
    throw new Error('Property not found');
  }
  
  // Check if we already have a link and don't want to regenerate
  if (booking.guestLink && !regenerate) {
    return booking.guestLink;
  }
  
  // Format dates for URL (YYYY-MM-DD format)
  const startStr = booking.startDate.toISOString().split('T')[0];
  const endStr = booking.endDate.toISOString().split('T')[0];
  const stayParam = `${startStr}_to_${endStr}`;
  
  // Generate property slug from name
  const slug = property.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  // Create unique booking-specific URL with stay dates and booking ID
  const guestLink = `/guest/${slug}?stay=${stayParam}&booking=${bookingId}&property=${propertyId}`;
  
  // Update booking with generated link and timestamp
  booking.guestLink = guestLink;
  booking.guestLinkGenerated = new Date();
  
  saveBookings(mockBookings);
  
  return guestLink;
}

export function updateBookingsFromICal(propertyId: string, bookedDates: Array<{ start: Date; end: Date; summary?: string; uid?: string }>): Booking[] {
  // Ensure bookings are loaded
  if (mockBookings.length === 0 && typeof window !== 'undefined') {
    mockBookings = loadBookings();
  }
  
  // Remove existing bookings for this property
  mockBookings = mockBookings.filter(booking => booking.propertyId !== propertyId);
  
  // Add new bookings from iCal
  const newBookings: Booking[] = bookedDates.map((event, index) => ({
    id: `${propertyId}-${event.uid || Date.now()}-${index}`,
    propertyId,
    startDate: event.start,
    endDate: event.end,
    summary: event.summary || 'Reserved',
    uid: event.uid || `generated-${Date.now()}-${index}`,
  }));
  
  mockBookings.push(...newBookings);
  saveBookings(mockBookings);
  
  return newBookings;
}

export async function refreshPropertyCalendarData(propertyId: string): Promise<Booking[]> {
  // Ensure properties are loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  
  const property = mockProperties.find(p => p.id === propertyId);
  if (!property || !property.iCalUrl) {
    throw new Error('Property not found or iCal URL not configured');
  }
  
  try {
    // Import iCal functions dynamically to avoid circular dependency
    const { refreshPropertyCalendar } = await import('./ical');
    
    // Refresh calendar data
    await refreshPropertyCalendar(propertyId, property.iCalUrl);
    
    // Update property's last refresh timestamp
    property.lastCalendarRefresh = new Date();
    saveMockProperties(mockProperties);
    
    // Return the updated bookings
    return getBookingsByPropertyId(propertyId);
  } catch (error) {
    console.error(`Failed to refresh calendar for property ${propertyId}:`, error);
    throw error;
  }
}

export function shouldRefreshPropertyCalendar(propertyId: string, maxAgeHours = 1): boolean {
  // Ensure properties are loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  
  const property = mockProperties.find(p => p.id === propertyId);
  if (!property || !property.iCalUrl) {
    return false; // No iCal URL configured
  }
  
  if (!property.lastCalendarRefresh) {
    return true; // Never refreshed
  }
  
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  return Date.now() - property.lastCalendarRefresh.getTime() > maxAgeMs;
}

export function getBookingFromGuestLink(bookingId: string, propertyId: string): { booking: Booking | null; property: Property | null } {
  // Ensure data is loaded
  if (mockBookings.length === 0 && typeof window !== 'undefined') {
    mockBookings = loadBookings();
  }
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  
  const booking = mockBookings.find(b => b.id === bookingId && b.propertyId === propertyId) || null;
  const property = mockProperties.find(p => p.id === propertyId) || null;
  
  return { booking, property };
}

export function validateGuestLinkParams(stayParam: string, bookingId: string, propertyId: string): {
  isValid: boolean;
  error?: string;
  stayDates?: { startDate: Date; endDate: Date };
} {
  try {
    // Parse stay dates from URL parameter
    const [startStr, endStr] = stayParam.split('_to_');
    if (!startStr || !endStr) {
      return { isValid: false, error: 'Invalid stay date format' };
    }
    
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    // Get booking details
    const { booking, property } = getBookingFromGuestLink(bookingId, propertyId);
    
    if (!booking) {
      return { isValid: false, error: 'Booking not found' };
    }
    
    if (!property) {
      return { isValid: false, error: 'Property not found' };
    }
    
    // Verify the dates match the booking
    const bookingStart = booking.startDate.toISOString().split('T')[0];
    const bookingEnd = booking.endDate.toISOString().split('T')[0];
    
    if (startStr !== bookingStart || endStr !== bookingEnd) {
      return { isValid: false, error: 'Stay dates do not match booking dates' };
    }
    
    return {
      isValid: true,
      stayDates: { startDate, endDate }
    };
  } catch {
    return { isValid: false, error: 'Invalid link parameters' };
  }
}

export function updateProperty(id: string, updates: Partial<Omit<Property, 'id' | 'hostId' | 'createdAt'>>): Property | null {
  // Ensure mockProperties is loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  
  const propertyIndex = mockProperties.findIndex(property => property.id === id);
  
  if (propertyIndex === -1) {
    throw new Error('Property not found');
  }
  
  mockProperties[propertyIndex] = {
    ...mockProperties[propertyIndex],
    ...updates,
  };
  
  saveMockProperties(mockProperties);
  return mockProperties[propertyIndex];
}

export function deleteProperty(id: string, hostId: string): boolean {
  // Ensure mockProperties is loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  
  const propertyIndex = mockProperties.findIndex(
    property => property.id === id && property.hostId === hostId
  );
  
  if (propertyIndex === -1) {
    return false;
  }
  
  mockProperties.splice(propertyIndex, 1);
  saveMockProperties(mockProperties);
  return true;
}

// Order management functions
function loadOrders(): GroceryOrder[] {
  const stored = storage.get<(GroceryOrder & { createdAt: string; estimatedDelivery?: string })[]>(StorageKeys.ORDERS);
  
  if (stored) {
    return stored.map((order) => ({
      ...order,
      createdAt: order.createdAt,
      estimatedDelivery: order.estimatedDelivery || undefined,
    }));
  }
  
  return [];
}

function saveOrders(orders: GroceryOrder[]) {
  storage.set(StorageKeys.ORDERS, orders);
}

let mockOrders: GroceryOrder[] = [];

// Initialize orders on first load
if (typeof window !== 'undefined') {
  mockOrders = loadOrders();
}

export function getAllOrders(): GroceryOrder[] {
  // Ensure orders are loaded
  if (mockOrders.length === 0 && typeof window !== 'undefined') {
    mockOrders = loadOrders();
  }
  
  return mockOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getOrdersByPropertyId(propertyId: string): GroceryOrder[] {
  return getAllOrders().filter(order => order.propertyId === propertyId);
}

export function getOrdersByHostId(hostId: string): GroceryOrder[] {
  // Get all properties for this host
  const hostProperties = getPropertiesByHostId(hostId);
  const propertyIds = hostProperties.map(p => p.id);
  
  // Return orders for these properties
  return getAllOrders().filter(order => propertyIds.includes(order.propertyId));
}

export function getOrdersByGuestId(guestId: string): GroceryOrder[] {
  return getAllOrders().filter(order => order.guestId === guestId);
}

export function getOrderById(orderId: string): GroceryOrder | null {
  return getAllOrders().find(order => order.id === orderId) || null;
}

export function updateOrderStatus(orderId: string, status: GroceryOrder['status'], _updatedBy?: string): GroceryOrder | null {
  // Ensure orders are loaded
  if (mockOrders.length === 0 && typeof window !== 'undefined') {
    mockOrders = loadOrders();
  }
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
  };
  
  saveOrders(mockOrders);
  return mockOrders[orderIndex];
}

// Stocker-specific order management functions
 export function assignOrderToStocker(orderId: string, stockerId: string): GroceryOrder | null {
  // Ensure orders are loaded
  if (mockOrders.length === 0 && typeof window !== 'undefined') {
    mockOrders = loadOrders();
  }
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  // Update order with stocker assignment and change status
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    stockerId,
    status: 'shopping', // Change to shopping when claimed
  };
  
  saveOrders(mockOrders);
  return mockOrders[orderIndex];
}

export function getOrdersForStocker(stockerId: string): GroceryOrder[] {
  return getAllOrders().filter(order => order.stockerId === stockerId);
}

export function getAvailableOrdersForStockers(): GroceryOrder[] {
  return getAllOrders().filter(order => 
    order.status === 'confirmed' && !order.stockerId // Available for claiming
  );
}

export function completeOrderWithPhotos(orderId: string, photoUrls: string[]): GroceryOrder | null {
  // Ensure orders are loaded
  if (mockOrders.length === 0 && typeof window !== 'undefined') {
    mockOrders = loadOrders();
  }
  
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  const order = mockOrders[orderIndex];
  
  mockOrders[orderIndex] = {
    ...order,
    status: 'delivered',
    stockingPhotos: photoUrls,
    completedAt: new Date().toISOString(),
  };
  
  // Update stocker profile completed orders count
  if (order.stockerId) {
    updateStockerCompletedOrders(order.stockerId);
  }
  
  saveOrders(mockOrders);
  return mockOrders[orderIndex];
}

// Stocker profile management functions
export interface StockerProfile {
  id: string;
  userId: string;
  phone?: string;
  vehicleInfo?: string;
  serviceRadius: number;
  isActive: boolean;
  completedOrders: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

function loadStockerProfiles(): StockerProfile[] {
  const stored = storage.get<StockerProfile[]>('stocker_profiles');
  return stored || [];
}

function saveStockerProfiles(profiles: StockerProfile[]) {
  storage.set('stocker_profiles', profiles);
}

let mockStockerProfiles: StockerProfile[] = [];

// Initialize stocker profiles on first load
if (typeof window !== 'undefined') {
  mockStockerProfiles = loadStockerProfiles();
}

export function getStockerProfile(userId: string): StockerProfile | null {
  // Ensure profiles are loaded
  if (mockStockerProfiles.length === 0 && typeof window !== 'undefined') {
    mockStockerProfiles = loadStockerProfiles();
  }
  
  return mockStockerProfiles.find(profile => profile.userId === userId) || null;
}

export function createStockerProfile(userId: string, phone?: string, vehicleInfo?: string, serviceRadius = 25): StockerProfile {
  // Ensure profiles are loaded
  if (mockStockerProfiles.length === 0 && typeof window !== 'undefined') {
    mockStockerProfiles = loadStockerProfiles();
  }
  
  const newProfile: StockerProfile = {
    id: (mockStockerProfiles.length + 1).toString(),
    userId,
    phone,
    vehicleInfo,
    serviceRadius,
    isActive: true,
    completedOrders: 0,
    rating: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockStockerProfiles.push(newProfile);
  saveStockerProfiles(mockStockerProfiles);
  return newProfile;
}

export function updateStockerCompletedOrders(userId: string): void {
  // Ensure profiles are loaded
  if (mockStockerProfiles.length === 0 && typeof window !== 'undefined') {
    mockStockerProfiles = loadStockerProfiles();
  }
  
  const profileIndex = mockStockerProfiles.findIndex(profile => profile.userId === userId);
  
  if (profileIndex !== -1) {
    mockStockerProfiles[profileIndex].completedOrders += 1;
    mockStockerProfiles[profileIndex].updatedAt = new Date().toISOString();
    saveStockerProfiles(mockStockerProfiles);
  }
}

export function updateStockerRating(userId: string, newRating: number): void {
  // Ensure profiles are loaded
  if (mockStockerProfiles.length === 0 && typeof window !== 'undefined') {
    mockStockerProfiles = loadStockerProfiles();
  }
  
  const profileIndex = mockStockerProfiles.findIndex(profile => profile.userId === userId);
  
  if (profileIndex !== -1) {
    const profile = mockStockerProfiles[profileIndex];
    
    // Calculate average rating (simple approach - could be more sophisticated)
    if (profile.rating) {
      profile.rating = Math.round(((profile.rating + newRating) / 2) * 10) / 10;
    } else {
      profile.rating = newRating;
    }
    
    profile.updatedAt = new Date().toISOString();
    saveStockerProfiles(mockStockerProfiles);
  }
}

export function getStockerStats(userId: string): {
  completedOrders: number;
  totalRevenue: number;
  averageRating: number | null;
  activeOrders: number;
} {
  const profile = getStockerProfile(userId);
  const stockerOrders = getOrdersForStocker(userId);
  
  const completedOrders = stockerOrders.filter(order => order.status === 'delivered');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = stockerOrders.filter(order => order.status === 'shopping').length;
  
  return {
    completedOrders: completedOrders.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageRating: profile?.rating || null,
    activeOrders,
  };
}

export function getOrderStats(): {
  total: number;
  pending: number;
  confirmed: number;
  shopping: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  averageOrderValue: number;
} {
  const orders = getAllOrders();
  
  const stats = {
    total: orders.length,
    pending: 0,
    confirmed: 0,
    shopping: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  };
  
  orders.forEach(order => {
    stats[order.status]++;
    if (order.status !== 'cancelled') {
      stats.totalRevenue += order.total;
    }
  });
  
  stats.averageOrderValue = stats.total > 0 ? stats.totalRevenue / (stats.total - stats.cancelled) : 0;
  
  return stats;
}

export function getRecentOrders(limit = 10): GroceryOrder[] {
  return getAllOrders().slice(0, limit);
}

// Admin functions
export function getAllProperties(): Property[] {
  // Ensure mockProperties is loaded
  if (mockProperties.length === 0 && typeof window !== 'undefined') {
    mockProperties = loadMockProperties();
  }
  return mockProperties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getAllUsers(): Array<{
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'host' | 'guest' | 'stocker';
}> {
  // Ensure mockUsers is loaded
  if (mockUsers.length === 0 && typeof window !== 'undefined') {
    mockUsers = loadMockUsers();
  }
  
  return mockUsers.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function getUserStats(): {
  total: number;
  admins: number;
  hosts: number;
  guests: number;
  stockers: number;
} {
  const users = getAllUsers();
  
  return {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    hosts: users.filter(u => u.role === 'host').length,
    guests: users.filter(u => u.role === 'guest').length,
    stockers: users.filter(u => u.role === 'stocker').length,
  };
}

export function getPropertyStats(): {
  total: number;
  withIcal: number;
  recentlyActive: number;
} {
  const properties = getAllProperties();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return {
    total: properties.length,
    withIcal: properties.filter(p => p.iCalUrl).length,
    recentlyActive: properties.filter(p => 
      p.lastCalendarRefresh && p.lastCalendarRefresh > sevenDaysAgo
    ).length,
  };
}
