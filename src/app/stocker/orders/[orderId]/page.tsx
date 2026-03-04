'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, CameraIcon, CheckIcon } from '@heroicons/react/24/outline';
import Logo from '../../../../components/Logo';
import { getAuthToken, getOrderById, getPropertyById } from '../../../../lib/auth';
import type { GroceryOrder } from '../../../../lib/groceries';
import type { Property } from '../../../../lib/auth';

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [order, setOrder] = useState<GroceryOrder | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const currentUser = getAuthToken();
    if (currentUser?.role !== 'stocker') {
      router.push('/auth/signin');
      return;
    }
    setUser(currentUser);
    fetchOrderDetails();
  }, [params.orderId]);

  const fetchOrderDetails = async () => {
    try {
      const orderId = params.orderId as string;
      const orderData = getOrderById(orderId);
      
      if (!orderData) {
        router.push('/stocker');
        return;
      }

      setOrder(orderData);

      // Get property details
      const propertyData = getPropertyById(orderData.propertyId);
      setProperty(propertyData);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // For demo purposes, we'll create data URLs
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedPhotos(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const completeOrder = async () => {
    if (!order || !user || uploadedPhotos.length === 0) return;

    setCompleting(true);
    try {
      const response = await fetch('/api/orders/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          stockerId: user.id,
          photoUrls: uploadedPhotos,
        }),
      });

      if (response.ok) {
        router.push('/stocker?completed=true');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to complete order');
      }
    } catch (error) {
      console.error('Failed to complete order:', error);
      alert('Failed to complete order');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }

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
            <Link
              href="/stocker"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Order Details</h2>
          <p className="text-gray-600 mt-1">Order #{order.id.slice(-8)}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Property Name</label>
                  <p className="text-gray-900">{property?.name || order.propertyName || 'Property Name'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{property?.address || order.propertyAddress || 'Property Address'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Access Instructions</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {property?.accessInstructions || 'Contact host for access details'}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Guest Name</label>
                  <p className="text-gray-900">{order.guestName || order.guestInfo?.name || 'Guest'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Check-in Date</label>
                  <p className="text-gray-900">{order.checkInDate ? new Date(order.checkInDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Number of Guests</label>
                  <p className="text-gray-900">{order.numberOfGuests || 'N/A'}</p>
                </div>
                {order.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Special Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Grocery Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grocery Items</h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} {item.unit}</p>
                      </div>
                      <p className="font-medium text-gray-900">${item.totalPrice?.toFixed(2) || '0.00'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No items listed</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Status & Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'shopping' 
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-green-600">${order.total?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            {order.status === 'shopping' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Photos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload photos of the stocked property to complete the order
                </p>
                
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
                >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Add Photos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />

                {/* Photo Preview */}
                {uploadedPhotos.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <label className="text-sm font-medium text-gray-600">Uploaded Photos ({uploadedPhotos.length})</label>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={photo}
                            alt={`Upload ${index + 1}`}
                            width={120}
                            height={96}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete Order Button */}
                {uploadedPhotos.length > 0 && (
                  <button
                    onClick={completeOrder}
                    disabled={completing}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors"
                  >
                    {completing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Completing...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5 mr-2" />
                        Complete Order
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Delivered Photos */}
            {order.status === 'delivered' && order.stockingPhotos && order.stockingPhotos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Photos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {order.stockingPhotos.map((photo, index) => (
                    <Image
                      key={index}
                      src={photo}
                      alt={`Completion ${index + 1}`}
                      width={120}
                      height={96}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}