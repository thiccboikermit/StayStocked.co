'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Logo from '../../../../components/Logo';
import { authenticate, setAuthToken } from '../../../../lib/auth';

export default function GuestSigninPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<{ id: string; name: string } | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    // Extract property info from slug
    const parts = slug.split('-');
    const propertyId = parts[parts.length - 1];
    setProperty({
      id: propertyId,
      name: slug.replace(/-\d+$/, '').replace(/-/g, ' ')
    });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await authenticate(formData.email, formData.password);
      
      if (user) {
        if (user.role !== 'guest') {
          setError('Please use the guest account associated with this property');
          return;
        }
        
        setAuthToken(user);
        // Build redirect URL with booking parameters if they exist
        let redirectUrl = `/shop/${slug}`;
        if (bookingParams.stay && bookingParams.booking && bookingParams.property) {
          redirectUrl += `?stay=${bookingParams.stay}&booking=${bookingParams.booking}&property=${bookingParams.property}`;
        }
        router.push(redirectUrl);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

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
          Sign In to Your Guest Account
        </h2>
        {property && (
          <div className="mt-4 text-center">
            <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Shopping for: {property.name}
              </h3>
            </div>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-gray-700">
          Don&apos;t have an account?{' '}
          <Link
            href={`/shop/${slug}/register${bookingParams.stay && bookingParams.booking && bookingParams.property ? `?stay=${bookingParams.stay}&booking=${bookingParams.booking}&property=${bookingParams.property}` : ''}`}
            className="font-medium text-green-700 hover:text-green-800 underline"
          >
            Create one here
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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full px-4 py-3 pr-12 border border-green-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                  placeholder="Enter your password"
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
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Signing in...' : 'Sign In & Continue Shopping'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}