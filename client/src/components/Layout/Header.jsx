import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            <Link to="/">Marmato Food</Link>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-gray-900 font-medium">
              Orders
            </Link>
            <Link to="/new-order" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Place Order
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
