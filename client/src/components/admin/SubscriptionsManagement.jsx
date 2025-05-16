import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([
    {
      id: 'basic-plan',
      name: 'Basic Plan',
      price: 29.99,
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
      features: [
        'All Basic Plan features',
        'Personal trainer sessions',
        'Access to group classes',
        'Nutrition consultation',
        'Towel service'
      ]
    }
  ]);

  const [newSubscription, setNewSubscription] = useState({
    name: '',
    price: '',
    features: []
  });

  const [newFeature, setNewFeature] = useState('');

  const handleAddSubscription = (e) => {
    e.preventDefault();
    if (newSubscription.name && newSubscription.price) {
      setSubscriptions([
        ...subscriptions,
        {
          id: `${newSubscription.name.toLowerCase().replace(/\s+/g, '-')}-plan`,
          ...newSubscription,
          price: parseFloat(newSubscription.price)
        }
      ]);
      setNewSubscription({ name: '', price: '', features: [] });
      toast.success('Subscription plan added successfully');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewSubscription({
        ...newSubscription,
        features: [...newSubscription.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    toast.success('Subscription plan deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscriptions Management</h1>
        <button
          onClick={() => document.getElementById('addSubscriptionForm').scrollIntoView({ behavior: 'smooth' })}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map(subscription => (
          <div
            key={subscription.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{subscription.name}</h3>
                <p className="text-2xl font-bold text-primary mt-2">
                  ${subscription.price.toFixed(2)}/month
                </p>
                <ul className="mt-4 space-y-2">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleDeleteSubscription(subscription.id)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <form id="addSubscriptionForm" onSubmit={handleAddSubscription} className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Add New Subscription Plan</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Plan Name"
              value={newSubscription.name}
              onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Monthly Price"
              value={newSubscription.price}
              onChange={(e) => setNewSubscription({ ...newSubscription, price: e.target.value })}
              className="px-4 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add Feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {newSubscription.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Add Subscription Plan
        </button>
      </form>
    </div>
  );
};

export default SubscriptionsManagement;