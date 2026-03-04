'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import { getAuthToken, isHost, removeAuthToken, getPropertiesByHostId, deleteProperty, User, Property, Booking, getBookingsByPropertyId, generateGuestLink, refreshPropertyCalendarData, shouldRefreshPropertyCalendar, getOrdersByHostId, updateOrderStatus, getBookingFromGuestLink } from '../../lib/auth';
import { type GroceryOrder } from '../../lib/groceries';
import { ShoppingCartIcon, ClockIcon, CheckCircleIcon, TruckIcon, XCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function HostDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookingsByProperty, setBookingsByProperty] = useState<Record<string, Booking[]>>({});
  const [orders, setOrders] = useState<GroceryOrder[]>([]);
  const [deletingProperty, setDeletingProperty] = useState<string | null>(null);
  const [refreshingProperty, setRefreshingProperty] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCalendarGuide, setShowCalendarGuide] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<GroceryOrder | null>(null);
  const [selectedOrderBooking, setSelectedOrderBooking] = useState<Booking | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getAuthToken();
    if (!currentUser || !isHost(currentUser)) {
      router.push('/auth/signin?callbackUrl=/host');
      return;
    }
    setUser(currentUser);
    
    // Load user's properties
    const userProperties = getPropertiesByHostId(currentUser.id);
    setProperties(userProperties);
    
    // Load bookings for each property
    const bookings: Record<string, Booking[]> = {};
    userProperties.forEach(property => {
      bookings[property.id] = getBookingsByPropertyId(property.id);
    });
    setBookingsByProperty(bookings);
    
    // Load orders for this host
    const hostOrders = getOrdersByHostId(currentUser.id);
    setOrders(hostOrders);
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/');
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (!user) return;
    
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      setDeletingProperty(propertyId);
      
      const success = deleteProperty(propertyId, user.id);
      if (success) {
        // Refresh properties list
        const updatedProperties = getPropertiesByHostId(user.id);
        setProperties(updatedProperties);
        
        // Remove bookings for deleted property
        const updatedBookings = { ...bookingsByProperty };
        delete updatedBookings[propertyId];
        setBookingsByProperty(updatedBookings);
      }
      
      setDeletingProperty(null);
    }
  };
  
  const handleRefreshCalendar = async (propertyId: string) => {
    if (!user) return;
    
    setRefreshingProperty(propertyId);
    
    try {
      const updatedBookings = await refreshPropertyCalendarData(propertyId);
      setBookingsByProperty(prev => ({
        ...prev,
        [propertyId]: updatedBookings
      }));
      
      // Update the property's lastCalendarRefresh timestamp
      const updatedProperties = getPropertiesByHostId(user.id);
      setProperties(updatedProperties);
    } catch (error) {
      console.error('Failed to refresh calendar:', error);
      alert('Failed to refresh calendar. Please check the iCal URL and try again.');
    } finally {
      setRefreshingProperty(null);
    }
  };
  
  const handleGenerateGuestLink = (bookingId: string, propertyId: string, regenerate = false) => {
    try {
      const guestLink = generateGuestLink(bookingId, propertyId, regenerate);
      
      // Update bookings to reflect the generated link
      setBookingsByProperty(prev => ({
        ...prev,
        [propertyId]: getBookingsByPropertyId(propertyId)
      }));
      
      const fullUrl = `${window.location.origin}${guestLink}`;
      
      // Copy to clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(fullUrl);
        const action = regenerate ? 'regenerated and copied' : 'generated and copied';
        alert(`Guest link ${action} to clipboard!\n\n${fullUrl}`);
      } else {
        const action = regenerate ? 'regenerated' : 'generated';
        alert(`Guest link ${action}:\n\n${fullUrl}`);
      }
    } catch (error) {
      console.error('Failed to generate guest link:', error);
      alert('Failed to generate guest link. Please try again.');
    }
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: GroceryOrder['status']) => {
    const updatedOrder = updateOrderStatus(orderId, newStatus, user?.id);
    if (updatedOrder && user) {
      // Refresh orders
      const hostOrders = getOrdersByHostId(user.id);
      setOrders(hostOrders);
    }
  };

  const handleSelectOrder = (order: GroceryOrder) => {
    setSelectedOrder(order);
    // Get booking information for the order
    const { booking } = getBookingFromGuestLink(order.bookingId, order.propertyId);
    setSelectedOrderBooking(booking);
  };

  const getOrderStatusIcon = (status: GroceryOrder['status']) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'confirmed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'shopping': return <ShoppingCartIcon className="w-4 h-4" />;
      case 'delivered': return <TruckIcon className="w-4 h-4" />;
      case 'cancelled': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getOrderStatusColor = (status: GroceryOrder['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shopping': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const hasProperties = properties.length > 0;
  
  // Calculate order stats
  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'confirmed' || order.status === 'shopping'
  ).length;
  
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="lg" className="text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                StayStocked
              </h1>
            </Link>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, <span className="font-medium">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Host Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your properties and guest orders</p>
        </div>

        {!hasProperties ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Logo size="lg" className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
                {'Welcome to StayStocked&apos;!'}
              </h3>
              <p className="text-gray-600 mb-8">
                Get started by adding your first property. Once you add properties and receive orders, your dashboard will show detailed analytics and management tools.
              </p>
              <Link
                href="/host/add-property"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Property
              </Link>
            </div>
          </div>
        ) : (
          /* Dashboard with Properties */
          <>
            {/* Calendar Refresh Guide */}
            <div className="bg-green-50 border border-green-200 rounded-lg mb-8">
              <div className="p-4">
                <button
                  onClick={() => setShowCalendarGuide(!showCalendarGuide)}
                  className="flex items-center justify-between w-full text-left hover:bg-green-100 -m-4 p-4 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-green-900">How to Keep Your Calendar In Sync</h3>
                  </div>
                  <svg className={`w-5 h-5 text-green-600 transform transition-transform ${
                    showCalendarGuide ? 'rotate-180' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showCalendarGuide && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="text-green-800 space-y-3 text-sm">
                      <p className="font-medium">When you make changes in Airbnb or VRBO (new bookings, cancellations, date changes):</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-3">
                          <p className="font-semibold text-green-900 flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Manual Refresh</span>
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs pl-2">
                            <li>Click the <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">Refresh</span> button next to your property</li>
                            <li>Updates your bookings <strong>immediately</strong></li>
                            <li>Perfect when you just made changes in Airbnb/VRBO</li>
                            <li>Takes 5-10 seconds to complete</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <p className="font-semibold text-green-900 flex items-center space-x-2">
                            <span className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs font-medium">Auto-Refresh</span>
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs pl-2">
                            <li>Calendars automatically refresh <strong>every hour</strong></li>
<li>Look for <span className="text-orange-600 font-medium">&ldquo;Calendar needs refresh&rdquo;</span> indicator</li>
                            <li>Keeps your guest links accurate</li>
                            <li>No action needed - happens in background</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-green-100 rounded-lg">
                        <p className="text-xs font-bold text-green-900 mb-2">Best Practices:</p>
                        <ul className="text-xs text-green-800 space-y-1 list-disc list-inside">
                          <li><strong>Always refresh</strong> after making booking changes before generating guest links</li>
                          <li><strong>Check the booking count</strong> next to each property to verify accuracy</li>
                          <li><strong>Generate guest links</strong> only after confirming bookings are up to date</li>
                          <li><strong>Links are unique to each booking</strong> - includes specific stay dates and property info</li>
                          <li><strong>Regenerate links if needed</strong> - use the &ldquo;Regenerate&rdquo; button to create a new link</li>
                          <li><strong>Copy links to clipboard</strong> and share with guests via your usual communication</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Logo size="sm" className="text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-display">{properties.length}</div>
                    <div className="text-gray-600 text-sm">Properties</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-display">{activeOrders}</div>
                    <div className="text-gray-600 text-sm">Active Orders</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-display">
                      {Object.values(bookingsByProperty).flat().length}
                    </div>
                    <div className="text-gray-600 text-sm">Total Bookings</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 font-display">${totalRevenue.toFixed(0)}</div>
                    <div className="text-gray-600 text-sm">Total Revenue</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties and Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Your Properties */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Your Properties</h3>
                  <Link
                    href="/host/add-property"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    + Add Property
                  </Link>
                </div>
                <div className="p-6 space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Logo size="sm" className="text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{property.name}</div>
                          <div className="text-sm text-gray-600">{property.address}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Max {property.maxGuests} guests • {property.amenities.length} amenities • {property.kitchenAmenities?.length || 0} kitchen items
                          </div>
                          {property.iCalUrl && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                              <span>{bookingsByProperty[property.id]?.length || 0} bookings</span>
                              {shouldRefreshPropertyCalendar(property.id) && (
                                <span className="text-orange-600">• Calendar needs refresh</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex space-x-2 flex-wrap">
                          <Link
                            href={`/host/edit-property/${property.id}`}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors"
                          >
                            Edit
                          </Link>
                          {property.iCalUrl && (
                            <button
                              onClick={() => handleRefreshCalendar(property.id)}
                              disabled={refreshingProperty === property.id}
                              className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {refreshingProperty === property.id ? 'Refreshing...' : 'Refresh'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deletingProperty === property.id}
                            className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingProperty === property.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Guest Link:</span>
                          <br />
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs break-all">
                            {typeof window !== 'undefined' ? window.location.origin : ''}{property.shoppingLink}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Upcoming Bookings</h3>
                </div>
                <div className="p-6">
                  {(() => {
                    // Get all future bookings across all properties
                    const allBookings = Object.entries(bookingsByProperty)
                      .flatMap(([propertyId, bookings]) => 
                        bookings
                          .filter(booking => booking.startDate >= new Date())
                          .map(booking => ({ ...booking, property: properties.find(p => p.id === propertyId) }))
                      )
                      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                      .slice(0, 5); // Show only next 5 bookings
                    
                    if (allBookings.length === 0) {
                      return (
                        <div className="text-center py-8">
                          <svg className="mx-auto w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-600">No upcoming bookings found.</p>
                          <p className="text-gray-500 text-sm mt-1">Configure iCal URLs for your properties to sync booking data.</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="space-y-3">
                        {allBookings.map((booking) => {
                          const stayDuration = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24));
                          
                          return (
                            <div key={booking.id} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{booking.property?.name}</div>
                                      <div className="text-sm text-gray-600">{booking.summary}</div>
                                    </div>
                                  </div>
                                  <div className="ml-11 space-y-1">
                                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                                      <span className="flex items-center space-x-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>Check-in: {booking.startDate.toLocaleDateString()}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>Check-out: {booking.endDate.toLocaleDateString()}</span>
                                      </span>
                                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {stayDuration} night{stayDuration !== 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  {booking.guestLink ? (
                                    <div className="text-right space-y-1">
                                      <div className="text-xs text-green-600 font-medium flex items-center space-x-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Link active</span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Generated {booking.guestLinkGenerated?.toLocaleDateString()}
                                      </div>
                                      <div className="flex space-x-1">
                                        <button
                                          onClick={() => {
                                            if (booking.guestLink && typeof navigator !== 'undefined' && navigator.clipboard) {
                                              navigator.clipboard.writeText(`${window.location.origin}${booking.guestLink}`);
                                              alert('Guest link copied to clipboard!');
                                            }
                                          }}
                                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium transition-colors"
                                        >
                                          Copy
                                        </button>
                                        <button
                                          onClick={() => handleGenerateGuestLink(booking.id, booking.propertyId, true)}
                                          className="bg-orange-50 hover:bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium transition-colors"
                                        >
                                          Regenerate
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleGenerateGuestLink(booking.id, booking.propertyId)}
                                      className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center space-x-1"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                      <span>Generate Link</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {Object.values(bookingsByProperty).flat().filter(b => b.startDate >= new Date()).length > 5 && (
                          <div className="text-center pt-3">
                            <p className="text-sm text-gray-500">
                              Showing next 5 bookings. Total: {Object.values(bookingsByProperty).flat().filter(b => b.startDate >= new Date()).length} upcoming
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Recent Orders - Full Width */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Recent Orders</h3>
                  <div className="flex items-center space-x-2">
                    <ShoppingCartIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">{orders.length} total</span>
                  </div>
                </div>
                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCartIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600">No orders yet.</p>
                      <p className="text-gray-500 text-sm mt-1">Orders will appear here when guests use your shopping links.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 8).map((order) => {
                        const property = properties.find(p => p.id === order.propertyId);
                        const orderDate = new Date(order.createdAt);
                        
                        return (
                          <div key={order.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <ShoppingCartIcon className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{property?.name || 'Unknown Property'}</div>
                                  <div className="text-sm text-gray-600">{order.guestInfo.name}</div>
                                </div>
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <CurrencyDollarIcon className="w-4 h-4" />
                                    <span className="font-medium">${order.total.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>{orderDate.toLocaleDateString()}</span>
                                  </div>
                                  <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                                  {getOrderStatusIcon(order.status)}
                                  <span className="capitalize">{order.status}</span>
                                </div>
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                  <div className="flex space-x-2">
                                    {order.status === 'pending' && (
                                      <button
                                        onClick={() => handleOrderStatusUpdate(order.id, 'confirmed')}
                                        className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        Confirm
                                      </button>
                                    )}
                                    {order.status === 'confirmed' && (
                                      <button
                                        onClick={() => handleOrderStatusUpdate(order.id, 'shopping')}
                                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        Start Shopping
                                      </button>
                                    )}
                                    {order.status === 'shopping' && (
                                      <button
                                        onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}
                                        className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        Mark Delivered
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleSelectOrder(order)}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                    >
                                      View Details
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {orders.length > 8 && (
                        <div className="text-center pt-3">
                          <p className="text-sm text-gray-500">
                            Showing latest 8 orders. Total: {orders.length} orders
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            {/* Order Details Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 font-display">Order Details</h3>
                        <p className="text-sm text-gray-600 mt-1">Order #{selectedOrder.id}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedOrder(null);
                          setSelectedOrderBooking(null);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <XCircleIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Guest</p>
                        <p className="text-gray-900">{selectedOrder.guestInfo.name}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.guestInfo.email}</p>
                        {selectedOrder.guestInfo.phone && (
                          <p className="text-sm text-gray-600">{selectedOrder.guestInfo.phone}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Property</p>
                        <p className="text-gray-900">{properties.find(p => p.id === selectedOrder.propertyId)?.name}</p>
                        <p className="text-sm text-gray-600">Order placed: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Stay Dates */}
                    {selectedOrderBooking && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Stay Dates</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2 text-blue-700">
                              <ClockIcon className="w-4 h-4" />
                              <span className="font-medium">Check-in:</span>
                              <span>{selectedOrderBooking.startDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-blue-700">
                              <ClockIcon className="w-4 h-4" />
                              <span className="font-medium">Check-out:</span>
                              <span>{selectedOrderBooking.endDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-blue-600">
                            {Math.ceil((selectedOrderBooking.endDate.getTime() - selectedOrderBooking.startDate.getTime()) / (1000 * 60 * 60 * 24))} night stay
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Status */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
                      <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border ${getOrderStatusColor(selectedOrder.status)}`}>
                        {getOrderStatusIcon(selectedOrder.status)}
                        <span className="capitalize font-medium">{selectedOrder.status}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-3">Items ({selectedOrder.items.length})</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">{item.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">${item.price.toFixed(2)}/{item.unit}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">×{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="border-t pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span>${selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span>${selectedOrder.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                          <span>Total</span>
                          <span className="text-green-600">${selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedOrder.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Delivery Notes</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                      </div>
                    )}

                    {/* Delivery Photos */}
                    {selectedOrder.status === 'delivered' && selectedOrder.stockingPhotos && selectedOrder.stockingPhotos.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Delivery Confirmation Photos</p>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedOrder.stockingPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={photo}
                                alt={`Delivery confirmation ${index + 1}`}
                                width={200}
                                height={128}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:border-green-300 transition-colors cursor-pointer"
                                onClick={() => {
                                  // Open photo in new window for full view
                                  window.open(photo, '_blank');
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                                <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Photos uploaded by stocker on {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleDateString() : 'completion'}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                      <div className="flex space-x-3 pt-4 border-t">
                        {selectedOrder.status === 'pending' && (
                          <button
                            onClick={() => {
                              handleOrderStatusUpdate(selectedOrder.id, 'confirmed');
                              setSelectedOrder(null);
                              setSelectedOrderBooking(null);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
                          >
                            Confirm Order
                          </button>
                        )}
                        {selectedOrder.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              handleOrderStatusUpdate(selectedOrder.id, 'shopping');
                              setSelectedOrder(null);
                              setSelectedOrderBooking(null);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
                          >
                            Start Shopping
                          </button>
                        )}
                        {selectedOrder.status === 'shopping' && (
                          <button
                            onClick={() => {
                              handleOrderStatusUpdate(selectedOrder.id, 'delivered');
                              setSelectedOrder(null);
                              setSelectedOrderBooking(null);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-1"
                          >
                            Mark as Delivered
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleOrderStatusUpdate(selectedOrder.id, 'cancelled');
                            setSelectedOrder(null);
                            setSelectedOrderBooking(null);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
