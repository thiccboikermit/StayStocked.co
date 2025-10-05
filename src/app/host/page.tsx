import Link from 'next/link';

export default function HostDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">🏠 StayStocked Host Dashboard</h1>
            <Link
              href="/auth/signin"
              className="text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back!</h2>
            <p className="text-gray-600 mb-8">Manage your properties and orders from your dashboard.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Properties</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-500">Active listings</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-500">Pending approval</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">This Month</h3>
                <p className="text-3xl font-bold text-purple-600">$0</p>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">You haven't added any properties yet.</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                Add Your First Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}