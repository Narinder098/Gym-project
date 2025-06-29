import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaDumbbell, FaCalendar, FaChartLine, FaShoppingBag, FaCrown, FaCreditCard, FaBell, FaMapMarkerAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorkoutPlanner from './WorkoutPlanner';
import Progress from './Progress';
import toast from 'react-hot-toast';
import DashboardSkeleton from '../components/DashboardSkeleton';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const FALLBACK_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMAGE;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.error('Please log in to access the dashboard');
    } else {
      const storedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
      setCompletedWorkouts(storedWorkouts);
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in localStorage');
        }
        const response = await axios.get('https://gym-project-server.onrender.com/orders/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const uniqueOrders = Array.from(
            new Map(response.data.orders.map(order => [order._id, order])).values()
          );
          setOrders(uniqueOrders);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          token: localStorage.getItem('token'),
        });
        if (err.response?.status === 401 || err.message === 'No token found in localStorage') {
          setError('Unauthorized: Please log in again');
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Error fetching orders');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, logout, navigate]);

  const handleDelete = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to delete account');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <DashboardSkeleton />
      </div>
    );
  }

  const formatShippingAddress = (address) => {
    if (!address || typeof address !== 'object') return 'Not Provided';
    const { street, city, state, postalCode, country } = address;
    return [street, city, state, postalCode, country].filter(Boolean).join(', ') || 'Not Provided';
  };

  const formatWorkoutDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaShoppingBag className="text-blue-600 mr-2" />
          Recent Orders
        </h3>
        <div className="space-y-4">
          {error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : Array.isArray(orders) && orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <div
                key={order._id}
                className="border-b border-gray-200 py-4 last:border-b-0"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 text-base">Order #{order._id.slice(-6)}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {order.status || 'Pending'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {order.createdAt ? formatWorkoutDate(order.createdAt) : 'Date not available'}
                </p>
                <p className="text-blue-600 font-semibold text-base mt-1">
                  ${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No orders available</p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaDumbbell className="text-blue-600 mr-2" />
          Recent Workouts
        </h3>
        <div className="space-y-4">
          {completedWorkouts.length > 0 ? (
            completedWorkouts.slice(0, 3).map((workout) => (
              <div
                key={workout.id}
                className="flex justify-between items-center border-b border-gray-200 py-4 last:border-b-0"
              >
                <div>
                  <h4 className="font-medium text-gray-900 text-base">{workout.name}</h4>
                  <p className="text-gray-500 text-sm">{formatWorkoutDate(workout.completedAt)}</p>
                </div>
                <span className="text-blue-600 text-base">{formatTimer(workout.timerSeconds)}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No workouts completed yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderOrders = () => {
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center text-gray-600 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
        <p>No orders available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow p-6 border border-gray-200"
        >
          {/* Header */}
          <div className="flex justify-between flex-wrap sm:flex-nowrap items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order._id.slice(-6)}
              </h3>
              <p className="text-sm text-gray-500">
                {order.createdAt ? formatWorkoutDate(order.createdAt) : 'Date not available'}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 sm:mt-0 ${
                order.status === 'Delivered'
                  ? 'bg-green-100 text-green-700'
                  : order.status === 'Shipped'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {order.status || 'Pending'}
            </span>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-200">
            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-4">
                  <div>
                    <p className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    ${item.product?.price?.toFixed(2) || '0.00'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 py-4">No items in this order</p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-base font-semibold text-gray-900">
                ${order.totalPrice?.toFixed(2) || '0.00'}
              </span>
            </div>
            {order.shippingAddress && (
              <div className="mt-2 text-sm text-gray-600 flex items-center">
                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                <span>{formatShippingAddress(order.shippingAddress)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

  const renderProfile = () => (
    <div className="px-4 py-8">
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl max-w-3xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center p-8 bg-blue-100 border-b border-blue-200">
          <img
            src={user.avatar || 'https://picsum.photos/100'}
            alt={user.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            onError={handleImageError}
          />
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">Member since {user.memberSince || 'Unknown'}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          {/* Membership Status */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <FaCrown className="text-yellow-500 text-xl" />
              <div>
                <p className="font-semibold text-gray-700">Membership Status</p>
                <p className="text-sm text-gray-500">Premium Member</p>
              </div>
            </div>
            <span className="text-green-600 font-medium">Active</span>
          </div>

          {/* Workout Streak */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-indigo-600 text-xl" />
              <div>
                <p className="font-semibold text-gray-700">Workout Streak</p>
                <p className="text-sm text-gray-500">Last 7 days active</p>
              </div>
            </div>
            <span className="text-blue-700 font-medium">7 Days</span>
          </div>

          {/* Preferred Time */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <FaCalendar className="text-pink-500 text-xl" />
              <div>
                <p className="font-semibold text-gray-700">Preferred Workout Time</p>
                <p className="text-sm text-gray-500">Set by user in preferences</p>
              </div>
            </div>
            <span className="text-gray-600">6AM – 8AM</span>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBell className="text-blue-500 text-xl" />
              <div>
                <p className="font-semibold text-gray-700">Email Notifications</p>
                <p className="text-sm text-gray-500">Workout tips, offers, reminders</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-blue-50 p-6 border-t border-blue-100 text-center">
          <button
            onClick={handleDelete}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Mobile Header with Toggle */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <button onClick={toggleSidebar} className="text-gray-600">
          {isSidebarOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} md:block md:w-64 md:sticky md:top-6`}>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user.avatar || 'https://picsum.photos/80'}
                alt={user.name}
                className="w-12 h-12 rounded-lg border-2 border-blue-100"
                onError={handleImageError}
              />
              <div>
                <h3 className="font-semibold text-gray-900 text-base">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-2">
              {[
                { name: FaChartLine, value: 'overview', icon: 'Overview' },
                { name: FaCalendar, value: 'planner', icon: 'Workout Planner' },
                { name: FaChartLine, value: 'progress', icon: 'Progress' },
                { name: FaShoppingBag, value: 'orders', icon: 'Orders' },
                { name: FaUser, value: 'profile', icon: 'Profile' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setActiveTab(item.value);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-x-2 px-4 py-3 rounded-lg text-base transition-colors duration-200 ${activeTab === item.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <item.name className="text-lg" />
                  <span>{item.icon}</span>
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-x-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 text-base"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'planner' && <WorkoutPlanner />}
          {activeTab === 'progress' && <Progress />}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;