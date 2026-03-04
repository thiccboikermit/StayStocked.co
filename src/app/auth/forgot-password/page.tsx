'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import Logo from '../../../components/Logo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement password reset email sending
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-green-100">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-green-800">
                Check your email
              </h2>
              <p className="mt-2 text-center text-sm text-green-600">
                We&apos;ve sent password reset instructions to{' '}
                <span className="font-medium text-green-800">{email}</span>
              </p>
            </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="font-medium underline hover:text-green-600"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/auth/signin"
              className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-600 transition-colors"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-3">
              <Logo size="lg" className="text-green-600" />
              <span className="text-2xl font-bold text-gray-900 font-display">
                StayStocked
              </span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-800">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-green-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-green-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-green-800 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-green-200 placeholder-gray-400 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send reset link'
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-600 transition-colors"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}