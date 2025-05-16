import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">
            <Link to="/">Marmato Food</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 bg-white shadow-md mt-2 py-2 px-4 z-50">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/orders"
                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
              <Link
                to="/new-order"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Place Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
