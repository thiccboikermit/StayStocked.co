import Logo from './Logo';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = 'Loading...', size = 'md' }: LoadingProps) {
  const logoSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Logo size={logoSize} className="text-green-600 mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 animate-spin">
            <div className={`border-2 border-green-200 border-t-green-600 rounded-full ${
              size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
            }`}></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display">StayStocked</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Inline loading spinner for components
export function LoadingSpinner({ size = 'sm', className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  const spinnerSize = size === 'md' ? 'w-6 h-6' : 'w-4 h-4';
  
  return (
    <div className={`inline-block animate-spin border-2 border-gray-300 border-t-green-600 rounded-full ${spinnerSize} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}