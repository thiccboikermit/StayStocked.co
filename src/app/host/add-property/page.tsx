'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../../components/Logo';
import { getAuthToken, isHost, addProperty, User } from '../../../lib/auth';

export default function AddPropertyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    amenities: [] as string[],
    kitchenAmenities: [] as string[],
    accessInstructions: '',
    maxGuests: 1,
    iCalUrl: '',
  });
  
  const router = useRouter();

  useEffect(() => {
    const currentUser = getAuthToken();
    if (!currentUser || !isHost(currentUser)) {
      router.push('/auth/signin?callbackUrl=/host/add-property');
      return;
    }
    setUser(currentUser);
  }, [router]);

  const amenitiesList = [
    'WiFi',
    'Kitchen',
    'Washer & Dryer',
    'TV',
    'Air Conditioning',
    'Heating',
    'Hot Tub',
    'Pool',
    'Gym',
    'Parking',
    'Pets Allowed',
    'Smoking Allowed',
    'Breakfast Included',
    'Late Check-in'
  ];

  const kitchenAmenitiesList = [
    'Full-Size Refrigerator',
    'Freezer',
    'Stove/Cooktop',
    'Oven',
    'Microwave',
    'Dishwasher',
    'Coffee Maker',
    'Toaster',
    'Blender',
    'Food Processor',
    'Stand Mixer',
    'Rice Cooker',
    'Slow Cooker/Crock Pot',
    'Air Fryer',
    'Instant Pot/Pressure Cooker',
    'Grill (Indoor)',
    'Griddle/Pancake Maker',
    'Waffle Maker',
    'Ice Maker',
    'Wine Fridge',
    'Garbage Disposal',
    'Basic Cookware (Pots & Pans)',
    'Baking Sheets & Dishes',
    'Cutting Boards',
    'Sharp Knives',
    'Measuring Cups & Spoons',
    'Can Opener',
    'Bottle Opener/Corkscrew',
    'Serving Utensils',
    'Plates & Bowls',
    'Cups & Glasses',
    'Silverware/Cutlery',
    'Storage Containers',
    'Aluminum Foil & Plastic Wrap',
    'Paper Towels',
    'Dish Soap & Sponges'
  ];

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleKitchenAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      kitchenAmenities: prev.kitchenAmenities.includes(amenity)
        ? prev.kitchenAmenities.filter(a => a !== amenity)
        : [...prev.kitchenAmenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!user) {
        setError('Please sign in to add a property');
        return;
      }

      if (formData.name.trim() === '' || formData.address.trim() === '') {
        setError('Please fill in all required fields');
        return;
      }

      const newProperty = addProperty({
        hostId: user.id,
        name: formData.name.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        amenities: formData.amenities,
        kitchenAmenities: formData.kitchenAmenities,
        accessInstructions: formData.accessInstructions.trim(),
        maxGuests: formData.maxGuests,
        iCalUrl: formData.iCalUrl.trim() || undefined,
      });

      if (newProperty) {
        router.push('/host'); // Redirect back to dashboard
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while adding the property');
      }
    } finally {
      setLoading(false);
    }
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/host" className="flex items-center space-x-3">
              <Logo size="lg" className="text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                StayStocked
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/host"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <span className="text-gray-700">
                Welcome, <span className="font-medium">{user.name}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 font-display">Add New Property</h2>
          <p className="text-gray-600 mt-1">Fill in the details of your vacation rental property</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Property Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="e.g., Lakeside Retreat, Downtown Loft"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="123 Main Street, City, State, ZIP"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Property Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="Describe your property, its features, and what makes it special..."
              />
            </div>

            {/* Max Guests */}
            <div>
              <label htmlFor="maxGuests" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Number of Guests
              </label>
              <input
                type="number"
                id="maxGuests"
                min="1"
                max="20"
                value={formData.maxGuests}
                onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: parseInt(e.target.value) || 1 }))}
                className="block w-20 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                General Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={amenity} className="ml-2 text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Kitchen Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kitchen Equipment & Amenities
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Select all kitchen appliances, cookware, and supplies available at your property. This helps stockers understand what items guests can actually use.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {kitchenAmenitiesList.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`kitchen-${amenity}`}
                      checked={formData.kitchenAmenities.includes(amenity)}
                      onChange={() => handleKitchenAmenityChange(amenity)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`kitchen-${amenity}`} className="ml-2 text-sm text-gray-700">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Instructions */}
            <div>
              <label htmlFor="accessInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                Access Instructions for Stockers
              </label>
              <textarea
                id="accessInstructions"
                rows={3}
                value={formData.accessInstructions}
                onChange={(e) => setFormData(prev => ({ ...prev, accessInstructions: e.target.value }))}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="How should stockers access the property? Include keycode, lockbox location, contact info, etc."
              />
              <p className="mt-2 text-sm text-gray-500">
                This information will only be shared with verified stockers when they accept an order.
              </p>
            </div>

            {/* iCal URL (Optional) */}
            <div>
              <label htmlFor="iCalUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Airbnb Calendar URL (Optional)
              </label>
              <input
                type="url"
                id="iCalUrl"
                value={formData.iCalUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, iCalUrl: e.target.value }))}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                placeholder="https://www.airbnb.com/calendar/ical/..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Import your Airbnb calendar to automatically validate guest booking dates. This ensures orders are only placed for legitimate stays and prevents conflicts with existing bookings.
              </p>
              <details className="mt-3">
                <summary className="text-sm text-green-600 cursor-pointer hover:text-green-700 font-medium">
                  How to find your Airbnb calendar URL
                </summary>
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Log into your Airbnb host account</li>
                    <li>Go to your property&apos;s calendar</li>
                    <li>Click &quot;Availability settings&quot; → &quot;Calendar sync&quot;</li>
                    <li>Copy the &quot;Export calendar&quot; URL</li>
                    <li>Paste it here to sync your booking dates</li>
                  </ol>
                </div>
              </details>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </button>
              <Link
                href="/host"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-colors text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}