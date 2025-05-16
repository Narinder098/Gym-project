import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaDumbbell, FaCalendar, FaChartLine, FaBox, FaCrown, FaShoppingBag, FaMapMarkerAlt, FaCreditCard, FaBell, FaTruck, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import WorkoutPlanner from './WorkoutPlanner';
import Progress from './Progress';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  // const { token } = useAuth();

  console.log(user);
  if (!user) return <div className="text-center py-10">Loading...</div>;
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/orders/user", {
          // headers: { Authorization: `Bearer ${token}` },
        });
        // const datas = JSON.parse(localStorage.getItem('payload'));
        // setOrders(datas);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };

    fetchOrders();
  }, []);

  const stats = [
  ];

  const recentWorkouts = [
  ];

  const subscriptionDetails = {
    plan: 'Premium Plan',
    status: 'Active',
    nextBilling: '2024-04-15',
    features: [
      'Unlimited access to all workouts',
      'Personal trainer consultation',
      'Nutrition planning',
      'Priority support'
    ]
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <stat.icon className="text-primary text-2xl" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FaShoppingBag className="text-primary mr-2" />
          Recent Orders
        </h3>
        <div className="space-y-4">
          {Array.isArray(orders) ? (
            orders.map(order => (
              <div
                key={order._id}
                className="border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order #{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-primary font-semibold mt-1">
                  ${order.items?.reduce((acc, item) => acc + (item.product?.price * item.quantity), 0).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p>No orders available</p>
          )}
        </div>
      </motion.div>

      {/* Recent Workouts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <FaDumbbell className="text-primary mr-2" />
          Recent Workouts
        </h3>
        <div className="space-y-4">
          {recentWorkouts.map((workout, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div>
                <h4 className="font-semibold">{workout.name}</h4>
                <p className="text-gray-600 text-sm">{workout.date}</p>
              </div>
              <span className="text-primary">{workout.duration}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderOrders = () => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-8">
          <h2 className="text-2xl font-bold mb-4">Order History</h2>
          <p>No orders available.</p>
        </div>
      );
    }
  
    const orderElements = orders.slice(0, 3).map((order) => (
      <motion.div
        key={order._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h3>
            <p className="text-gray-600">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm ${
              order.status === 'Delivered'
                ? 'bg-green-100 text-green-600'
                : order.status === 'Shipped'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-yellow-100 text-yellow-600'
            }`}
          >
            {order.status || 'Pending'}
          </span>
        </div>
  
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-semibold">{item.product?.name || 'Unknown Product'}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">${item.product?.price?.toFixed(2) || '0.00'}</p>
            </div>
          ))}
        </div>
  
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold text-xl">
              ${order.items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0).toFixed(2)}
            </span>
          </div>
  
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>{order.shippingAddress || 'Not Provided'}</span>
            </div>
            {order.tracking && (
              <div className="flex items-center">
                <FaTruck className="mr-2" />
                <span>Tracking: {order.tracking}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    ));
  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Order History</h2>
        {orderElements}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Member since {user.memberSince}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FaCrown className="text-primary mr-2" />
              <span>Membership Status</span>
            </div>
            <span className="text-green-600 font-semibold">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FaCreditCard className="text-primary mr-2" />
              <span>Payment Method</span>
            </div>
            <span>•••• •••• •••• 4242</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FaBell className="text-primary mr-2" />
              <span>Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <button
          onClick={() => {
            // TODO: Add API call to delete account
            logout();
            window.location.href = '/login';
          }}
          className="mt-6 w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          Delete Account
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="font-bold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <nav className="space-y-2">
              {/* Tab buttons */}
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                <FaChartLine />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('planner')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'planner' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                <FaCalendar />
                <span>Workout Planner</span>
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'progress' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                <FaChartLine />
                <span>Progress</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                <FaShoppingBag />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              >
                <FaUser />
                <span>Profile</span>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <FaSignOutAlt />
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
  
}
export default Dashboard;