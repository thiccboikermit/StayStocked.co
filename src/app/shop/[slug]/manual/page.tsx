'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  PlusIcon, 
  MinusIcon,
  XMarkIcon,
  FunnelIcon,
  HomeIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import Logo from '../../../../components/Logo';
import { getAuthToken, isGuest } from '../../../../lib/auth';
import { storage, StorageKeys } from '../../../../lib/storage';
import { 
  DEMO_GROCERY_ITEMS, 
  GROCERY_CATEGORIES, 
  type GroceryItem, 
  type CartItem,
  getItemsByCategory,
  searchItems,
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

export default function ManualShoppingPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [shoppingSession, setShoppingSession] = useState<ShoppingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and display items
  const filteredItems = useMemo(() => {
    let items: GroceryItem[] = [];

    if (searchQuery.trim()) {
      items = searchItems(searchQuery.trim());
    } else if (selectedCategory === 'all') {
      items = DEMO_GROCERY_ITEMS;
    } else {
      items = getItemsByCategory(selectedCategory);
    }

    return items.filter(item => item.inStock);
  }, [selectedCategory, searchQuery]);

  // Calculate cart totals
  const cartTotals = useMemo(() => {
    return calculateCartTotal(cartItems);
  }, [cartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

    // Load existing cart if any
    const existingCart = storage.get<CartItem[]>(StorageKeys.CART) || [];
    setCartItems(existingCart);

    setLoading(false);
  }, [router, slug]);

  const addToCart = (item: GroceryItem, quantity: number = 1) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    let updatedCart: CartItem[];
    if (existingItem) {
      updatedCart = cartItems.map(cartItem =>
        cartItem.id === item.id
          ? {
              ...cartItem,
              quantity: cartItem.quantity + quantity,
              totalPrice: (cartItem.quantity + quantity) * cartItem.price
            }
          : cartItem
      );
    } else {
      const cartItem: CartItem = {
        ...item,
        quantity,
        totalPrice: item.price * quantity
      };
      updatedCart = [...cartItems, cartItem];
    }
    
    setCartItems(updatedCart);
    storage.set(StorageKeys.CART, updatedCart, { ttl: 24 * 60 * 60 * 1000 }); // 24 hours
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map(cartItem =>
      cartItem.id === itemId
        ? {
            ...cartItem,
            quantity: newQuantity,
            totalPrice: newQuantity * cartItem.price
          }
        : cartItem
    );
    
    setCartItems(updatedCart);
    storage.set(StorageKeys.CART, updatedCart, { ttl: 24 * 60 * 60 * 1000 });
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(cartItem => cartItem.id !== itemId);
    setCartItems(updatedCart);
    storage.set(StorageKeys.CART, updatedCart, { ttl: 24 * 60 * 60 * 1000 });
  };

  const getItemQuantityInCart = (itemId: string): number => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push(`/shop/${slug}/checkout`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading grocery store...</p>
        </div>
      </div>
    );
  }

  if (!user || !shoppingSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Logo size="md" className="text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Grocery Shopping</h1>
                <div className="flex items-center text-sm text-gray-600">
                  <HomeIcon className="w-4 h-4 mr-1" />
                  {shoppingSession.propertyName}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-gray-700">
                {user.name}
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </button>
                
                {/* Cart Dropdown */}
                {isCartOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Cart Header */}
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900">
                        Your Cart ({totalItems} items)
                      </h3>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="max-h-80 overflow-y-auto">
                      {cartItems.length === 0 ? (
                        <div className="p-6 text-center">
                          <ShoppingCartIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                          <p className="text-gray-600">Your cart is empty</p>
                          <p className="text-gray-500 text-sm mt-1">Add some groceries to get started!</p>
                        </div>
                      ) : (
                        <div className="p-4 space-y-4">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
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
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                                <p className="text-gray-600 text-xs">${item.price.toFixed(2)}/{item.unit}</p>
                                <p className="font-medium text-green-600 text-sm">${item.totalPrice.toFixed(2)}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                  <MinusIcon className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                  <PlusIcon className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors ml-2"
                                >
                                  <XMarkIcon className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Cart Footer */}
                    {cartItems.length > 0 && (
                      <div className="border-t p-4 space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${cartTotals.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">${cartTotals.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-medium">${cartTotals.deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2 text-lg font-bold">
                            <span>Total</span>
                            <span className="text-green-600">${cartTotals.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors sm:hidden"
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Categories
            </button>
          </div>

          {/* Category Filters - Desktop */}
          <div className="hidden sm:flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            {GROCERY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Category Filters - Mobile */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-4 sm:hidden">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setShowFilters(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items
              </button>
              {GROCERY_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-1 ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 
             selectedCategory === 'all' ? 'All Groceries' : 
             GROCERY_CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </h2>
          <p className="text-gray-600">{filteredItems.length} items</p>
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No items found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => {
              const quantityInCart = getItemQuantityInCart(item.id);
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.imageUrl || `data:image/svg+xml;base64,${btoa(`
                        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="200" fill="#f3f4f6"/>
                          <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#6b7280" font-size="14">${item.name}</text>
                        </svg>
                      `)}`}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-600 ml-1">
                          /{item.unit}
                        </span>
                      </div>
                      
                      {item.tags.length > 0 && (
                        <div className="flex items-center">
                          {item.tags.includes('organic') && (
                            <TagIcon className="w-3 h-3 text-green-600" title="Organic" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {quantityInCart === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, quantityInCart - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        <span className="font-medium text-green-700 mx-2">
                          {quantityInCart}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, quantityInCart + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Cart ({totalItems} items)
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                  <p className="text-gray-500 text-sm">Add some groceries to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        <Image
                          src={item.imageUrl || `data:image/svg+xml;base64,${btoa(`
                            <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                              <rect width="48" height="48" fill="#e5e7eb"/>
                              <text x="24" y="24" text-anchor="middle" dy=".3em" fill="#6b7280" font-size="10">${item.name.charAt(0)}</text>
                            </svg>
                          `)}`}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-gray-600 text-xs">
                          ${item.price.toFixed(2)}/{item.unit}
                        </p>
                        <p className="font-medium text-green-600 text-sm">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <MinusIcon className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 ml-2"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${cartTotals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${cartTotals.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-green-600">${cartTotals.total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}