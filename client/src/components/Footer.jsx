import { FaDumbbell, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-4">
            <FaDumbbell className="text-blue-500 text-3xl" />
            <span className="text-2xl font-bold text-white">Fitness Hub</span>
          </div>
          <p className="text-sm text-gray-400">
            Your ultimate partner in achieving your fitness goals. Train hard. Live stronger.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-blue-400 transition">About Us</Link></li>
            <li><Link to="/exercises" className="hover:text-blue-400 transition">Exercises</Link></li>
            <li><Link to="/shop" className="hover:text-blue-400 transition">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faq" className="hover:text-blue-400 transition">FAQs</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
            <li><Link to="/login" className="hover:text-blue-400 transition">Login</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4 text-lg">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Fitness Hub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
