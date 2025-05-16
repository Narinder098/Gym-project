import { useState } from 'react';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      user: 'John Doe',
      date: '2024-03-14',
      items: [
        { name: 'Professional Treadmill', quantity: 1, price: 999.99 }
      ],
      total: 999.99,
      status: 'Processing',
      address: '123 Main St, City, State, 12345',
      tracking: 'USPS1234567890'
    },
    {
      id: 'ORD002',
      user: 'Jane Smith',
      date: '2024-03-10',
      items: [
        { name: 'Adjustable Dumbbells', quantity: 1, price: 299.99 },
        { name: 'Yoga Mat', quantity: 1, price: 49.99 }
      ],
      total: 349.98,
      status: 'Shipped',
      address: '456 Oak St, City, State, 12345',
      tracking: 'FEDEX9876543210'
    }
  ]);

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success('Order status updated successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                <p className="text-gray-600">{order.date}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                className={`px-4 py-2 rounded-full text-sm ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                  'bg-yellow-100 text-yellow-600'
                }`}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Customer</h4>
                
                <p className="text-gray-600">{order.user}</p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Items</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-gray-600">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{order.address}</span>
                </div>
                {order.tracking && (
                  <div className="flex items-center">
                    <FaTruck className="mr-2" />
                    <span>Tracking: {order.tracking}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersManagement;