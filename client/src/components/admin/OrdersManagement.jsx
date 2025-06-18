import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaMapMarkerAlt, FaTruck, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

// Constants
const STATUS_COLORS = {
  Delivered: { bg: 'bg-green-100', text: 'text-green-600' },
  Shipped: { bg: 'bg-blue-100', text: 'text-blue-600' },
  Processing: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-600' },
};

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

// Reusable Component
const StatusSelect = memo(({ status, onChange, orderId }) => {
  const { bg, text } = STATUS_COLORS[status] || STATUS_COLORS.Processing;
  return (
    <select
      value={status}
      onChange={(e) => onChange(orderId, e.target.value)}
      className={`px-4 py-2 rounded-full text-sm font-medium ${bg} ${text} focus:outline-none focus:ring-2 focus:ring-blue-300`}
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
});

StatusSelect.propTypes = {
  status: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
};

// Main Component
const OrderManagement = () => {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const [orderLoading, setOrderLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Debug user state
    console.log('Auth state:', { user, authLoading, isAdmin: isAdmin() });

    // Only check auth when authLoading is false
    if (!authLoading && (!user || !isAdmin())) {
      navigate('/login');
      toast.error('Admin access required');
    }
  }, [user, authLoading, isAdmin, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrderLoading(true);
        setError(null);
        const response = await axios.get('https://gym-project-server.onrender.com/orders/admin', {
          withCredentials: true,
        });
        if (response.data.success) {
          const uniqueOrders = Array.from(
            new Map(response.data.orders.map((order) => [order._id, order])).values()
          );
          setOrders(uniqueOrders);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
          toast.error(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err.response?.status === 401) {
          setError('Unauthorized: Please log in as admin');
          logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Error fetching orders');
          toast.error(err.response?.data?.message || 'Error fetching orders');
        }
      } finally {
        setOrderLoading(false);
      }
    };

    if (user && isAdmin()) {
      fetchOrders();
    }
  }, [user, isAdmin, logout, navigate]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `https://gym-project-server.onrender.com/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success('Order status updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const response = await axios.delete(`https://gym-project-server.onrender.com/orders/${orderId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
        toast.success('Order deleted successfully');
      } else {
        toast.error(response.data.message || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error(err.response?.data?.message || 'Error deleting order');
    }
  };

  const formatAddress = useMemo(
    () => (address) => {
      if (!address || typeof address !== 'object') return 'Not Provided';
      const { street, city, state, postalCode, country } = address;
      return [street, city, state, postalCode, country].filter(Boolean).join(', ') || 'Not Provided';
    },
    []
  );

  const calculateTotal = useMemo(
    () => (items) =>
      Array.isArray(items)
        ? items
            .reduce((acc, item) => acc + ((item.product?.price || 0) * (item.quantity || 1)), 0)
            .toFixed(2)
        : '0.00',
    []
  );

  // Combined loading state
  if (authLoading || orderLoading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orders Management</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Orders Management</h2>
        <p>No orders available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h1>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Order #{order._id.slice(-6)}
                </h3>
                <p className="text-gray-600 text-sm">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Date not available'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <StatusSelect
                  status={order.status}
                  onChange={handleUpdateStatus}
                  orderId={order._id}
                />
                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  aria-label="Delete order"
                >
                  <FaTrash className="text-lg" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Customer</h4>
                <p className="text-gray-600">
                  {order.user?.name || order.user?.email || 'Unknown User'}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <div
                      key={item._id || item.product?._id || `${order._id}-${idx}`}
                      className="flex justify-between items-center text-gray-600"
                    >
                      <span>
                        {item.product?.name || 'Unknown Product'} x {item.quantity || 1}
                      </span>
                      <span>
                        ${(item.product?.price ? item.product.price.toFixed(2) : '0.00')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No items in this order.</p>
                )}
                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center font-semibold text-gray-900">
                  <span>Total</span>
                  <span>
                    ${order.totalPrice ? order.totalPrice.toFixed(2) : calculateTotal(order.items)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  <span>{formatAddress(order.shippingAddress)}</span>
                </div>
                {order.tracking && (
                  <div className="flex items-center">
                    <FaTruck className="mr-2 text-blue-600" />
                    <span>Tracking: {order.tracking}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

OrderManagement.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    role: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default OrderManagement;