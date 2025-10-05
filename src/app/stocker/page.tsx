export default function StockerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">🚚 StayStocked Stocker Portal</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Status: Available</span>
              <button className="text-gray-500 hover:text-gray-700">Sign Out</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Available Orders</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500">In your area</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Active Jobs</h3>
              <p className="text-3xl font-bold text-orange-600">0</p>
              <p className="text-sm text-gray-500">In progress</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">This Week</h3>
              <p className="text-3xl font-bold text-green-600">$0</p>
              <p className="text-sm text-gray-500">Earnings</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Orders</h3>
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <p className="text-gray-500 mb-4">No orders available in your area right now.</p>
                <p className="text-sm text-gray-400">
                  Check back soon or expand your service radius in settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}