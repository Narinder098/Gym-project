import React from 'react';
import { motion } from 'framer-motion';

const OrderSkeleton = () => {
  const rowCount = 1; // Adjust based on typical order count
  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 animate-pulse">
      {[...Array(rowCount)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-white p-4 rounded-lg shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"  />
          <div className="h-2 w-1/3 bg-gray-200 rounded" />
        </motion.div>
      ))}
    </div>
  );
};

export default OrderSkeleton;