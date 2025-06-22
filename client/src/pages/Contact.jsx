import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/contact`, data, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      toast.error('Error sending message');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto transform translate-y-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            />
            {errors.name && <p className="text-blue-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            />
            {errors.email && <p className="text-blue-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              {...register('message', { required: 'Message is required' })}
              rows="5"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;