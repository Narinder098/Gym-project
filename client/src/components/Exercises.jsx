import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const mockExercises = [
  {
    id: '1',
    name: 'Bench Press',
    target: 'chest',
    bodyPart: 'chest',
    gifUrl: 'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'barbell'
  },
  {
    id: '2',
    name: 'Deadlift',
    target: 'back',
    bodyPart: 'back',
    gifUrl: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'barbell'
  },
  {
    id: '3',
    name: 'Squats',
    target: 'legs',
    bodyPart: 'lower legs',
    gifUrl: 'https://images.pexels.com/photos/4608152/pexels-photo-4608152.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'barbell'
  },
  {
    id: '4',
    name: 'Bicep Curls',
    target: 'biceps',
    bodyPart: 'upper arms',
    gifUrl: 'https://images.pexels.com/photos/3838389/pexels-photo-3838389.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'dumbbell'
  },
  {
    id: '5',
    name: 'Tricep Extensions',
    target: 'triceps',
    bodyPart: 'upper arms',
    gifUrl: 'https://images.pexels.com/photos/4162485/pexels-photo-4162485.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'cable'
  },
  {
    id: '6',
    name: 'Military Press',
    target: 'shoulders',
    bodyPart: 'shoulders',
    gifUrl: 'https://images.pexels.com/photos/3837781/pexels-photo-3837781.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'barbell'
  },
  {
    id: '7',
    name: 'Treadmill Running',
    target: 'cardiovascular system',
    bodyPart: 'cardio',
    gifUrl: 'https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'treadmill'
  },
  {
    id: '8',
    name: 'Lat Pulldowns',
    target: 'lats',
    bodyPart: 'back',
    gifUrl: 'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'cable'
  },
  {
    id: '9',
    name: 'Dumbbell Rows',
    target: 'back',
    bodyPart: 'back',
    gifUrl: 'https://images.pexels.com/photos/3837743/pexels-photo-3837743.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'dumbbell'
  },
  {
    id: '10',
    name: 'Leg Press',
    target: 'quads',
    bodyPart: 'lower legs',
    gifUrl: 'https://images.pexels.com/photos/4162438/pexels-photo-4162438.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'machine'
  },
  {
    id: '11',
    name: 'Hammer Curls',
    target: 'biceps',
    bodyPart: 'upper arms',
    gifUrl: 'https://images.pexels.com/photos/3838285/pexels-photo-3838285.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'dumbbell'
  },
  {
    id: '12',
    name: 'Chest Flyes',
    target: 'chest',
    bodyPart: 'chest',
    gifUrl: 'https://images.pexels.com/photos/3838937/pexels-photo-3838937.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'dumbbell'
  },
  {
    id: '13',
    name: 'Shoulder Press',
    target: 'deltoids',
    bodyPart: 'shoulders',
    gifUrl: 'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'dumbbell'
  },
  {
    id: '14',
    name: 'Wrist Curls',
    target: 'forearms',
    bodyPart: 'lower arms',
    gifUrl: 'https://images.pexels.com/photos/3838386/pexels-photo-3838386.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'dumbbell'
  },
  {
    id: '15',
    name: 'Neck Flexion',
    target: 'neck',
    bodyPart: 'neck',
    gifUrl: 'https://images.pexels.com/photos/4162456/pexels-photo-4162456.jpeg?auto=compress&cs=tinysrgb&w=800',
    equipment: 'bodyweight'
  }
];

const bodyPartList = [
  'all',
  'back',
  'cardio',
  'chest',
  'lower arms',
  'lower legs',
  'neck',
  'shoulders',
  'upper arms'
];

const Exercises = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.bodyPart.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBodyPart = selectedBodyPart === 'all' || exercise.bodyPart === selectedBodyPart;
    
    return matchesSearch && matchesBodyPart;
  });

  return (
    <div id="exercises" className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-primary transition-colors duration-300"
            />
            <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-12">
        {bodyPartList.map((part) => (
          <button
            key={part}
            onClick={() => setSelectedBodyPart(part)}
            className={`px-6 py-3 rounded-full capitalize transition-all duration-300 hover:scale-105 ${
              selectedBodyPart === part
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-primary hover:text-white'
            }`}
          >
            {part}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExercises.map((exercise, index) => (
          <div 
            key={exercise.id}
            className="transform translate-y-4 opacity-0 hover:-translate-y-2 transition-all duration-300"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
            }}
          >
            <Link 
              to={`/exercise/${exercise.id}`} 
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name} 
                  loading="lazy" 
                  className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h4 className="text-xl font-semibold capitalize text-white">{exercise.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-primary/90 text-white px-3 py-1 rounded-full text-sm">
                      {exercise.bodyPart}
                    </span>
                    <span className="bg-secondary/90 text-white px-3 py-1 rounded-full text-sm">
                      {exercise.target}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center text-gray-600 mt-8">
          No exercises found for this search or body part.
        </div>
      )}
    </div>
  );
};

export default Exercises;