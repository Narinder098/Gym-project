import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `https://gym-project-server.onrender.com/contact`,
        data
      );
      console.log('Contact form response:', response.data);
      if (response.data.success) {
        toast.success('Message sent successfully!');
        reset();
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error sending message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {isSubmitting && <LoadingSpinner />}
      <div className="max-w-2xl mx-auto animate-fadeInUp">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Contact Us</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-lg p-8 rounded-lg">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              {...register('message', { required: 'Message is required' })}
              rows="5"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={isSubmitting}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* Blogs Section */}
      <div className="mt-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Latest From Our Blog</h2>
        <p className="text-gray-600 mb-12">Explore tips, workouts, and nutrition insights from fitness experts.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Top 5 HIIT Workouts to Burn Fat Fast",
              desc: "High-intensity interval training can boost your metabolism and help you burn fat in less time.",
              img: "https://images.unsplash.com/photo-1605296866985-34b1747a8929?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "Meal Prep Tips for a Healthy Week",
              desc: "Simplify your fitness nutrition with these easy meal planning hacks and protein-packed ideas.",
              img: "https://images.unsplash.com/photo-1556912999-38c4a36f29b9?q=80&w=800&auto=format&fit=crop"
            },
            {
              title: "Mindset & Motivation: Stay Consistent",
              desc: "Learn mental strategies and motivational tricks that help you stay on track with your fitness journey.",
              img: "https://images.unsplash.com/photo-1600372011585-3d3a98d40f45?q=80&w=800&auto=format&fit=crop"
            }
          ].map((blog, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img src={blog.img} alt={blog.title} className="w-full h-40 object-cover" />
              <div className="p-4 text-left">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600">{blog.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
