import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rings } from 'react-loader-spinner';

// Static exercise data (same as in Exercises.jsx)
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

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const exercise = exercisesList.find((ex) => ex.id === id);
      if (exercise) {
        setExerciseDetail({
          ...exercise,
          // Fallback fields to maintain UI consistency
          instructions: ['Detailed instructions not available'],
          routine: {
            beginner: { sets: 3, reps: '8-10', rest: '60 seconds', days: ['Monday', 'Wednesday', 'Friday'] },
            intermediate: { sets: 4, reps: '10-12', rest: '45 seconds', days: ['Monday', 'Wednesday', 'Friday', 'Saturday'] },
            advanced: { sets: 5, reps: '12-15', rest: '30 seconds', days: ['Monday', 'Tuesday', 'Thursday', 'Friday'] },
          },
          timing: {
            warmup: '5 minutes',
            execution: '20-30 minutes',
            cooldown: '5 minutes',
          },
          bestTimeToPerform: 'Anytime',
          tips: ['Focus on proper form', 'Consult a trainer for detailed guidance'],
        });
      } else {
        setError('Exercise not found');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load exercise details');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Rings
          height="80"
          width="80"
          color="#ff2625"
          radius="6"
          visible={true}
          ariaLabel="Loading exercise details"
        />
        <p className="mt-4 text-sm text-gray-600">Loading exercise details...</p>
      </div>
    );
  }

  if (error || !exerciseDetail) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Exercise Not Found</h1>
        <p className="mt-4 text-sm text-gray-600">{error || 'The exercise you’re looking for doesn’t exist.'}</p>
        <button
          className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          onClick={() => window.location.href = '/'}
          aria-label="Go back to exercises"
        >
          Back to Exercises
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div
          className="transform translate-y-4 opacity-0"
          style={{ animation: 'fadeInLeft 0.6s ease-out forwards' }}
        >
          <img
            src={exerciseDetail.image || '/fallback-exercise-image.jpg'}
            alt={exerciseDetail.name}
            className="w-full h-64 object-cover rounded-lg shadow-md"
            onError={(e) => (e.target.src = '/fallback-exercise-image.jpg')}
            aria-label={`Image of ${exerciseDetail.name} exercise`}
          />
        </div>

        {/* Details Section */}
        <div
          className="transform translate-x-4 opacity-0"
          style={{ animation: 'fadeInRight 0.6s ease-out forwards' }}
        >
          <h2 className="text-2xl font-bold mb-4 capitalize">{exerciseDetail.name}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {exerciseDetail.name} is an effective exercise to target your {exerciseDetail.muscle.toLowerCase()}. It helps improve strength and endurance.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {exerciseDetail.category.charAt(0).toUpperCase() + exerciseDetail.category.slice(1)}
            </span>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
              {exerciseDetail.muscle}
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {exerciseDetail.equipment}
            </span>
          </div>

          {/* Routine Section */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">Recommended Routines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(exerciseDetail.routine).map(([level, details], index) => (
                <div
                  key={level}
                  className="bg-gray-50 p-3 rounded-lg"
                  style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards` }}
                >
                  <h4 className="text-sm font-semibold capitalize mb-1">{level}</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>Sets: {details.sets}</li>
                    <li>Reps: {details.reps}</li>
                    <li>Rest: {details.rest}</li>
                    <li>Days: {details.days.join(', ')}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Timing Section */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">Timing Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg" style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
                <h4 className="text-sm font-semibold mb-1">Warm-up</h4>
                <p className="text-gray-600 text-sm">{exerciseDetail.timing.warmup}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg" style={{ animation: 'fadeInUp 0.5s ease-out 0.1s forwards' }}>
                <h4 className="text-sm font-semibold mb-1">Main Exercise</h4>
                <p className="text-gray-600 text-sm">{exerciseDetail.timing.execution}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg" style={{ animation: 'fadeInUp 0.5s ease-out 0.2s forwards' }}>
                <h4 className="text-sm font-semibold mb-1">Cool-down</h4>
                <p className="text-gray-600 text-sm">{exerciseDetail.timing.cooldown}</p>
              </div>
            </div>
            <p className="mt-2 text-gray-600 text-sm">
              <span className="font-semibold">Best Time to Perform:</span> {exerciseDetail.bestTimeToPerform}
            </p>
          </div>

          {/* Instructions Section */}
          <div className="bg-white rounded-lg p-4 shadow-md mb-6 border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 text-sm">
              {exerciseDetail.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-2">Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
              {exerciseDetail.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;