'use client';

import Link from 'next/link';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from '../components/Logo';

export default function HomePage() {
  const router = useRouter();
  const [orderLookup, setOrderLookup] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleOrderSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderLookup.trim()) return;
    
    setIsSearching(true);
    // Simple order lookup - in a real app this would validate against a database
    const trimmedOrderId = orderLookup.trim();
    
    // Simulate a brief search delay
    setTimeout(() => {
      setIsSearching(false);
      // Navigate to the order tracking page
      router.push(`/guest/order/${trimmedOrderId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 hover:opacity-80 transition-opacity flex-shrink-0">
              <Logo size="lg" className="text-green-600 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 font-display">
                StayStocked
              </h1>
            </Link>
            <div className="hidden lg:flex items-center space-x-8">
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
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
            {/* Tablet and Mobile menu */}
            <div className="lg:hidden flex items-center space-x-1 sm:space-x-2">
              <Link
                href="/auth/signin"
                className="hidden sm:block text-gray-600 hover:text-gray-900 font-medium text-xs sm:text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/host/register"
                className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm"
              >
                Start
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-display">
                <span className="block">Arrive. Relax.</span>
                <span className="text-green-600">StayStocked.</span>
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                <span className="text-green-600 font-semibold">Connect your rental</span>, let guests order what they need, and StayStocked ensures every stay starts ready to enjoy.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/host/register"
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Register as Host
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center border border-gray-300 hover:border-green-500 text-gray-700 hover:text-green-600 px-6 py-3 rounded-lg font-semibold transition-colors bg-white"
                >
                  Explore Demo
                </Link>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto max-w-sm lg:max-w-none">
                {/* Kitchen Image */}
                <div className="h-64 lg:h-96 relative overflow-hidden">
                  <Image
                    src="/images/kitchen.jpg"
                    alt="Kitchen counter with fresh groceries, vegetables, fruits and cooking ingredients ready for guests"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Order Tracking */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-display mb-3">
              Track Your Order
            </h2>
            <p className="text-gray-600">
              Already placed a grocery order? Enter your order ID to track your delivery status
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <form onSubmit={handleOrderSearch} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={orderLookup}
                  onChange={(e) => setOrderLookup(e.target.value)}
                  placeholder="Enter your order ID (e.g., order-abc123)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !orderLookup.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  'Track Order'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Can&apos;t find your order ID? Check your email confirmation or contact your host.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A seamless three-step process connecting hosts, guests, and local stockers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-green-700 group-hover:scale-110 group-hover:rotate-6">
                <span className="text-2xl font-bold text-white">01</span>
              </div>
              <div className="mt-6 bg-green-50 rounded-xl p-6 transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-lg group-hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110">
                  <Logo size="md" className="text-green-600 transition-colors duration-300 group-hover:text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-green-800">Hosts Register</h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  Add your property, sync your 
                  Airbnb calendar, and generate a 
                  unique guest shopping link.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-700 group-hover:scale-110 group-hover:-rotate-6">
                <span className="text-2xl font-bold text-white">02</span>
              </div>
              <div className="mt-6 bg-green-50 rounded-xl p-6 transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-lg group-hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110">
                  <svg className="w-8 h-8 text-green-600 transition-all duration-300 group-hover:text-emerald-600 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.4a1 1 0 00.9 1.1H19" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-green-800">Guests Shop</h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  Use AI meal planning to create 
                  personalized grocery lists. Order 
                  with one click.
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="mx-auto w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-teal-700 group-hover:scale-110 group-hover:rotate-6">
                <span className="text-2xl font-bold text-white">03</span>
              </div>
              <div className="mt-6 bg-green-50 rounded-xl p-6 transition-all duration-300 group-hover:bg-green-100 group-hover:shadow-lg group-hover:-translate-y-2">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110">
                  <svg className="w-8 h-8 text-green-600 transition-all duration-300 group-hover:text-emerald-600 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-green-800">Stockers Deliver</h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  Local shoppers fulfill orders, 
                  stock the property, and earn 
                  money on flexible schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-4">
              Why Choose StayStocked?
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              We&apos;ve designed every aspect of our platform to make grocery stocking seamless for hosts, convenient for guests, and profitable for stockers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Smart Integration */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Smart Calendar Integration</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically sync with your Airbnb, VRBO, or booking platform. Orders are only placed when guests have confirmed bookings, eliminating waste and ensuring fresh groceries.
              </p>
            </div>

            {/* AI Meal Planning */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">AI-Powered Meal Planning</h3>
              <p className="text-gray-600">
                Guests receive personalized grocery suggestions based on their group size, dietary preferences, and length of stay. Our AI creates smart shopping lists that eliminate guesswork.
              </p>
            </div>

            {/* Local Network */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-200 transition-colors duration-300">
                <svg className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Trusted Local Stockers</h3>
              <p className="text-gray-600">
                Our vetted network of local shoppers knows the best stores, freshest products, and fastest routes. Each stocker is background-checked and rated by the community.
              </p>
            </div>

            {/* Quality Guarantee */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Quality Guarantee</h3>
              <p className="text-gray-600">
                Every order includes photo verification, freshness guarantee, and 24/7 support. If something isn&apos;t perfect, we&apos;ll make it right immediately.
              </p>
            </div>

            {/* Flexible Pricing */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors duration-300">
                <svg className="w-8 h-8 text-teal-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees or surprise charges. Guests pay grocery cost plus a small service fee. Hosts earn commission on each order. Stockers keep 100% of their delivery fee.
              </p>
            </div>

            {/* Real-Time Tracking */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors duration-300">
                <svg className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">Real-Time Updates</h3>
              <p className="text-gray-600">
                Track your order from shopping to delivery. Receive notifications when your stocker starts shopping, when they&apos;re en route, and when groceries are safely stored.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-display mb-4">
              The Complete Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From setup to guest arrival, here&apos;s exactly how StayStocked works to create the perfect stocking experience.
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 - Detailed */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">Host Registration & Setup</h3>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Connect your Airbnb, VRBO, or direct booking calendar in under 2 minutes
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Add property details: address, access instructions, kitchen amenities
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Generate your unique guest shopping link automatically
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Set your preferences: local stores, delivery windows, special instructions
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="bg-white rounded-lg p-4 mb-4 border">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="font-semibold text-gray-900">Calendar Synced</span>
                    </div>
                    <p className="text-sm text-gray-600">Connected to Airbnb • 3 upcoming bookings</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="font-semibold text-gray-900 mb-2">Your Guest Link:</p>
                    <div className="bg-gray-50 rounded p-2 text-sm text-gray-600 font-mono break-all">
                      staystocked.com/shop/lakeside-retreat-abc123
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 - Detailed */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">Guest Experience</h3>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Guests receive your unique link 7-14 days before arrival
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    AI suggests groceries based on group size, dietary needs, and stay duration
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    One-click ordering with transparent pricing and delivery timeline
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Optional: Add special requests or dietary restrictions
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="bg-white rounded-lg p-4 mb-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3">AI Suggestions for Your Stay:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-900">🥛 Organic Milk (1/2 gal)</span>
                        <span className="text-green-600 font-medium">$4.99</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-900">🥖 Fresh Bread</span>
                        <span className="text-green-600 font-medium">$3.49</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-900">🥚 Farm Eggs (Dozen)</span>
                        <span className="text-green-600 font-medium">$5.99</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900">Total + Service Fee:</span>
                        <span className="text-green-600">$18.47</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Detailed */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-full mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">Professional Stocking</h3>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Vetted local stockers receive order notifications instantly
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Professional shopping with photo verification of each item
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Contactless delivery and proper food storage according to your instructions
                  </p>
                  <p className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Real-time updates and completion photos sent to all parties
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-900">Order Accepted</span>
                      </div>
                      <p className="text-sm text-gray-600">Sarah M. is shopping for your order</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                          </svg>
                        </div>
                        <span className="font-semibold text-gray-900">Shopping in Progress</span>
                      </div>
                      <p className="text-sm text-gray-600">ETA: 30 minutes to your property</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6 hover:opacity-80 transition-opacity">
                <Logo size="lg" className="text-green-400 w-12 h-12" />
                <h3 className="text-2xl font-bold text-white font-display">
                  StayStocked
                </h3>
              </Link>
              <p className="text-gray-400 mb-6 leading-relaxed">
                The smart way to pre-stock vacation rentals with groceries and essentials. Seamless for hosts, convenient for guests, profitable for stockers.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* For Hosts */}
            <div>
              <h4 className="font-bold text-white mb-6 font-display">For Hosts</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/host/register" className="text-gray-400 hover:text-green-400 transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/host" className="text-gray-400 hover:text-green-400 transition-colors">
                    Host Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-gray-400 hover:text-green-400 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            {/* For Stockers */}
            <div>
              <h4 className="font-bold text-white mb-6 font-display">For Stockers</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/stocker" className="text-gray-400 hover:text-green-400 transition-colors">
                    Join as Stocker
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Stocker Requirements
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Earnings Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Training Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Stocker Support
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Community Forum
                  </a>
                </li>
              </ul>
            </div>

            {/* Company & Support */}
            <div>
              <h4 className="font-bold text-white mb-6 font-display">Company</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Safety & Trust
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 StayStocked. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Terms
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Cookie Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Accessibility
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}