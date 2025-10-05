interface Props {
  params: {
    propertyId: string;
  };
}

export default function GuestPropertyPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to your StayStocked property!
          </h1>
          <p className="text-xl text-gray-600">
            Property ID: {params.propertyId}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Property Photo</span>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mountain View Cabin</h2>
            <p className="text-gray-600 mb-4">123 Pine Street, Aspen, CO</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Check-in: March 15, 2025</span>
              <span>Check-out: March 18, 2025</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Ready to stock your stay?
          </h3>
          <p className="text-gray-600 mb-8">
            Choose how you'd like to plan your grocery experience
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer">
              <div className="text-4xl mb-4">🛒</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Manual Shopping</h4>
              <p className="text-gray-600 mb-4">
                Browse our curated grocery selection and build your cart manually
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Start Shopping
              </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-transparent hover:border-purple-500 transition-colors cursor-pointer">
              <div className="text-4xl mb-4">🤖</div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">AI Meal Planner</h4>
              <p className="text-gray-600 mb-4">
                Let our AI create a personalized meal plan and shopping list
              </p>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700">
                Plan with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}