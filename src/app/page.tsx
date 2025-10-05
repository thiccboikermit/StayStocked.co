import Link from 'next/link';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import Logo from '../components/Logo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Logo size="lg" className="text-green-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                StayStocked
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-green-700 hover:text-green-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/host/register"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Get Started as Host
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-teal-200/25 rounded-full blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="mb-8">
              <Logo size="xl" className="mx-auto mb-4" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-green-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Your stay, fully stocked.
            </h1>
            <p className="mt-8 text-xl leading-8 text-green-700 max-w-3xl mx-auto">
              Transform your Airbnb hosting experience with seamless grocery stocking. 
              Your guests arrive to fully stocked kitchens, and you focus on what matters most.
            </p>
            <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
              <Link
                href="/host/register"
                className="group relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-4 text-lg font-semibold text-white rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 hover:rotate-1"
              >
                <span className="relative z-10">Get Started as Host</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                href="#how-it-works"
                className="group flex items-center text-lg font-semibold text-green-800 hover:text-green-600 transition-colors duration-200"
              >
                See How It Works 
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-gradient-to-b from-green-50 to-emerald-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2322C55E" fill-opacity="0.1"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="mt-6 text-xl leading-8 text-green-700">
              Three simple steps to transform your hosting experience
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="group text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <h3 className="text-xl font-bold text-green-800 mb-3">Host Adds Property</h3>
                <p className="text-green-700">
                  Register your property, sync your calendar, and set your preferences. 
                  We handle the rest automatically.
                </p>
              </div>
            </div>

            <div className="group text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <div className="mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <h3 className="text-xl font-bold text-green-800 mb-3">Guest Chooses Groceries</h3>
                <p className="text-green-700">
                  Guests plan meals and select groceries through our AI-powered planner 
                  or browse our curated selection.
                </p>
              </div>
            </div>

            <div className="group text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-teal-500 to-green-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:shadow-teal-500/30 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <div className="mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <h3 className="text-xl font-bold text-green-800 mb-3">Stocker Delivers</h3>
                <p className="text-green-700">
                  Our vetted stockers shop and stock the property before check-in, 
                  with photo confirmation for peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why StayStocked */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%2316A34A" fill-opacity="0.05"%3E%3Ccircle cx="20" cy="20" r="20"/%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
              Why StayStocked?
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                <CheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-green-800">Convenience</h3>
              <p className="mt-3 text-green-700 leading-relaxed">
                Automated stocking based on guest preferences and your calendar.
              </p>
            </div>

            <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:-rotate-6 transition-transform duration-300 shadow-lg">
                <CheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-green-800">Trust</h3>
              <p className="mt-3 text-green-700 leading-relaxed">
                Vetted stockers with ratings and photo confirmations for every delivery.
              </p>
            </div>

            <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                <CheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-green-800">Freshness</h3>
              <p className="mt-3 text-green-700 leading-relaxed">
                Fresh groceries delivered within hours of guest check-in.
              </p>
            </div>

            <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center group-hover:-rotate-6 transition-transform duration-300 shadow-lg">
                <CheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-green-800">AI Efficiency</h3>
              <p className="mt-3 text-green-700 leading-relaxed">
                Smart meal planning reduces waste and maximizes guest satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 bg-gradient-to-b from-green-100 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
              Success Stories
            </h2>
          </div>

          <div className="mt-20 max-w-4xl mx-auto">
            <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 border border-green-100">
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-2xl text-green-800 font-medium text-center leading-relaxed">
                "StayStocked has transformed how we manage our family rentals. 
                We've cut grocery waste by 30% and our guest satisfaction scores have never been higher."
              </blockquote>
              <footer className="mt-8 text-center">
                <p className="text-lg font-semibold text-green-700">
                  — Garrett's Family Rentals
                </p>
                <p className="text-sm text-green-600 mt-1">Managing 12 properties in Colorado</p>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Logo size="lg" className="text-green-300" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                  StayStocked
                </h3>
              </div>
              <p className="text-green-100 text-lg leading-relaxed max-w-md">
                Revolutionizing the Airbnb hosting experience with seamless grocery stocking services.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-300 mb-6">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-green-200 hover:text-white transition-colors duration-200">About</Link></li>
                <li><Link href="/contact" className="text-green-200 hover:text-white transition-colors duration-200">Contact</Link></li>
                <li><Link href="/privacy" className="text-green-200 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-300 mb-6">Access</h4>
              <ul className="space-y-3">
                <li><Link href="/auth/signin" className="text-green-200 hover:text-white transition-colors duration-200">Host Login</Link></li>
                <li><Link href="/stocker" className="text-green-200 hover:text-white transition-colors duration-200">Stocker Login</Link></li>
                <li><Link href="/host/register" className="text-green-200 hover:text-white transition-colors duration-200">Become a Host</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-green-700/50">
            <p className="text-center text-green-200">
              © 2025 StayStocked. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}