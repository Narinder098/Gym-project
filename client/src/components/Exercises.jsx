import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaDumbbell, FaRunning, FaHeartbeat } from 'react-icons/fa';
import { Rings } from 'react-loader-spinner';
import { motion, AnimatePresence } from 'framer-motion';

// Static categories
const categories = [
  { id: 'all', name: 'All Exercises', icon: FaDumbbell },
  { id: 'strength', name: 'Strength Training', icon: FaDumbbell },
  { id: 'cardio', name: 'Cardio', icon: FaRunning },
  { id: 'flexibility', name: 'Flexibility', icon: FaHeartbeat },
];

// Static workout routines
const workoutRoutines = [
  {
    id: 'beginner',
    name: 'Beginner Full Body',
    duration: '45 mins',
    exercises: ['Bodyweight Squats', 'Push-ups', 'Lunges', 'Plank', 'Jumping Jacks'],
    level: 'Beginner',
  },
  {
    id: 'intermediate',
    name: 'Intermediate Split',
    duration: '60 mins',
    exercises: ['Bench Press', 'Deadlifts', 'Pull-ups', 'Military Press', 'Leg Press'],
    level: 'Intermediate',
  },
  {
    id: 'advanced',
    name: 'Advanced Power',
    duration: '90 mins',
    exercises: ['Power Cleans', 'Snatch', 'Clean and Jerk', 'Front Squats', 'Barbell Rows'],
    level: 'Advanced',
  },
  {
    id: 'cardio',
    name: 'Cardio Blast',
    duration: '30 mins',
    exercises: ['Treadmill Running', 'Burpees', 'Mountain Climbers', 'Jump Rope'],
    level: 'All Levels',
  },
  {
    id: 'flexibility',
    name: 'Flexibility Flow',
    duration: '20 mins',
    exercises: ['Plank', 'Downward Dog', 'Child’s Pose', 'Seated Forward Bend'],
    level: 'Beginner',
  },
  {
    id: 'core',
    name: 'Core Crusher',
    duration: '25 mins',
    exercises: ['Russian Twists', 'Bicycle Crunches', 'Leg Raises', 'Side Plank'],
    level: 'Intermediate',
  },
];

// Static exercises list with specific images
const exercisesList = [
  {
    id: '1',
    name: 'Bench Press',
    category: 'strength',
    muscle: 'Chest',
    equipment: 'Barbell',
    image: 'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Deadlift',
    category: 'strength',
    muscle: 'Back',
    equipment: 'Barbell',
    image: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: 'Squats',
    category: 'strength',
    muscle: 'Legs',
    equipment: 'Barbell',
    image: 'https://images.pexels.com/photos/4608152/pexels-photo-4608152.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    name: 'Pull-ups',
    category: 'strength',
    muscle: 'Back',
    equipment: 'Pull-up Bar',
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '5',
    name: 'Push-ups',
    category: 'strength',
    muscle: 'Chest',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    name: 'Plank',
    category: 'flexibility',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '7',
    name: 'Treadmill Running',
    category: 'cardio',
    muscle: 'Cardiovascular System',
    equipment: 'Treadmill',
    image: 'https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '8',
    name: 'Bicep Curls',
    category: 'strength',
    muscle: 'Biceps',
    equipment: 'Dumbbell',
    image: 'https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '9',
    name: 'Tricep Dips',
    category: 'strength',
    muscle: 'Triceps',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162485/pexels-photo-4162485.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '10',
    name: 'Lunges',
    category: 'strength',
    muscle: 'Legs',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '12',
    name: 'Downward Dog',
    category: 'flexibility',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/317155/pexels-photo-317155.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '13',
    name: 'Military Press',
    category: 'strength',
    muscle: 'Shoulders',
    equipment: 'Barbell',
    image: 'https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '14',
    name: 'Mountain Climbers',
    category: 'cardio',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162459/pexels-photo-4162459.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '16',
    name: 'Leg Press',
    category: 'strength',
    muscle: 'Legs',
    equipment: 'Machine',
    image: 'https://images.pexels.com/photos/4162471/pexels-photo-4162471.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '17',
    name: 'Jump Rope',
    category: 'cardio',
    muscle: 'Cardiovascular System',
    equipment: 'Jump Rope',
    image: 'https://images.pexels.com/photos/4162468/pexels-photo-4162468.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '18',
    name: 'Child’s Pose',
    category: 'flexibility',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/6740819/pexels-photo-6740819.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '11',
    name: 'Chest Flyes',
    category: 'strength',
    muscle: 'Chest',
    equipment: 'Dumbbell',
    image: 'https://images.pexels.com/photos/3838937/pexels-photo-3838937.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '15',
    name: 'Bicycle Crunches',
    category: 'strength',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162457/pexels-photo-4162457.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!exercisesList || exercisesList.length === 0) {
        throw new Error('No exercises available');
      }
      setExercises(exercisesList);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleStartWorkout = (routineId) => {
    navigate(`/workout/${routineId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <Rings
          height="80"
          width="80"
          color="#2563eb"
          radius="6"
          visible={true}
          ariaLabel="Loading exercises"
        />
        <p className="mt-4 text-base text-gray-600">Loading exercises...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <p className="text-base text-red-600">Error: {error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 transition-colors duration-300"
          aria-label="Retry loading exercises"
        >
          Retry
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl sm:text-3xl font-bold text-gray-800 text-center"
        >
          Fitness Hub Exercises
        </motion.h1>
      </div>

      {/* Search and Categories */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto mb-12"
        aria-labelledby="search-heading"
      >
        <h2 id="search-heading" className="sr-only">Search and Filter Exercises</h2>
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search exercises by name, muscle, equipment, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              aria-label="Search exercises by name, muscle, equipment, or category"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" aria-hidden="true" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center px-4 py-3 text-base font-medium rounded-lg border border-gray-300 transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white'
              }`}
              aria-pressed={selectedCategory === category.id}
              aria-label={`Filter by ${category.name}`}
            >
              <category.icon className="mr-2 text-lg" aria-hidden="true" />
              {category.name}
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Daily Workout Routines */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-7xl mx-auto mb-12"
        aria-labelledby="routines-heading"
      >
        <h2 id="routines-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Daily Workout Routines
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {workoutRoutines.map((routine, index) => (
              <motion.div
                key={routine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{routine.name}</h3>
                <div className="flex items-center text-gray-600 text-base mb-4">
                  <FaHeartbeat className="mr-2 text-blue-600" aria-hidden="true" />
                  <span>{routine.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{routine.level}</span>
                </div>
                <ul className="space-y-2 text-base text-gray-700">
                  {routine.exercises.map((exercise, idx) => (
                    <li key={idx} className="flex items-center">
                      <FaDumbbell className="mr-2 text-blue-600 text-sm" aria-hidden="true" />
                      {exercise}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartWorkout(routine.id)}
                  className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors duration-300"
                  aria-label={`Start ${routine.name} workout`}
                >
                  Start Workout
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Exercise Library */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="max-w-7xl mx-auto"
        aria-labelledby="library-heading"
      >
        <h2 id="library-heading" className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Exercise Library
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredExercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=No+Image')}
                  aria-label={`Image of ${exercise.name} exercise`}
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{exercise.name}</h3>
                  <div className="space-y-1 text-base text-gray-600">
                    <p>Category: {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}</p>
                    <p>Target Muscle: {exercise.muscle}</p>
                    <p>Equipment: {exercise.equipment}</p>
                  </div>
                  <Link
                    to={`/exercise/${exercise.id}`}
                    className="mt-4 w-full block bg-blue-600 text-white py-3 rounded-lg text-base font-medium hover:bg-blue-700 transition-colors duration-300 text-center"
                    aria-label={`View details for ${exercise.name}`}
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredExercises.length === 0 && (
          <div className="text-center text-gray-600 mt-8 text-base">
            No exercises found for this search or category.
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Exercises;