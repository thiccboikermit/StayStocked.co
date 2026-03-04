'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckIcon, 
  CreditCardIcon, 
  HomeIcon, 
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  AtSymbolIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Logo from '../../../../components/Logo';
import { getAuthToken, isGuest } from '../../../../lib/auth';
import { storage, StorageKeys } from '../../../../lib/storage';
import { 
  type CartItem,
  type GroceryOrder,
  calculateCartTotal
} from '../../../../lib/groceries';

interface ShoppingSession {
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  method: 'manual' | 'ai';
}

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [user, setUser] = useState<{ id: string; name: string; role: string; email?: string; phone?: string } | null>(null);
  const [shoppingSession, setShoppingSession] = useState<ShoppingSession | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'demo'>('stripe');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Guest information form
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryNotes: ''
  });

  // Calculate totals
  const cartTotals = useMemo(() => {
    return calculateCartTotal(cartItems);
  }, [cartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Create Stripe PaymentIntent
  const createPaymentIntent = useCallback(async (amount: number) => {
    try {
      setStripeLoading(true);
      setPaymentError(null);
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            propertyId: shoppingSession?.propertyId || '',
            guestId: user?.id || '',
            itemCount: totalItems
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setPaymentError('Failed to initialize payment. Please try again.');
    } finally {
      setStripeLoading(false);
    }
  }, [shoppingSession?.propertyId, user?.id, totalItems]);

  useEffect(() => {
    // Check authentication
    const currentUser = getAuthToken();
    if (!currentUser || !isGuest(currentUser)) {
      router.push(`/shop/${slug}/register`);
      return;
    }
    setUser(currentUser);

    // Load shopping session
    const session = storage.get<ShoppingSession>(StorageKeys.SHOPPING_SESSION);
    if (!session) {
      router.push(`/shop/${slug}`);
      return;
    }
    setShoppingSession(session);

    // Load cart items
    const existingCart = storage.get<CartItem[]>(StorageKeys.CART) || [];
    if (existingCart.length === 0) {
      router.push(`/shop/${slug}/manual`);
      return;
    }
    setCartItems(existingCart);

    // Pre-populate guest information
    setGuestInfo(prev => ({
      ...prev,
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      email: currentUser.email || ''
    }));

    setLoading(false);
  }, [router, slug]);

  // Create payment intent when cart totals change
  useEffect(() => {
    if (cartTotals.total > 0 && paymentMethod === 'stripe' && !clientSecret) {
      createPaymentIntent(cartTotals.total);
    }
  }, [cartTotals.total, paymentMethod, clientSecret, createPaymentIntent]);

  // Auto-redirect to order tracking with countdown
  useEffect(() => {
    if (orderCompleted && completedOrderId) {
      const interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            router.push(`/guest/order/${completedOrderId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [orderCompleted, completedOrderId, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shoppingSession || cartItems.length === 0) return;

    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (paymentMethod === 'stripe') {
        // Handle Stripe payment
        if (!clientSecret) {
          throw new Error('Payment not initialized. Please try again.');
        }

        // TODO: Implement Stripe payment confirmation
        // This is where you'll use Stripe Elements to confirm the payment
        // Example:
        // const { error, paymentIntent } = await stripe.confirmPayment({
        //   elements,
        //   confirmParams: {
        //     return_url: `${window.location.origin}/shop/${slug}/success`,
        //   }
        // });
        
        // For now, we'll simulate successful payment
        console.log('Stripe payment would be processed here with clientSecret:', clientSecret);
      }

      // Create order ID
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create order object
      const order: GroceryOrder = {
        id: orderId,
        guestId: user.id,
        propertyId: shoppingSession.propertyId,
        bookingId: 'manual-booking', // For manual orders
        items: cartItems,
        subtotal: cartTotals.subtotal,
        tax: cartTotals.tax,
        deliveryFee: cartTotals.deliveryFee,
        total: cartTotals.total,
        status: paymentMethod === 'stripe' ? 'confirmed' : 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: calculateEstimatedDelivery(),
        notes: guestInfo.deliveryNotes,
        guestInfo: {
          name: guestInfo.name,
          phone: guestInfo.phone,
          email: guestInfo.email
        }
      };

      // Save order to storage
      const existingOrders = storage.get<GroceryOrder[]>(StorageKeys.ORDERS) || [];
      const updatedOrders = [...existingOrders, order];
      storage.set(StorageKeys.ORDERS, updatedOrders);

      // Clear cart
      storage.remove(StorageKeys.CART);

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, paymentMethod === 'stripe' ? 3000 : 2000));

      setCompletedOrderId(orderId);
      setOrderCompleted(true);
    } catch (error) {
      console.error('Failed to place order:', error);
      setPaymentError(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateEstimatedDelivery = (): string => {
    const now = new Date();
    const checkInDate = new Date(shoppingSession?.checkIn || now);
    
    // If check-in is today or tomorrow, deliver within 2-4 hours
    // Otherwise, deliver 1 day before check-in
    const diffHours = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours <= 24) {
      // Same day or next day delivery
      const deliveryTime = new Date(now.getTime() + (3 * 60 * 60 * 1000)); // 3 hours from now
      return deliveryTime.toISOString();
    } else {
      // Deliver day before check-in
      const deliveryTime = new Date(checkInDate.getTime() - (24 * 60 * 60 * 1000));
      deliveryTime.setHours(14, 0, 0, 0); // 2 PM day before
      return deliveryTime.toISOString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!user || !shoppingSession) {
    return null;
  }

  if (orderCompleted && completedOrderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-emerald-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <Logo size="md" className="text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">StayStocked</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Order Confirmation */}
        <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h2>
            
            <p className="text-gray-600 mb-4">
              Your grocery order has been confirmed and is now being prepared for delivery.
            </p>
            
            <p className="text-sm text-blue-600 mb-6">
              Redirecting to order tracking in {redirectCountdown} seconds...
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p className="text-gray-600">Order ID</p>
                  <p className="font-medium text-gray-900">{completedOrderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total</p>
                  <p className="font-medium text-green-600 text-lg">${cartTotals.total.toFixed(2)}</p>
                </div>
                <div className="text-left">
                  <p className="text-gray-600">Items</p>
                  <p className="font-medium text-gray-900">{totalItems} items</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Delivery</p>
                  <p className="font-medium text-gray-900">Before check-in</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">What&apos;s Next?</h3>
                <ul className="text-green-800 text-sm space-y-1">
                      <li>• Your groceries will be delivered before your check-in time</li>
                      <li>• You&apos;ll receive updates via email and SMS</li>
                      <li>• Items will be properly stored and ready when you arrive</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/guest/order/${completedOrderId}`)}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Track Your Order
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
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
            <div className="flex items-center space-x-4">
              <Logo size="md" className="text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <HomeIcon className="w-4 h-4 mr-1" />
                  {shoppingSession.propertyName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${cartTotals.total.toFixed(2)}</p>
              <p className="text-sm text-gray-600">{totalItems} items</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Information</h2>
            
            {/* Stay Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Your Stay</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-700">Check-in</p>
                    <p className="font-medium text-green-900">
                      {new Date(shoppingSession.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-green-600 mr-2" />
                  <div>
                    <p className="text-green-700">Check-out</p>
                    <p className="font-medium text-green-900">
                      {new Date(shoppingSession.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <AtSymbolIcon className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={guestInfo.deliveryNotes}
                  onChange={(e) => setGuestInfo(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                  placeholder="Special instructions, preferred delivery time, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Payment Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  <CreditCardIcon className="w-5 h-5 inline mr-2" />
                  Payment Method
                </h3>
                
                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value as 'stripe' | 'demo');
                          setPaymentError(null);
                          setClientSecret(null);
                        }}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="demo"
                        checked={paymentMethod === 'demo'}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value as 'stripe' | 'demo');
                          setPaymentError(null);
                        }}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-900">Demo Mode</span>
                    </label>
                  </div>
                </div>

                {/* Stripe Payment Form */}
                {paymentMethod === 'stripe' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    {stripeLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
                        <span className="text-gray-600">Initializing secure payment...</span>
                      </div>
                    ) : clientSecret ? (
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-3">Enter your payment details:</p>
                          {/* 
                            TODO: Replace this placeholder with actual Stripe Elements
                            Example:
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                              <CheckoutForm />
                            </Elements>
                          */}
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <CreditCardIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 text-sm">
                              <strong>Stripe Elements will be rendered here</strong>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Replace this with actual Stripe payment form
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          </div>
                          <p className="text-xs text-gray-600">
                            Your payment information is encrypted and secure
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <button
                          type="button"
                          onClick={() => createPaymentIntent(cartTotals.total)}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          Initialize Payment
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Demo Mode Info */}
                {paymentMethod === 'demo' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Demo Mode:</strong> This is a demonstration checkout. No actual payment will be processed.
                    </p>
                  </div>
                )}

                {/* Payment Error */}
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <ExclamationCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-red-800 text-sm font-medium">Payment Error</p>
                        <p className="text-red-700 text-sm mt-1">{paymentError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing || (paymentMethod === 'stripe' && !clientSecret) || stripeLoading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {paymentMethod === 'stripe' ? 'Processing Payment...' : 'Processing Order...'}
                  </>
                ) : stripeLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Initializing Payment...
                  </>
                ) : paymentMethod === 'stripe' && !clientSecret ? (
                  'Initialize Payment First'
                ) : (
                  `${paymentMethod === 'stripe' ? 'Pay' : 'Place Order'} - $${cartTotals.total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.imageUrl || `data:image/svg+xml;base64,${btoa(`
                        <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="48" fill="#f3f4f6"/>
                          <text x="24" y="24" text-anchor="middle" dy=".3em" fill="#6b7280" font-size="10">${item.name.charAt(0)}</text>
                        </svg>
                      `)}`}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)}/{item.unit} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cartTotals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${cartTotals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">${cartTotals.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-green-600">${cartTotals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-green-900 mb-2">Delivery Details</h4>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Delivered before your check-in time</li>
                <li>• Refrigerated items properly stored</li>
                <li>• SMS & email delivery confirmation</li>
                <li>• Contact host for property access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}