import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FaUsers, FaDumbbell, FaBox, FaCrown, FaShoppingBag, FaChartLine, FaTachometerAlt } from 'react-icons/fa';
import AdminNavbar from '../components/AdminNavbar';
import UsersManagement from '../components/admin/UsersManagement';
import ExercisesManagement from '../components/admin/ExercisesManagement';
import ProductsManagement from '../components/admin/ProductsManagement';
import SubscriptionsManagement from '../components/admin/SubscriptionsManagement';
import OrdersManagement from '../components/admin/OrdersManagement';
import AdminOverview from '../components/admin/AdminOverview';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab === 'overview' ? '' : tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            <button
              onClick={() => handleTabChange('overview')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FaTachometerAlt />
              <span>Overview</span>
            </button>
            <button
              onClick={() => handleTabChange('users')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'users' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FaUsers />
              <span>Users</span>
            </button>
            <button
              onClick={() => handleTabChange('exercises')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'exercises' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FaDumbbell />
              <span>Exercises</span>
            </button>
            <button
              onClick={() => handleTabChange('products')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FaBox />
              <span>Products</span>
            </button>
            <button
              onClick={() => handleTabChange('subscriptions')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'subscriptions' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FaCrown />
              <span>Subscriptions</span>
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FaShoppingBag />
              <span>Orders</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/exercises" element={<ExercisesManagement />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/subscriptions" element={<SubscriptionsManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;