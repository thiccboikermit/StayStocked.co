'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CheckIcon, ClockIcon, ShoppingCartIcon, TruckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Logo from '../../../../components/Logo';
import { getOrderById, getPropertyById } from '../../../../lib/auth';
import type { GroceryOrder } from '../../../../lib/groceries';
import type { Property } from '../../../../lib/auth';

export default function GuestOrderTracking() {
  const params = useParams();
  const [order, setOrder] = useState<GroceryOrder | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    
    // Set up polling to refresh order status every 30 seconds
    const interval = setInterval(fetchOrderDetails, 30000);
    return () => clearInterval(interval);
  }, [params.orderId]);

  const fetchOrderDetails = async () => {
    setRefreshing(true);
    try {
      const orderId = params.orderId as string;
      const orderData = getOrderById(orderId);
      
      if (orderData) {
        setOrder(orderData);
        
        // Get property details
        const propertyData = getPropertyById(orderData.propertyId);
        setProperty(propertyData);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusStep = (status: GroceryOrder['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'shopping': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const formatStatus = (status: GroceryOrder['status']) => {
    switch (status) {
      case 'pending': return 'Order Placed';
      case 'confirmed': return 'Confirmed by Host';
      case 'shopping': return 'Stocker Shopping';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusDescription = (status: GroceryOrder['status']) => {
    switch (status) {
      case 'pending': return 'Your order has been placed and is waiting for host approval.';
      case 'confirmed': return 'Your host has confirmed your order. A stocker will be assigned soon.';
      case 'shopping': return 'A stocker is currently shopping for your groceries.';
      case 'delivered': return 'Your groceries have been delivered to the property!';
      case 'cancelled': return 'This order has been cancelled.';
      default: return 'Order status unknown.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">The order you&rsquo;re looking for doesn&rsquo;t exist or has been removed.</p>
          <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
            Return to StayStocked
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);
  const steps = [
    { name: 'Order Placed', icon: ClockIcon },
    { name: 'Host Confirmed', icon: CheckIcon },
    { name: 'Stocker Shopping', icon: ShoppingCartIcon },
    { name: 'Delivered', icon: TruckIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <Logo size="lg" className="text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 font-display">
                StayStocked
              </h1>
            </Link>
            <div className="ml-auto flex items-center space-x-2">
              {refreshing && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  <span>Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Order Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h2>
          <p className="text-gray-600">Order #{order.id.slice(-8)}</p>
          <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Progress Steps */}
        {order.status !== 'cancelled' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.name} className="flex flex-col items-center flex-1">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 mb-2 ${
                      isCompleted 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : isCurrent 
                        ? 'border-green-600 text-green-600 bg-green-50' 
                        : 'border-gray-300 text-gray-400 bg-gray-50'
                    }`}>
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <span className={`text-sm font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block w-full h-0.5 mt-6 -mr-12 ${
                        index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                      }`} style={{ position: 'absolute', left: '50%', width: 'calc(100% / 3)', zIndex: -1 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  order.status === 'cancelled' 
                    ? 'bg-red-100 text-red-600'
                    : order.status === 'delivered'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {order.status === 'cancelled' ? (
                    <XCircleIcon className="w-6 h-6" />
                  ) : order.status === 'delivered' ? (
                    <TruckIcon className="w-6 h-6" />
                  ) : (
                    <ClockIcon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{formatStatus(order.status)}</h3>
                  <p className="text-gray-600">{getStatusDescription(order.status)}</p>
                </div>
              </div>
              
              {order.completedAt && (
                <p className="text-sm text-gray-500">
                  Completed on {new Date(order.completedAt).toLocaleDateString()} at {new Date(order.completedAt).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Property Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Property</label>
                  <p className="text-gray-900">{property?.name || order.propertyName || 'Property Name'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{property?.address || order.propertyAddress || 'Property Address'}</p>
                </div>
                {order.checkInDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Check-in Date</label>
                    <p className="text-gray-900">{new Date(order.checkInDate).toLocaleDateString()}</p>
                  </div>
                )}
                {order.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Special Instructions</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Photos */}
            {order.status === 'delivered' && order.stockingPhotos && order.stockingPhotos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Photos</h3>
                <p className="text-gray-600 mb-4">Here are photos of your groceries delivered to the property:</p>
                <div className="grid grid-cols-2 gap-4">
                  {order.stockingPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={photo}
                        alt={`Delivery photo ${index + 1}`}
                        width={300}
                        height={192}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:border-green-300 transition-colors cursor-pointer"
                        onClick={() => {
                          // Open photo in new window for full view
                          window.open(photo, '_blank');
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Click any photo to view full size. Photos were uploaded by your stocker as proof of delivery.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-medium">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${order.deliveryFee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                  <span>Total</span>
                  <span className="text-green-600">${order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{order.guestName || order.guestInfo?.name || 'Guest'}</p>
                </div>
                {order.guestInfo?.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{order.guestInfo.email}</p>
                  </div>
                )}
                {order.guestInfo?.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-900">{order.guestInfo.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                If you have any questions about your order, please contact your property host or our support team.
              </p>
              <Link 
                href="/contact" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">{item.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price?.toFixed(2) || '0.00'} per {item.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${item.totalPrice?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}