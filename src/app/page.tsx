import Link from 'next/link';
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🏠 StayStocked</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/host/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started as Host
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your stay, fully stocked.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Transform your Airbnb hosting experience with seamless grocery stocking. 
              Your guests arrive to fully stocked kitchens, and you focus on what matters most.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/host/register"
                className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get Started as Host
              </Link>
              <Link
                href="#how-it-works"
                className="text-lg font-semibold leading-6 text-gray-900 flex items-center"
              >
                See How It Works <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Three simple steps to transform your hosting experience
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Host Adds Property</h3>
              <p className="mt-4 text-gray-600">
                Register your property, sync your calendar, and set your preferences. 
                We handle the rest automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Guest Chooses Groceries</h3>
              <p className="mt-4 text-gray-600">
                Guests plan meals and select groceries through our AI-powered planner 
                or browse our curated selection.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">Stocker Delivers</h3>
              <p className="mt-4 text-gray-600">
                Our vetted stockers shop and stock the property before check-in, 
                with photo confirmation for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why StayStocked */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why StayStocked?
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <CheckIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Convenience</h3>
              <p className="mt-2 text-gray-600">
                Automated stocking based on guest preferences and your calendar.
              </p>
            </div>

            <div className="text-center">
              <CheckIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Trust</h3>
              <p className="mt-2 text-gray-600">
                Vetted stockers with ratings and photo confirmations for every delivery.
              </p>
            </div>

            <div className="text-center">
              <CheckIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Freshness</h3>
              <p className="mt-2 text-gray-600">
                Fresh groceries delivered within hours of guest check-in.
              </p>
            </div>

            <div className="text-center">
              <CheckIcon className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">AI Efficiency</h3>
              <p className="mt-2 text-gray-600">
                Smart meal planning reduces waste and maximizes guest satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Success Stories
            </h2>
          </div>

          <div className="mt-20 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <blockquote className="text-xl text-gray-900 font-medium">
                "StayStocked has transformed how we manage our family rentals. 
                We've cut grocery waste by 30% and our guest satisfaction scores have never been higher."
              </blockquote>
              <footer className="mt-6">
                <p className="text-base text-gray-600">
                  — Garrett's Family Rentals
                </p>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏠 StayStocked</h3>
              <p className="text-gray-600">
                Revolutionizing the Airbnb hosting experience with seamless grocery stocking services.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Access</h4>
              <ul className="space-y-2">
                <li><Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">Host Login</Link></li>
                <li><Link href="/stocker" className="text-gray-600 hover:text-gray-900">Stocker Login</Link></li>
                <li><Link href="/host/register" className="text-gray-600 hover:text-gray-900">Become a Host</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              © 2025 StayStocked. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}