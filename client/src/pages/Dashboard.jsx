import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaDumbbell, FaCalendar, FaChartLine, FaShoppingBag, FaCrown, FaCreditCard, FaBell, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorkoutPlanner from './WorkoutPlanner';
import Progress from './Progress';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
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
      // Load completed workouts from localStorage
      const storedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
      setCompletedWorkouts(storedWorkouts);
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
            const response = await axios.get("https://gym-project-server.onrender.com/orders",  {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

        if (response.data.success) {
          // Deduplicate orders by _id
          const uniqueOrders = Array.from(
            new Map(response.data.orders.map(order => [order._id, order])).values()
          );
          setOrders(uniqueOrders);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
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

  const formatShippingAddress = (address) => {
    if (!address || typeof address !== 'object') return 'Not Provided';
    const { street, city, state, postalCode, country } = address;
    return [street, city, state, postalCode, country].filter(Boolean).join(', ') || 'Not Provided';
  };

  // Format workout date
  const formatWorkoutDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format workout timer
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = []; // Keep empty as in original

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <stat.icon className="text-blue-600 text-3xl" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaShoppingBag className="text-blue-600 mr-2" />
          Recent Orders
        </h3>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-600">Loading orders...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : Array.isArray(orders) && orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <motion.div
                key={order._id}
                className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Order #{order._id.slice(-6)}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    {order.status || 'Pending'}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date not available'}
                </p>
                <p className="text-blue-600 font-semibold mt-1">
                  ${order.totalPrice ? order.totalPrice.toFixed(2) : (Array.isArray(order.items) ? order.items.reduce((acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 1)), 0) : 0).toFixed(2)}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600">No orders available</p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaDumbbell className="text-blue-600 mr-2" />
          Recent Workouts
        </h3>
        <div className="space-y-4">
          {completedWorkouts.length > 0 ? (
            completedWorkouts.slice(0, 3).map((workout, index) => (
              <motion.div
                key={workout.id}
                className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div>
                  <h4 className="font-medium text-gray-900">{workout.name}</h4>
                  <p className="text-gray-500 text-sm">{formatWorkoutDate(workout.completedAt)}</p>
                </div>
                <span className="text-blue-600">{formatTimer(workout.timerSeconds)}</span>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-600">No workouts completed yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderOrders = () => {
    if (loading) {
      return <div className="text-center py-10 text-gray-600">Loading orders...</div>;
    }

    if (error) {
      return (
        <div className="text-center text-red-500 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order History</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (!Array.isArray(orders) || orders.length === 0) {
      return (
        <div className="text-center text-gray-600 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order History</h2>
          <p>No orders available.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order History</h2>
        {orders.map((order, orderIndex) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: orderIndex * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-4 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Order #{order._id.slice(-6)}</h3>
                <p className="text-gray-500 text-sm">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date not available'}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                  }`}
              >
                {order.status || 'Pending'}
              </span>
            </div>

            <div className="space-y-4">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    key={item._id || item.product?._id || `${order._id}-${index}`}
                    className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</p>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity || 1}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${(item.product?.price ? item.product.price.toFixed(2) : '0.00')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No items in this order.</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-semibold text-xl text-gray-900">
                  ${order.totalPrice ? order.totalPrice.toFixed(2) : (Array.isArray(order.items) ? order.items.reduce((acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 1)), 0) : 0).toFixed(2)}
                </span>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  <span>{formatShippingAddress(order.shippingAddress)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto"
      >
        <div className="flex flex-col items-center space-y-4 mb-8">
          <img
            src={user.avatar || 'https://picsum.photos/80'}
            alt={user.name}
            className="w-20 h-20 rounded-full border-2 border-blue-100"
            onError={handleImageError}
          />
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-400">Member since {user.memberSince || 'Unknown'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center">
              <FaCrown className="text-blue-600 mr-2" />
              <span className="text-gray-700">Membership Status</span>
            </div>
            <span className="text-green-600 font-semibold">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center">
              <FaCreditCard className="text-blue-600 mr-2" />
              <span className="text-gray-700">Payment Method</span>
            </div>
            <span className="text-gray-500">•••• •••• •••• 4242</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
            <div className="flex items-center">
              <FaBell className="text-blue-600 mr-2" />
              <span className="text-gray-700">Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all duration-200"></div>
            </label>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="mt-8 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
        >
          Delete Account
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 lg:sticky lg:top-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user.avatar || 'https://picsum.photos/200'}
                alt={user.name}
                className="w-12 h-12 rounded-lg border-2 border-blue-200"
                onError={handleImageError}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-2 font-medium">
              {[
                { name: FaChartLine, value: 'overview', icon: 'Overview' },
                { name: FaCalendar, value: 'planner', icon: 'Workout Planner' },
                { name: FaChartLine, value: 'progress', icon: 'Progress' },
                { name: FaShoppingBag, value: 'orders', icon: 'Orders' },
                { name: FaUser, value: 'profile', icon: 'Profile' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={`w-full flex items-center gap-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${activeTab === item.value
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <item.name className="text-lg" />
                  <span>{item.icon}</span>
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
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