import { Link } from 'react-router-dom';
import { FaDumbbell, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/admin" className="flex items-center space-x-2">
            <FaDumbbell className="text-primary text-2xl" />
            <span className="text-xl font-bold">Admin Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaUser className="text-gray-400" />
              <span className="text-gray-300">{user.name}</span>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;