import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Rings } from 'react-loader-spinner';
import { FaDumbbell, FaCheckCircle } from 'react-icons/fa';

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
  {
    id: 'upper-body',
    name: 'Upper Body Pump',
    duration: '40 mins',
    exercises: ['Bicep Curls', 'Tricep Dips', 'Shoulder Press', 'Chest Flyes'],
    level: 'Intermediate',
  },
];

// Static exercises list
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
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-body.jpg?auto=compress&cs=tinysrgb&w=800',
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
    image: 'https://images.pexels.com/photos/4162438/pexels-photo-body.jpg?auto=compress&cs=tinysrgb&w=800',
  },
];

// Simple mapping of routine exercise names to exercisesList IDs
const exerciseNameToIdMap = {
  'Bodyweight Squats': '3',
  'Push-ups': '5',
  'Lunges': '10',
  'Plank': '6',
  'Jumping Jacks': null,
  'Bench Press': '1',
  'Deadlifts': '2',
  'Pull-ups': '4',
  'Military Press': '13',
  'Leg Press': '16',
  'Power Cleans': null,
  'Snatch': null,
  'Clean and Jerk': null,
  'Front Squats': null,
  'Barbell Rows': null,
  'Treadmill Running': '7',
  'Burpees': '11',
  'Mountain Climbers': '14',
  'Jump Rope': '17',
  'Downward Dog': '12',
  'Child’s Pose': '18',
  'Seated Forward Bend': null,
  'Russian Twists': '15',
  'Bicycle Crunches': '20',
  'Leg Raises': null,
  'Side Plank': null,
  'Bicep Curls': '8',
  'Tricep Dips': '9',
  'Shoulder Press': '13',
  'Chest Flyes': '19',
};

const WorkoutSession = () => {
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const selectedRoutine = workoutRoutines.find((r) => r.id === id);
      if (!selectedRoutine) {
        throw new Error('Workout routine not found');
      }
      setRoutine(selectedRoutine);
      setLoading(false);

      // Start timer
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id]);

  // Check if all exercises are completed
  const allExercisesCompleted = routine && completedExercises.length === routine.exercises.length;

  // Format timer as MM:SS
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle exercise completion
  const toggleExerciseCompletion = (exercise) => {
    setCompletedExercises((prev) =>
      prev.includes(exercise)
        ? prev.filter((ex) => ex !== exercise)
        : [...prev, exercise]
    );
  };

  // Handle finishing the workout
  const handleFinishWorkout = () => {
    if (allExercisesCompleted) {
      // Save workout to localStorage
      const workoutRecord = {
        id: Date.now().toString(), // Unique ID
        routineId: routine.id,
        name: routine.name,
        duration: routine.duration,
        level: routine.level,
        exercises: routine.exercises,
        completedAt: new Date().toISOString(),
        timerSeconds: timer,
      };

      const storedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
      localStorage.setItem('completedWorkouts', JSON.stringify([workoutRecord, ...storedWorkouts]));
    }
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Rings
          height="80"
          width="80"
          color="#ff4625"
          radius="6"
          visible={true}
          ariaLabel="Loading workout session"
        />
        <p className="mt-4 text-sm text-gray-600">Loading workout session...</p>
      </div>
    );
  }

  if (error || !routine) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Workout Not Found</h1>
        <p className="mt-4 text-sm text-gray-600">{error || 'The workout routine not found.'}</p>
        <Link
          to="/"
          className="mt-4 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 inline-block"
          aria-label="Go back to exercises"
        >
          Back to Exercises
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold mb-2">{routine.name}</h1>
        <div className="flex items-center text-gray-600 mb-4 text-sm">
          <span>{routine.duration}</span>
          <span className="mx-2">•</span>
          <span>{routine.level}</span>
          <span className="mx-2">•</span>
          <span>Elapsed Time: {formatTimer(timer)}</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-300"
            onClick={() => setCompletedExercises([])}
            aria-label="Reset workout progress"
            disabled={completedExercises.length === 0}
          >
            Reset Workout
          </button>
          {allExercisesCompleted && (
            <button
              className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors duration-300"
              onClick={handleFinishWorkout}
              aria-label="Finish workout and go to dashboard"
            >
              Finish Workout
            </button>
          )}
        </div>
      </div>

      <section aria-labelledby="workout-exercises-heading">
        <h2 id="workout-exercises-heading" className="text-lg font-semibold mb-4">Exercises</h2>
        <div className="space-y-4">
          {routine.exercises.map((exercise, index) => {
            const exerciseId = exerciseNameToIdMap[exercise];
            const exerciseDetails = exerciseId ? exercisesList.find((ex) => ex.id === exerciseId) : null;
            const isCompleted = completedExercises.includes(exercise);

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex items-center justify-between"
                style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards` }}
              >
                <div className="flex items-center space-x-4">
                  {exerciseDetails && (
                    <img
                      src={exerciseDetails.image || '/fallback-exercise-image.jpg'}
                      alt={exercise}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.target.src = '/fallback-exercise-image.jpg')}
                      aria-label={`Image of ${exercise}`}
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-semibold">{exercise}</h3>
                    {exerciseDetails && (
                      <p className="text-xs text-gray-600">
                        {exerciseDetails.muscle} • {exerciseDetails.equipment}
                      </p>
                    )}
                    {exerciseId ? (
                      <Link
                        to={`/exercise/${exerciseId}`}
                        className="text-blue-600 text-xs hover:underline"
                        aria-label={`View details for ${exercise}`}
                      >
                        View Details
                      </Link>
                    ) : (
                      <p className="text-xs text-gray-500">Details not available</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleExerciseCompletion(exercise)}
                  className={`p-2 rounded-full ${
                    isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                  aria-label={isCompleted ? `Mark ${exercise} as incomplete` : `Mark ${exercise} as complete`}
                >
                  <FaCheckCircle className="text-sm" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default WorkoutSession;