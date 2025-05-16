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
