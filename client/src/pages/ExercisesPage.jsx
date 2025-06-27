import Exercises from '../components/Exercises';
import { motion } from 'framer-motion';


const ExercisesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-6 bg-blue-400 text-white"
      >
        <div className="container max-w-3xl mx-auto px-4 flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Exercise Library
          </h1>
          <p className="text-center text-base text-gray-100 max-w-xl">
            Discover a comprehensive collection of exercises to help you achieve your fitness goals. 
            Filter by body part or search for specific exercises.
          </p>
        </div>
      </motion.div>
      <Exercises />
    </div>
  );
};

export default ExercisesPage;