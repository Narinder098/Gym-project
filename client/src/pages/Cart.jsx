import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState(() =>
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity || 1 }), {})
  );

  const [address, setAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const [step, setStep] = useState('cart');

  const updateQuantity = (itemId, newQty) => {
    if (newQty >= 1 && newQty <= 10) {
      setQuantities(prev => ({ ...prev, [itemId]: newQty }));
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * (quantities[item.id] || 1), 0),
    [cartItems, quantities]
  );

  const shipping = useMemo(() => (subtotal >= 100 ? 0 : 9.99), [subtotal]);
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep('review');
    toast.success('Delivery address saved!');
  };

  const handlePlaceOrder = async () => {
    try {
      const payload = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: quantities[item.id] || 1,
        })),
        shippingAddress: {
          street: address.streetAddress,
          city: address.city,
          state: address.state,
          zip: address.zipCode,
          fullName: address.fullName,
          phone: address.phone,
        },
      };
      const token = localStorage.getItem("token");
      console.log('Placing order:', payload);
      const response = await axios.post('https://gym-project-server.onrender.com/orders/place', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log('Order response:', response.data);
      if (response.data.success) {
        toast.success('Order placed successfully');
        clearCart();
        navigate('/Dashboard');
      } else {
        toast.error(response.data.message || 'Order placement failed');
      }
    } catch (err) {
      console.error('Order placement error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error placing order');
    }
  };

  const renderCartItems = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {cartItems.map((item, index) => (
        <div key={item._id || index} className="flex items-center border-b py-4">
          <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
          <div className="flex-grow ml-4">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">${item.price.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <button onClick={() => updateQuantity(item.id, quantities[item.id] - 1)} className="text-gray-500 hover:text-primary">
                <FaMinus />
              </button>
              <span className="mx-4">{quantities[item.id]}</span>
              <button onClick={() => updateQuantity(item.id, quantities[item.id] + 1)} className="text-gray-500 hover:text-primary">
                <FaPlus />
              </button>
              <button onClick={() => removeFromCart(item.id)} className="ml-6 text-red-500 hover:text-red-600">
                <FaTrash />
              </button>
            </div>
          </div>
          <div className="text-right font-bold text-lg">${((item.price * quantities[item.id]) || item.price).toFixed(2)}</div>
        </div>
      ))}
    </div>
  );

  const renderAddressForm = () => (
    <form onSubmit={handleAddressSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
      {['fullName', 'streetAddress', 'city', 'state', 'zipCode', 'phone'].map(field => (
        <div key={field}>
          <label className="block text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
          <input
            type={field === 'phone' ? 'tel' : 'text'}
            required
            value={address[field]}
            onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      ))}
      <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600">Continue to Review</button>
    </form>
  );

  const renderOrderSummary = () => (
    <div className=" bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div className="space-y-2">
        <SummaryRow label="Subtotal" value={subtotal} />
        <SummaryRow label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
        <SummaryRow label="Tax" value={tax} />
        <div className="border-t pt-4 font-bold text-lg flex justify-between">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {step === 'cart' && (
          <button
            onClick={() => {
              if (user) setStep('address');
              else {
                toast.error('Please login to continue', { icon: '🔐' });
                navigate('/login');
              }
            }}
            disabled={!cartItems.length}
            className="w-full bg-primary text-white py-3 rounded-lg mt-4 hover:bg-red-600 disabled:bg-gray-400"
          >
            Proceed to Checkout
          </button>
        )}
        {step === 'review' && (
          <button onClick={handlePlaceOrder} className="w-full bg-primary text-white py-3 rounded-lg mt-4 hover:bg-red-600">
            Place Order
          </button>
        )}
      </div>
      {subtotal < 100 && (
        <p className="mt-4 text-sm text-gray-600">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
      )}
    </div>
  );

  const SummaryRow = ({ label, value }) => (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{typeof value === 'number' ? `$${value.toFixed(2)}` : value}</span>
    </div>
  );

  const renderReview = () => (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Order Review</h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold">Delivery Address</h3>
            <p>{`${address.fullName}, ${address.streetAddress}, ${address.city}, ${address.state} ${address.zipCode}`}</p>
            <p>Phone: {address.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">Payment Method</h3>
            <p>Payment pending</p>
          </div>
        </div>
      </div>
      {renderCartItems()}
    </>
  );

  if (!cartItems.length) {
    return (
      <div className="h-screen mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-8">Your Cart is Empty</h1>
        <button onClick={() => navigate('/shop')} className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-600">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className=" container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'cart' && renderCartItems()}
          {step === 'address' && renderAddressForm()}
          {step === 'review' && renderReview()}
        </div>
        <div className="lg:col-span-1">{renderOrderSummary()}</div>
      </div>
    </div>
  );
};

export default Cart;