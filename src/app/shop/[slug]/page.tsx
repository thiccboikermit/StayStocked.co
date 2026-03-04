'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { CalendarIcon, HomeIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Logo from '../../../components/Logo';
import { getAuthToken, isGuest, getPropertyByShoppingLink, validateGuestLinkParams, getBookingFromGuestLink, type Booking } from '../../../lib/auth';
import { fetchICalFeed, validateBookingDates, type BookedDate } from '../../../lib/ical';
import { storage, StorageKeys } from '../../../lib/storage';

export default function ShoppingPage() {
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [property, setProperty] = useState<{ id: string; name: string; address: string; maxGuests: number; kitchenAmenities?: string[]; iCalUrl?: string } | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isBookingSpecific, setIsBookingSpecific] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateLoading, setDateLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [step, setStep] = useState<'dates' | 'method'>('dates');
  
  const [stayDetails, setStayDetails] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const loadPropertyData = useCallback(async () => {
    try {
      // Check if this is a booking-specific link
      const stayParam = searchParams.get('stay');
      const bookingId = searchParams.get('booking');
      const propertyId = searchParams.get('property');
      
      if (stayParam && bookingId && propertyId) {
        // This is a booking-specific guest link
        const validation = validateGuestLinkParams(stayParam, bookingId, propertyId);
        
        if (validation.isValid && validation.stayDates) {
          setIsBookingSpecific(true);
          
          // Get booking and property data
          const { booking, property: propertyData } = getBookingFromGuestLink(bookingId, propertyId);
          
          if (booking && propertyData) {
            setBooking(booking);
            setProperty(propertyData);
            
            // Pre-populate the stay details with booking dates
            setStayDetails({
              checkIn: validation.stayDates.startDate.toISOString().split('T')[0],
              checkOut: validation.stayDates.endDate.toISOString().split('T')[0],
              guests: 1, // Default to 1, can be changed by user
            });
            
            // For booking-specific links, show everything on one page (no step change)
            // setStep('method'); - Remove this to show all info on one page
          } else {
            setError('Booking or property not found. Please contact the host for a new link.');
          }
        } else {
          setError(validation.error || 'Invalid booking link. Please contact the host for a new link.');
        }
      } else {
        // Regular property shopping link (no specific booking)
        const propertyData = getPropertyByShoppingLink(slug);
        
        if (!propertyData) {
          setError('Property not found. Please check the link or contact the host.');
          setLoading(false);
          return;
        }

        setProperty(propertyData);
        setIsBookingSpecific(false);

        // Load iCal data if available
        if (propertyData.iCalUrl) {
          try {
            const calendarData = await fetchICalFeed(propertyData.iCalUrl);
            setBookedDates(calendarData.bookedDates);
          } catch (error) {
            console.warn('Could not load calendar data:', error);
            // Don't block the user, just proceed without calendar validation
          }
        }
      }
    } catch (error) {
      console.error('Error loading property data:', error);
      setError('Failed to load property information');
    } finally {
      setLoading(false);
    }
  }, [slug, searchParams]);

  useEffect(() => {
    const currentUser = getAuthToken();
    if (!currentUser || !isGuest(currentUser)) {
      // Redirect to guest registration for this property
      router.push(`/shop/${slug}/register`);
      return;
    }
    setUser(currentUser);

    // Load property data and iCal feed
    loadPropertyData();
  }, [router, slug, loadPropertyData]);

  const handleDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDateLoading(true);
    setDateError('');

    try {
      const checkInDate = new Date(stayDetails.checkIn);
      const checkOutDate = new Date(stayDetails.checkOut);

      // Basic validation
      if (checkInDate >= checkOutDate) {
        setDateError('Check-out date must be after check-in date');
        return;
      }

      if (checkInDate < new Date()) {
        setDateError('Check-in date cannot be in the past');
        return;
      }

      // Validate against iCal if available
      if (bookedDates.length > 0) {
        const validation = validateBookingDates(checkInDate, checkOutDate, bookedDates);
        if (!validation.isValid) {
          setDateError(validation.error || 'Selected dates are not available');
          return;
        }
      }

      // Dates are valid, proceed to method selection
      setStep('method');
    } catch {
      setDateError('Please enter valid dates');
    } finally {
      setDateLoading(false);
    }
  };

  const handleMethodSelect = (method: 'ai' | 'manual') => {
    if (!property) return;
    
    // Store stay details for the shopping session
    const shoppingSession = {
      propertyId: property.id,
      propertyName: property.name,
      checkIn: stayDetails.checkIn,
      checkOut: stayDetails.checkOut,
      guests: stayDetails.guests,
      method
    };
    
    // Store in secure storage with TTL (expires in 24 hours)
    storage.set(StorageKeys.SHOPPING_SESSION, shoppingSession, { ttl: 24 * 60 * 60 * 1000 });

    // Redirect to appropriate shopping experience
    if (method === 'ai') {
      router.push(`/shop/${slug}/ai-planner`);
    } else {
      router.push(`/shop/${slug}/manual`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Logo size="lg" className="text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!user || !property) {
    return null;
  }

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const stayNights = stayDetails.checkIn && stayDetails.checkOut 
    ? Math.ceil((new Date(stayDetails.checkOut).getTime() - new Date(stayDetails.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="lg" className="text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                StayStocked
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <span className="font-medium">{user.name}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Property Info Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Pre-Stock Your Stay
          </h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-green-100">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
              <div className="flex items-center">
                <HomeIcon className="w-5 h-5 mr-2 text-green-600" />
                <span className="font-medium">{property.name}</span>
              </div>
              <div className="flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2 text-green-600" />
                <span>Max {property.maxGuests} guests</span>
              </div>
              {property.kitchenAmenities && (
                <div className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                  <span>{property.kitchenAmenities.length} kitchen items available</span>
                </div>
              )}
            </div>
            <p className="mt-3 text-gray-700 text-center">{property.address}</p>
          </div>
        </div>

        {step === 'dates' && !isBookingSpecific ? (
          /* Stay Details Form */
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-green-100 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">
              {isBookingSpecific ? 'Confirm Your Stay Details' : 'Enter Your Stay Details'}
            </h3>
            
            {isBookingSpecific && booking && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Booking Details Confirmed</h4>
                    <p className="text-green-800 text-sm mt-1">
                      Your stay dates have been automatically filled from your booking confirmation.
                    </p>
                    <p className="text-green-700 text-xs mt-2">
                      Booking: {booking.summary} • Check-in: {new Date(booking.startDate).toLocaleDateString()} • Check-out: {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleDateSubmit} className="space-y-6">
              {dateError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{dateError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="checkIn"
                      value={stayDetails.checkIn}
                      min={today}
                      max={maxDateStr}
                      onChange={(e) => setStayDetails(prev => ({ ...prev, checkIn: e.target.value }))}
                      readOnly={isBookingSpecific}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm text-gray-900 ${
                        isBookingSpecific 
                          ? 'border-green-300 bg-green-50 cursor-not-allowed' 
                          : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      id="checkOut"
                      value={stayDetails.checkOut}
                      min={stayDetails.checkIn || today}
                      max={maxDateStr}
                      onChange={(e) => setStayDetails(prev => ({ ...prev, checkOut: e.target.value }))}
                      readOnly={isBookingSpecific}
                      className={`block w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm text-gray-900 ${
                        isBookingSpecific 
                          ? 'border-green-300 bg-green-50 cursor-not-allowed' 
                          : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <select
                  id="guests"
                  value={stayDetails.guests}
                  onChange={(e) => setStayDetails(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="block w-32 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                >
                  {Array.from({ length: property.maxGuests }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>

              {stayDetails.checkIn && stayDetails.checkOut && stayNights > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-green-800 font-medium">
                    Stay Summary: {stayNights} night{stayNights === 1 ? '' : 's'} for {stayDetails.guests} guest{stayDetails.guests === 1 ? '' : 's'}
                  </p>
                  {isBookingSpecific && booking ? (
                    <p className="text-green-700 text-sm mt-1">
                      ✓ Dates confirmed from your {booking.summary} booking
                    </p>
                  ) : property.iCalUrl && bookedDates.length > 0 && (
                    <p className="text-green-700 text-sm mt-1">
                      ✓ Dates validated against property calendar
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={dateLoading || !stayDetails.checkIn || !stayDetails.checkOut}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dateLoading ? 'Validating Dates...' : 'Continue to Shopping Options'}
              </button>
            </form>
          </div>
        ) : isBookingSpecific ? (
          /* Booking-Specific: Show stay confirmation and shopping methods together */
          <div className="space-y-8">
            {/* Stay Details Confirmation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 border-green-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">
                Your Stay Details
              </h3>
              
              {booking && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Booking Confirmed</h4>
                      <p className="text-green-800 text-sm mt-1">
                        {booking.summary}
                      </p>
                      <p className="text-green-700 text-xs mt-2">
                        Check-in: {new Date(booking.startDate).toLocaleDateString()} • Check-out: {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={stayDetails.checkIn}
                      readOnly
                      className="block w-full pl-10 pr-4 py-3 border border-green-300 bg-green-50 cursor-not-allowed rounded-lg shadow-sm text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={stayDetails.checkOut}
                      readOnly
                      className="block w-full pl-10 pr-4 py-3 border border-green-300 bg-green-50 cursor-not-allowed rounded-lg shadow-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Guests
                </label>
                <select
                  id="guests"
                  value={stayDetails.guests}
                  onChange={(e) => setStayDetails(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  className="block w-32 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                >
                  {Array.from({ length: property.maxGuests }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>
              
              {stayDetails.checkIn && stayDetails.checkOut && stayNights > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-green-800 font-medium">
                    Stay Summary: {stayNights} night{stayNights === 1 ? '' : 's'} for {stayDetails.guests} guest{stayDetails.guests === 1 ? '' : 's'}
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    ✓ Dates confirmed from your {booking?.summary} booking
                  </p>
                </div>
              )}
            </div>
            
            {/* Shopping Method Selection */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Choose Your Shopping Experience
              </h3>
              <p className="text-gray-600">
                How would you like to create your grocery list for your {stayNights}-night stay?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI Meal Planner */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 hover:border-green-300 p-8 hover:shadow-lg transition-all duration-200">
                <div className="text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">AI Meal Planner</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                    Get an optimized shopping list created just for your stay. Our AI considers your group size, trip length, dietary preferences, and available kitchen equipment to create the perfect meal plan and grocery list.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h5 className="font-semibold text-green-800 mb-2">Includes:</h5>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Personalized meal suggestions</li>
                      <li>• Optimized portions for {stayDetails.guests} guest{stayDetails.guests === 1 ? '' : 's'}</li>
                      <li>• Kitchen equipment compatibility</li>
                      <li>• Smart shopping list organization</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleMethodSelect('ai')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start AI Meal Planning
                  </button>
                </div>
              </div>

              {/* Manual Shopping */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 hover:border-green-300 p-8 hover:shadow-lg transition-all duration-200">
                <div className="text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4a1 1 0 00.9 1.1H19" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">Manual Shopping</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                    Browse and select groceries yourself from our curated marketplace. Perfect for guests who know exactly what they want or prefer to build their shopping list item by item.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h5 className="font-semibold text-green-800 mb-2">Features:</h5>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Browse by category</li>
                      <li>• Add items to your cart</li>
                      <li>• Flexible quantities and brands</li>
                      <li>• Complete control over your list</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleMethodSelect('manual')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Browse Grocery Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Regular Shopping Method Selection */
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-display">
                Choose Your Shopping Experience
              </h3>
              <p className="text-gray-600">
                How would you like to create your grocery list for your {stayNights}-night stay?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI Meal Planner */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 hover:border-green-300 p-8 hover:shadow-lg transition-all duration-200">
                <div className="text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">AI Meal Planner</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                    Get an optimized shopping list created just for your stay. Our AI considers your group size, trip length, dietary preferences, and available kitchen equipment to create the perfect meal plan and grocery list.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h5 className="font-semibold text-green-800 mb-2">Includes:</h5>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Personalized meal suggestions</li>
                      <li>• Optimized portions for {stayDetails.guests} guest{stayDetails.guests === 1 ? '' : 's'}</li>
                      <li>• Kitchen equipment compatibility</li>
                      <li>• Smart shopping list organization</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleMethodSelect('ai')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Start AI Meal Planning
                  </button>
                </div>
              </div>

              {/* Manual Shopping */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 hover:border-green-300 p-8 hover:shadow-lg transition-all duration-200">
                <div className="text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4a1 1 0 00.9 1.1H19" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 font-display">Manual Shopping</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                    Browse and select exactly what you want from our grocery catalog. Perfect if you have specific brands, dietary needs, or preferences you want to control personally.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4 mb-6">
                    <h5 className="font-semibold text-green-800 mb-2">Features:</h5>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Full grocery catalog access</li>
                      <li>• Brand and product selection</li>
                      <li>• Custom quantities and notes</li>
                      <li>• Complete shopping control</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleMethodSelect('manual')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg font-semibold transition-colors transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Browse Grocery Selection
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('dates')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to Change Dates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}