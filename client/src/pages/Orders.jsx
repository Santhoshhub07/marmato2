import { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderList from '../components/OrderList';

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Orders' },
    { id: 'Vegetarian', label: 'Vegetarian' },
    { id: 'Non-Vegetarian', label: 'Non-Vegetarian' },
    { id: 'Vegan', label: 'Vegan' },
    { id: 'Dessert', label: 'Dessert' },
    { id: 'Beverage', label: 'Beverage' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Your Food Orders
            </h1>
            <p className="text-lg sm:text-xl opacity-90 mb-8">
              View, manage and track all your delicious food orders in one place
            </p>
            <Link
              to="/new-order"
              className="inline-flex items-center bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Place New Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Filter tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === option.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order list with filter */}
        <OrderList categoryFilter={activeFilter === 'all' ? null : activeFilter} />
      </div>
    </div>
  );
}
