'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Logo from '../../../components/Logo';
import { authenticate, setAuthToken, isAdmin } from '../../../lib/auth';

function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await authenticate(formData.email, formData.password);
      
      if (user) {
        // Check if user has admin privileges
        if (!isAdmin(user)) {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }
        
        setAuthToken(user);
        router.push(callbackUrl);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-red-100">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheckIcon className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Administrator Access</h3>
        <p className="text-sm text-gray-600 mt-1">Admin credentials required to proceed</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-900 mb-2">
              Admin Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="appearance-none relative block w-full px-4 py-3 border border-red-200 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all duration-200"
              placeholder="Enter your admin email"
            />
          </div>
          
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-900 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-4 py-3 pr-12 border border-red-200 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all duration-200"
                placeholder="Enter your admin password"
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
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="font-medium text-yellow-700 mb-1">⚠️ Restricted Access</p>
          <p>This page is restricted to authorized administrators only. Unauthorized access attempts may be logged and monitored.</p>
        </div>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-3">
              <Logo size="lg" className="text-red-600" />
              <span className="text-2xl font-bold text-gray-900 font-display">
                StayStocked
              </span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-700">
            Secure access to the administration panel
          </p>
          <div className="mt-4 text-center">
            <Link
              href="/auth/signin"
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              ← Back to regular login
            </Link>
          </div>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}