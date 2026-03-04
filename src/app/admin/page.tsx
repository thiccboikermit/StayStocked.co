'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import { 
  getAuthToken, 
  removeAuthToken, 
  User, 
  isAdmin,
  getAllOrders,
  getAllProperties,
  getAllUsers,
  getOrderStats,
  getUserStats,
  getPropertyStats,
  updateOrderStatus,
  type Property
} from '../../lib/auth';
import { type GroceryOrder } from '../../lib/groceries';
import { 
  ShoppingCartIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  TruckIcon, 
  XCircleIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  HomeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<GroceryOrder[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<Array<{
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'host' | 'guest' | 'stocker';
  }>>([]);
  const [orderStats, setOrderStats] = useState<{
    total: number;
    pending: number;
    confirmed: number;
    shopping: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    averageOrderValue: number;
  } | null>(null);
  const [userStats, setUserStats] = useState<{
    total: number;
    admins: number;
    hosts: number;
    guests: number;
    stockers: number;
  } | null>(null);
  const [propertyStats, setPropertyStats] = useState<{
    total: number;
    withIcal: number;
    recentlyActive: number;
  } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<GroceryOrder | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const router = useRouter();

  // Load all data
  const loadData = () => {
    const allOrders = getAllOrders();
    const allProperties = getAllProperties();
    const allUsers = getAllUsers();
    const orderStatsData = getOrderStats();
    const userStatsData = getUserStats();
    const propertyStatsData = getPropertyStats();
    
    setOrders(allOrders);
    setProperties(allProperties);
    setUsers(allUsers);
    setOrderStats(orderStatsData);
    setUserStats(userStatsData);
    setPropertyStats(propertyStatsData);
  };

  useEffect(() => {
    const currentUser = getAuthToken();
    if (!currentUser || !isAdmin(currentUser)) {
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }
    setUser(currentUser);
    loadData();
    setLoading(false);
  }, [router]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/');
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: GroceryOrder['status']) => {
    updateOrderStatus(orderId, newStatus, user?.id);
    loadData(); // Refresh data
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-display">Admin Dashboard</h2>
            <p className="text-gray-600 mt-1">Platform overview and management</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
            </button>
            <button
              onClick={loadData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-display">{userStats?.total || 0}</div>
                <div className="text-gray-600 text-sm">Total Users</div>
                {userStats && (
                  <div className="text-xs text-gray-500 mt-1">
                    {userStats.hosts} hosts • {userStats.guests} guests
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <HomeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-display">{propertyStats?.total || 0}</div>
                <div className="text-gray-600 text-sm">Properties</div>
                {propertyStats && (
                  <div className="text-xs text-gray-500 mt-1">
                    {propertyStats.withIcal} with iCal • {propertyStats.recentlyActive} active
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <ShoppingCartIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-display">{orderStats?.total || 0}</div>
                <div className="text-gray-600 text-sm">Total Orders</div>
                {orderStats && (
                  <div className="text-xs text-gray-500 mt-1">
                    {orderStats.pending + orderStats.confirmed + orderStats.shopping} active
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-200 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 font-display">
                  ${orderStats?.totalRevenue ? Math.round(orderStats.totalRevenue).toLocaleString() : 0}
                </div>
                <div className="text-gray-600 text-sm">Total Revenue</div>
                {orderStats && orderStats.averageOrderValue > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Avg: ${orderStats.averageOrderValue.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        {orderStats && orderStats.total > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">Order Status Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{orderStats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{orderStats.confirmed}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingCartIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{orderStats.shopping}</div>
                <div className="text-sm text-gray-600">Shopping</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TruckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{orderStats.delivered}</div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{orderStats.cancelled}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 font-display">Recent Orders</h3>
              <div className="flex items-center space-x-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">{orders.length} total</span>
              </div>
            </div>
            <div className="p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No orders yet.</p>
                  <p className="text-gray-500 text-sm mt-1">Orders will appear as guests place them.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {orders.slice(0, 10).map((order) => {
                    const property = properties.find(p => p.id === order.propertyId);
                    const orderDate = new Date(order.createdAt);
                    
                    return (
                      <div key={order.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                           onClick={() => setSelectedOrder(order)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                <ShoppingCartIcon className="w-3 h-3 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{order.guestInfo.name}</div>
                                <div className="text-xs text-gray-600">{property?.name || 'Unknown Property'}</div>
                              </div>
                            </div>
                            <div className="ml-9 flex items-center space-x-4 text-xs text-gray-600">
                              <span>${order.total.toFixed(2)}</span>
                              <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                              <span>{orderDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                            {getOrderStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {orders.length > 10 && (
                    <div className="text-center pt-3">
                      <p className="text-sm text-gray-500">
                        Showing latest 10 orders. Total: {orders.length}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Properties Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 font-display">Properties</h3>
              <div className="flex items-center space-x-2">
                <HomeIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">{properties.length} total</span>
              </div>
            </div>
            <div className="p-6">
              {properties.length === 0 ? (
                <div className="text-center py-8">
                  <HomeIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No properties added yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {properties.slice(0, 10).map((property) => {
                    const hostUser = users.find(u => u.id === property.hostId);
                    const propertyOrders = orders.filter(o => o.propertyId === property.id);
                    
                    return (
                      <div key={property.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                <HomeIcon className="w-3 h-3 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{property.name}</div>
                                <div className="text-xs text-gray-600">{hostUser?.name || 'Unknown Host'}</div>
                              </div>
                            </div>
                            <div className="ml-9 flex items-center space-x-4 text-xs text-gray-600">
                              <span>{property.maxGuests} guests max</span>
                              <span>{propertyOrders.length} orders</span>
                              {property.iCalUrl && <span className="text-green-600">iCal synced</span>}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(property.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {properties.length > 10 && (
                    <div className="text-center pt-3">
                      <p className="text-sm text-gray-500">
                        Showing latest 10 properties. Total: {properties.length}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Users Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 font-display">Users</h3>
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-600 font-medium">{users.length} total</span>
              </div>
            </div>
            <div className="p-6">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No users registered yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {users.slice(0, 10).map((user) => {
                    const userOrders = orders.filter(o => o.guestId === user.id).length;
                    const userProperties = properties.filter(p => p.hostId === user.id).length;
                    
                    return (
                      <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                user.role === 'admin' ? 'bg-red-100' :
                                user.role === 'host' ? 'bg-green-100' :
                                user.role === 'guest' ? 'bg-blue-100' :
                                'bg-gray-100'
                              }`}>
                                <UserGroupIcon className={`w-3 h-3 ${
                                  user.role === 'admin' ? 'text-red-600' :
                                  user.role === 'host' ? 'text-green-600' :
                                  user.role === 'guest' ? 'text-blue-600' :
                                  'text-gray-600'
                                }`} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                                <div className="text-xs text-gray-600">{user.email}</div>
                              </div>
                            </div>
                            <div className="ml-9 flex items-center space-x-4 text-xs text-gray-600">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                user.role === 'host' ? 'bg-green-100 text-green-700' :
                                user.role === 'guest' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {user.role}
                              </span>
                              {user.role === 'host' && userProperties > 0 && (
                                <span>{userProperties} properties</span>
                              )}
                              {user.role === 'guest' && userOrders > 0 && (
                                <span>{userOrders} orders</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {users.length > 10 && (
                    <div className="text-center pt-3">
                      <p className="text-sm text-gray-500">
                        Showing latest 10 users. Total: {users.length}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
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
                    onClick={() => setSelectedOrder(null)}
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
                    <p className="text-sm text-gray-600">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

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

                {/* Action Buttons */}
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    {selectedOrder.status === 'pending' && (
                      <button
                        onClick={() => {
                          handleOrderStatusUpdate(selectedOrder.id, 'confirmed');
                          setSelectedOrder(null);
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
      </div>
    </div>
  );
}
