import { motion } from 'framer-motion';

const HeroBanner = () => {
  return (
    <div className="relative h-[600px] flex items-center bg-cover bg-center transition-all duration-500" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')"
      }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white">
          <motion.h1 
            className="text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Fitness Hub
          </motion.h1>
          <h2 className="text-xl mb-8 transform translate-y-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.4s_forwards]">
            Sweat, Smile and Repeat
          </h2>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;