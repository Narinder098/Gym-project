import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaDumbbell, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast("User logged out successfully");
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
            <FaDumbbell className="text-blue-500 text-2xl" />
            <span className="text-xl font-bold">Fitness Hub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors duration-300">Home</Link>
            <Link to="/exercises" className="text-gray-700 hover:text-primary transition-colors duration-300">Exercises</Link>
            <Link to="/shop" className="text-gray-700 hover:text-primary transition-colors duration-300">Shop</Link>
            <Link to="/subscription" className="text-gray-700 hover:text-primary transition-colors duration-300">Subscription</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors duration-300">Contact</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - hidden on small screens */}
            <Link to="/cart" className="relative transition-transform duration-300 hover:scale-110 hidden md:inline-block">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Login / Dashboard */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* <button
                  onClick={logout}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  Logout
                </button> */}
                <Link to="/dashboard" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors duration-300">
                  <FaUser />
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Login
              </Link>
            )}

            {/* Hamburger Icon */}
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden focus:outline-none">
              {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-lg bg-gradient-to-br from-white to-gray-100 shadow-lg p-4 animate-fade-in-down">
            <div className="flex flex-col space-y-3 text-center text-gray-700">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Home</Link>
              <Link to="/exercises" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Exercises</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Shop</Link>
              <Link to="/subscription" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Subscription</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary">Contact</Link>
              {/* {user ? (
                <button onClick={handleLogout} className="bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="bg-primary text-white py-2 rounded-md hover:bg-red-600 transition">
                  Login
                </Link>
              )} */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
