'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Logo from '../../../../components/Logo';
import { registerUser, setAuthToken } from '../../../../lib/auth';

export default function GuestRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<{ id: string; name: string; shoppingLink: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  
  // Get booking parameters if they exist
  const bookingParams = {
    stay: searchParams.get('stay'),
    booking: searchParams.get('booking'),
    property: searchParams.get('property')
  };

  useEffect(() => {
    // Find property by shopping link slug
    // This is a simplified lookup - in production you'd have a proper API
    const findPropertyBySlug = () => {
      // Extract property ID from slug (format: property-name-{id})
      const parts = slug.split('-');
      const propertyId = parts[parts.length - 1];
      
      // Mock property lookup - in production this would be an API call
      // For now, we'll just set a placeholder
      setProperty({
        id: propertyId,
        name: slug.replace(/-\d+$/, '').replace(/-/g, ' '),
        shoppingLink: `/shop/${slug}`
      });
    };

    findPropertyBySlug();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const user = await registerUser(formData.email, formData.password, formData.name, 'guest');
      
      if (user) {
        setAuthToken(user);
        // Build redirect URL with booking parameters if they exist
        let redirectUrl = `/shop/${slug}`;
        if (bookingParams.stay && bookingParams.booking && bookingParams.property) {
          redirectUrl += `?stay=${bookingParams.stay}&booking=${bookingParams.booking}&property=${bookingParams.property}`;
        }
        router.push(redirectUrl);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Logo size="lg" className="text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-3">
            <Logo size="lg" className="text-green-600" />
            <span className="text-2xl font-bold text-gray-900 font-display">
              StayStocked
            </span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Your Guest Account
        </h2>
        <div className="mt-4 text-center">
          <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">
              Shopping for: {property.name}
            </h3>
            <p className="text-sm text-gray-600">
              Create an account to access the shopping page and pre-stock your upcoming stay.
            </p>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link
            href={`/shop/${slug}/signin${bookingParams.stay && bookingParams.booking && bookingParams.property ? `?stay=${bookingParams.stay}&booking=${bookingParams.booking}&property=${bookingParams.property}` : ''}`}
            className="font-medium text-green-700 hover:text-green-800 underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-2xl rounded-2xl border border-green-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-green-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-green-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-green-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 border border-green-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Creating Account...' : 'Create Account & Continue Shopping'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}