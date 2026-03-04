'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Logo from '../../components/Logo';
import { getAuthToken, getStockerStats } from '../../lib/auth';
import type { GroceryOrder } from '../../lib/groceries';

export default function StockerDashboard() {
  const [availableOrders, setAvailableOrders] = useState<GroceryOrder[]>([]);
  const [myOrders, setMyOrders] = useState<GroceryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [stats, setStats] = useState<{
    completedOrders: number;
    totalRevenue: number;
    averageRating: number | null;
    activeOrders: number;
  }>({ completedOrders: 0, totalRevenue: 0, averageRating: null, activeOrders: 0 });

  useEffect(() => {
    const currentUser = getAuthToken();
    if (currentUser?.role !== 'stocker') {
      window.location.href = '/auth/signin';
      return;
    }
    setUser(currentUser);
    fetchOrders(currentUser.id);
  }, []);

  const fetchOrders = async (stockerId: string) => {
    try {
      // Fetch available orders
      const availableResponse = await fetch('/api/orders/available');
      if (availableResponse.ok) {
        const availableData = await availableResponse.json();
        setAvailableOrders(availableData.orders || []);
      }

      // Fetch my orders
      const myResponse = await fetch(`/api/orders/stocker/${stockerId}`);
      if (myResponse.ok) {
        const myData = await myResponse.json();
        setMyOrders(myData.orders || []);
      }
      
      // Get stocker stats
      const stockerStats = getStockerStats(stockerId);
      setStats(stockerStats);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimOrder = async (orderId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/orders/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, stockerId: user.id }),
      });

      if (response.ok) {
        // Refresh orders
        fetchOrders(user.id);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to claim order');
      }
    } catch (error) {
      console.error('Failed to claim order:', error);
      alert('Failed to claim order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <div className="flex items-center space-x-6">
              <Link href="/host" className="text-gray-600 hover:text-gray-900 font-medium">
                For Hosts
              </Link>
              <Link href="/stocker" className="text-gray-600 hover:text-gray-900 font-medium">
                Become a Stocker
              </Link>
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/host/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Stocker Dashboard</h2>
          <p className="text-gray-600 mt-1">Browse and accept grocery stocking jobs near you</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-display">{stats.completedOrders}</div>
                <div className="text-gray-600 text-sm">Completed Jobs</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.activeOrders}</div>
                <div className="text-gray-600 text-sm">Active Jobs</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue.toFixed(0)}
                </div>
                <div className="text-gray-600 text-sm">Total Earnings</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
                </div>
                <div className="text-gray-600 text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Available Jobs Near You</h3>
            </div>
            <div className="p-6 space-y-6">
              {availableOrders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-600">No orders available right now</p>
                  <p className="text-sm text-gray-500 mt-1">Check back later for new stocking opportunities</p>
                </div>
              ) : (
                availableOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {order.propertyName || 'Property'}
                        </h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {order.propertyAddress || 'Property Address'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {order.guestName || 'Guest'}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{order.items?.length || 0} items</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${order.total?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => claimOrder(order.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Accept Job
                      </button>
                      <Link 
                        href={`/stocker/orders/${order.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
            </div>
            <div className="p-6 space-y-4">
              {myOrders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-600">No orders assigned</p>
                </div>
              ) : (
                myOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{order.propertyName || 'Property'}</h4>
                        <p className="text-sm text-gray-600">
                          {order.items?.length || 0} items - ${order.total?.toFixed(2) || '0.00'}
                        </p>
                      </div>
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
                    <div className="flex space-x-2">
                      <Link 
                        href={`/stocker/orders/${order.id}`}
                        className="flex-1 text-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}