import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaTrash, FaTruck, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';


const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);
  // const user = JSON.parse(localStorage.getItem('user'));
  const { user } = useAuth();

  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );
  const [address, setAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('credit');
  const [step, setStep] = useState('cart'); // cart, address, payment, review

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantities({ ...quantities, [itemId]: newQuantity });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * quantities[item.id]), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? 0 : 9.99;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep('review');
    toast.success('Delivery address saved!');
  };

  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: quantities[item.id],
        })),
        shippingAddress: address, // Ensure 'address' is a valid object
      };

      // Log the payload to inspect its structure
      console.log("Order Payload:", orderPayload);
      localStorage.setItem('payload', JSON.stringify(orderPayload)); // Stringify the object

      const user = JSON.parse(localStorage.getItem("user"));
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

      // Send the request with headers
      const res = await axios.post('http://localhost:8000/orders/place', orderPayload, { headers });

      // Check response
      if (res.data.success) {
        toast.success("Order placed successfully");
        navigate("/");
      } else {
        toast.error(res.data.message || "Order placement failed");
      }
    } catch (err) {
      console.error("Order failed:", err);
      toast.error("Error placing order");
    }
  };

  const renderCartItems = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center border-b border-gray-200 py-4 last:border-b-0"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-grow ml-4">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">${item.price.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FaMinus />
              </button>
              <span className="mx-4">{quantities[item.id]}</span>
              <button
                onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}
                className="text-gray-500 hover:text-primary transition-colors"
              >
                <FaPlus />
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-6 text-red-500 hover:text-red-600 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">
              ${(item.price * quantities[item.id]).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAddressForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>
      <form onSubmit={handleAddressSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            required
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            required
            value={address.streetAddress}
            onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">City</label>
            <input
              type="text"
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">State</label>
            <input
              type="text"
              required
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              required
              value={address.zipCode}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${calculateSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {calculateShipping() === 0 ? (
              <span className="text-green-500">Free</span>
            ) : (
              `$${calculateShipping().toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${calculateTax().toFixed(2)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        {step === 'cart' && (
          <button
            onClick={() => {
              if (user) {
                setStep('address'); // User is logged in
              } else {
                navigate('/login'); // User is not logged in
                toast('Please login to continue', { icon: '🔐' });
              }
            }}
            disabled={cartItems.length === 0}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300 disabled:bg-gray-400"
          >
            Proceed to Checkout
          </button>
        )}
        {step === 'review' && (
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Place Order
          </button>
        )}
      </div>
      {calculateSubtotal() < 100 && (
        <p className="mt-4 text-sm text-gray-600">
          Add ${(100 - calculateSubtotal()).toFixed(2)} more to get free shipping!
        </p>
      )}
    </div>
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Your Cart is Empty</h1>
          <button
            onClick={() => navigate('/shop')}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'cart' && renderCartItems()}
          {step === 'address' && renderAddressForm()}
          {step === 'review' && (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Order Review</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Delivery Address</h3>
                    <p className="text-gray-600">
                      {address.fullName}<br />
                      {address.streetAddress}<br />
                      {address.city}, {address.state} {address.zipCode}<br />
                      Phone: {address.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Payment Method</h3>
                    <p className="text-gray-600">Payment pending</p>
                  </div>
                </div>
              </div>
              {renderCartItems()}
            </>
          )}
        </div>
        <div className="lg:col-span-1">
          {renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default Cart;