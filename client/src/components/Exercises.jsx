
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { FaSearch, FaDumbbell, FaRunning, FaHeartbeat } from 'react-icons/fa';
import { Rings } from 'react-loader-spinner';

// Static categories
const categories = [
  { id: 'all', name: 'All Exercises', icon: FaDumbbell },
  { id: 'strength', name: 'Strength Training', icon: FaDumbbell },
  { id: 'cardio', name: 'Cardio', icon: FaRunning },
  { id: 'flexibility', name: 'Flexibility', icon: FaHeartbeat },
];

// Static workout routines (expanded)
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
  {
    id: 'upper-body',
    name: 'Upper Body Pump',
    duration: '40 mins',
    exercises: ['Bicep Curls', 'Tricep Dips', 'Shoulder Press', 'Chest Flyes'],
    level: 'Intermediate',
  },
];

// Static exercises list (expanded to 20)
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
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '11',
    name: 'Burpees',
    category: 'cardio',
    muscle: 'Full Body',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '12',
    name: 'Downward Dog',
    category: 'flexibility',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '15',
    name: 'Russian Twists',
    category: 'strength',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '16',
    name: 'Leg Press',
    category: 'strength',
    muscle: 'Legs',
    equipment: 'Machine',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '17',
    name: 'Jump Rope',
    category: 'cardio',
    muscle: 'Cardiovascular System',
    equipment: 'Jump Rope',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '18',
    name: 'Child’s Pose',
    category: 'flexibility',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '19',
    name: 'Chest Flyes',
    category: 'strength',
    muscle: 'Chest',
    equipment: 'Dumbbell',
    image: 'https://images.pexels.com/photos/3838937/pexels-photo-3838937.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '20',
    name: 'Bicycle Crunches',
    category: 'strength',
    muscle: 'Core',
    equipment: 'Body Weight',
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Added for navigation

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

  // Filter exercises based on search term and category
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle Start Workout button click
  const handleStartWorkout = (routineId) => {
    navigate(`/workout/${routineId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Rings
          height="80"
          width="80"
          color="#ff2625"
          radius="6"
          visible={true}
          ariaLabel="Loading exercises"
        />
        <p className="mt-4 text-sm text-gray-600">Loading exercises...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-sm text-red-600">Error: {error}</p>
        <button
          className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          onClick={() => window.location.reload()}
          aria-label="Retry loading exercises"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Categories */}
      <div className="mb-12">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-blue-600 transition-colors duration-300 text-sm"
              aria-label="Search exercises by name, muscle, equipment, or category"
            />
            <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-300 border border-gray-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white'
              }`}
              aria-pressed={selectedCategory === category.id}
              aria-label={`Filter by ${category.name}`}
            >
              <category.icon className="mr-2 text-sm" aria-hidden="true" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Workout Routines */}
      <section className="mb-12" aria-labelledby="routines-heading">
        <h2 id="routines-heading" className="text-2xl font-bold mb-4">Daily Workout Routines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutRoutines.map((routine, index) => (
            <div
              key={routine.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
              }}
            >
              <h3 className="text-lg font-semibold mb-2">{routine.name}</h3>
              <div className="flex items-center text-gray-600 mb-4 text-sm">
                <FaHeartbeat className="mr-2" aria-hidden="true" />
                <span>{routine.duration}</span>
                <span className="mx-2">•</span>
                <span>{routine.level}</span>
              </div>
              <ul className="space-y-2 text-sm">
                {routine.exercises.map((exercise, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <FaDumbbell className="mr-2 text-blue-600" aria-hidden="true" />
                    {exercise}
                  </li>
                ))}
              </ul>
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-300"
                onClick={() => handleStartWorkout(routine.id)}
                aria-label={`Start ${routine.name} workout`}
              >
                Start Workout
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Exercise Library */}
      <section aria-labelledby="library-heading">
        <h2 id="library-heading" className="text-2xl font-bold mb-4">Exercise Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise, index) => (
            <div
              key={exercise.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transform hover:-translate-y-1 transition-all duration-300"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
              }}
            >
              <img
                src={exercise.image || '/fallback-exercise-image.jpg'}
                alt={exercise.name}
                className="w-full h-40 object-cover"
                onError={(e) => (e.target.src = '/fallback-exercise-image.jpg')}
                aria-label={`Image of ${exercise.name} exercise`}
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
                <div className="space-y-1 text-gray-600 text-sm">
                  <p>Category: {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}</p>
                  <p>Target Muscle: {exercise.muscle}</p>
                  <p>Equipment: {exercise.equipment}</p>
                </div>
                <Link
                  to={`/exercise/${exercise.id}`}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-300 block text-center"
                  aria-label={`View details for ${exercise.name}`}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        {filteredExercises.length === 0 && (
          <div className="text-center text-gray-600 mt-8 text-sm">
            No exercises found for this search or category.
          </div>
        )}
      </section>
    </div>
  );
};

export default Exercises;