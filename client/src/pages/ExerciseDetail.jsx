import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Rings } from 'react-loader-spinner';

const ExerciseDetail = () => {
  const { id } = useParams();
  const [exerciseDetail, setExerciseDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseDetail = async () => {
      // Mock data for demonstration
      const mockExercise = {
        id: '1',
        name: 'bench press',
        target: 'chest',
        bodyPart: 'chest',
        gifUrl: 'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=800',
        equipment: 'barbell',
        instructions: [
          'Lie on a flat bench with your feet flat on the ground',
          'Grip the barbell slightly wider than shoulder-width',
          'Lower the bar to your chest in a controlled manner',
          'Press the bar back up to the starting position'
        ],
        routine: {
          beginner: {
            sets: 3,
            reps: '8-10',
            rest: '90 seconds',
            days: ['Monday', 'Thursday']
          },
          intermediate: {
            sets: 4,
            reps: '10-12',
            rest: '60 seconds',
            days: ['Monday', 'Thursday', 'Saturday']
          },
          advanced: {
            sets: 5,
            reps: '12-15',
            rest: '45 seconds',
            days: ['Monday', 'Wednesday', 'Friday', 'Saturday']
          }
        },
        timing: {
          warmup: '5-10 minutes',
          execution: '30-45 minutes',
          cooldown: '5-10 minutes'
        },
        bestTimeToPerform: 'Morning or Evening',
        tips: [
          'Keep your back flat against the bench',
          'Maintain controlled breathing throughout',
          'Focus on form over weight',
          'Always have a spotter for heavy lifts'
        ]
      };

      setTimeout(() => {
        setExerciseDetail(mockExercise);
        setLoading(false);
      }, 1000);
    };

    fetchExerciseDetail();
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
        />
        <p className="mt-4 text-lg text-gray-600">Loading exercise details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="transform translate-y-4 opacity-0 animate-[fadeInLeft_0.6s_ease-out_forwards]">
          <img 
            src={exerciseDetail.gifUrl} 
            alt={exerciseDetail.name} 
            className="w-full rounded-lg shadow-xl"
          />
        </div>
        <div className="transform translate-x-4 opacity-0 animate-[fadeInRight_0.6s_ease-out_forwards]">
          <h2 className="text-4xl font-bold mb-6 capitalize">{exerciseDetail.name}</h2>
          <p className="text-lg mb-6">
            Exercises keep you strong. {exerciseDetail.name} is one of the best exercises
            to target your {exerciseDetail.target}. It will help you improve your mood
            and gain energy.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full">
              {exerciseDetail.bodyPart}
            </span>
            <span className="bg-secondary/10 text-secondary px-4 py-2 rounded-full">
              {exerciseDetail.target}
            </span>
            <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full">
              {exerciseDetail.equipment}
            </span>
          </div>

          <div className="space-y-8">
            {/* Routine Section */}
            <div className="bg-white rounded-lg p-6 shadow-md transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Recommended Routines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(exerciseDetail.routine).map(([level, details]) => (
                  <div key={level} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold capitalize mb-2">{level}</h4>
                    <ul className="space-y-2 text-gray-600">
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
            <div className="bg-white rounded-lg p-6 shadow-md transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4">Timing Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Warm-up</h4>
                  <p className="text-gray-600">{exerciseDetail.timing.warmup}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Main Exercise</h4>
                  <p className="text-gray-600">{exerciseDetail.timing.execution}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Cool-down</h4>
                  <p className="text-gray-600">{exerciseDetail.timing.cooldown}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                <span className="font-semibold">Best Time to Perform:</span> {exerciseDetail.bestTimeToPerform}
              </p>
            </div>

            {/* Instructions Section */}
            <div className="bg-white rounded-lg p-6 shadow-md transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-4">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2">
                {exerciseDetail.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-700">{instruction}</li>
                ))}
              </ol>
            </div>

            {/* Tips Section */}
            <div className="bg-white rounded-lg p-6 shadow-md transform hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-4">Pro Tips</h3>
              <ul className="space-y-2">
                {exerciseDetail.tips.map((tip, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetail;