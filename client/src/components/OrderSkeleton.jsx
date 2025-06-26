import React from 'react';
import { motion } from 'framer-motion';

const OrderSkeleton = () => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-64 bg-gray-200" />
        <div className="absolute top-2 right-2">
          <span className="bg-gray-200 h-6 w-16 rounded-full" />
        </div>
      </div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-4 w-full" />
        <div className="h-4 bg-gray-200 rounded mb-4 w-5/6" />
        <div className="h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </motion.div>
  );
};

export default OrderSkeleton;