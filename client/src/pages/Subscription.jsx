import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaCrown, FaDumbbell, FaUserCheck } from 'react-icons/fa';

const plans = [
  {
    id: 'basic-plan',
    name: 'Basic Plan',
    price: 29.99,
    type: 'subscription',
    billing: 'monthly',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    features: [
      'Access to gym equipment',
      'Basic workout plans',
      'Locker room access',
      'Water fountain access'
    ]
  },
  {
    id: 'premium-plan',
    name: 'Premium Plan',
    price: 49.99,
    type: 'subscription',
    billing: 'monthly',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    features: [
      'All Basic Plan features',
      'Personal trainer sessions',
      'Access to group classes',
      'Nutrition consultation',
      'Towel service'
    ]
  },
  {
    id: 'pro-plan',
    name: 'Pro Plan',
    price: 79.99,
    type: 'subscription',
    billing: 'monthly',
    image: 'https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    features: [
      'All Premium Plan features',
      'Unlimited guest passes',
      'Private locker',
      'Massage therapy sessions',
      'Priority class booking'
    ]
  }
];

const Subscription = () => {
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (!user) {
      toast.error('Please login to subscribe');
      navigate('/login');
      return;
    }

    const isSubscriptionInCart = cartItems.some(item => item.type === 'subscription');
    if (isSubscriptionInCart) {
      toast.error('You already have a subscription plan in your cart');
      return;
    }

    addToCart(plan);
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12 transform translate-y-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
        <h1 className="text-4xl font-bold mb-4">Membership Plans</h1>
        <p className="text-gray-600">Choose the perfect plan for your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform translate-y-4 opacity-0 hover:-translate-y-2 transition-all duration-300"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
            }}
          >
            <div className="relative">
              <img
                src={plan.image}
                alt={plan.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-bl-lg">
                ${plan.price}/month
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center mb-4">
                <FaCrown className="text-blue-500 text-2xl mr-2" />
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <FaUserCheck className="text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
                <button
                  onClick={() => handleSubscribe(plan)}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <FaDumbbell className="mr-2" />
                  Subscribe Now
                </button>
                {!user && (
                  <p className="text-sm text-gray-500 text-center">
                    Login required to subscribe
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Subscription Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start">
            <FaDumbbell className="text-blue-500 text-2xl mr-3 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Premium Equipment</h3>
              <p className="text-gray-600">Access to state-of-the-art fitness equipment</p>
            </div>
          </div>
          <div className="flex items-start">
            <FaUserCheck className="text-blue-500 text-2xl mr-3 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Personal training and professional support</p>
            </div>
          </div>
          <div className="flex items-start">
            <FaCrown className="text-blue-500 text-2xl mr-3 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Exclusive Perks</h3>
              <p className="text-gray-600">Special member benefits and priority access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;