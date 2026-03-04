'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '../../../components/Logo';

interface Props {
  params: Promise<{
    propertyId: string;
  }>;
}

export default function GuestPropertyPage({ params }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processParams = async () => {
      const { propertyId } = await params;
      
      // Get URL parameters
      const stay = searchParams.get('stay');
      const booking = searchParams.get('booking');
      const property = searchParams.get('property');
      
      // If we have booking parameters, redirect to guest registration first
      if (stay && booking && property) {
        const registerUrl = `/shop/${propertyId}/register?stay=${stay}&booking=${booking}&property=${property}`;
        router.replace(registerUrl);
        return;
      }
      
      // For regular property links, redirect to standard registration
      router.replace(`/shop/${propertyId}/register`);
    };
    
    processParams();
  }, [params, searchParams, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Logo size="lg" className="text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">StayStocked</h1>
        <p className="text-gray-600">Redirecting to your shopping experience...</p>
      </div>
    </div>
  );
}
