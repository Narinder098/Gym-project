import React from 'react';
import { motion } from 'framer-motion';

const TableSkeleton = () => {
  const rowCount = 5; // Number of skeleton rows
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg animate-pulse">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['User', 'Email', 'Membership', 'Status', 'Join Date', 'Actions'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(rowCount)].map((_, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="ml-4 h-4 w-24 bg-gray-200 rounded" />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;