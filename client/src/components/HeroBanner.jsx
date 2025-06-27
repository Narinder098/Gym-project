import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div
      className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Hero Content */}
      <div className="relative z-10 px-4 text-center max-w-3xl mx-auto text-white">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Unleash the Athlete Within
        </motion.h1>

        <motion.p
          className="mt-4 text-lg sm:text-xl text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Join Fitness Hub and transform your lifestyle. Whether your goal is to build strength, lose fat, or simply move better—we're here to guide you every rep of the way.
        </motion.p>

        {/* Call to Action */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/subscription"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white text-sm shadow-lg transition duration-300"
          >
            Get Membership
          </Link>
          <Link
            to="/exercises"
            className="bg-transparent border border-white hover:bg-white hover:text-black px-6 py-3 rounded-lg font-semibold text-white text-sm shadow-lg transition duration-300"
          >
            Explore Workouts
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;


