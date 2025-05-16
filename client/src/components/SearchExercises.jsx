import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState('');
  const [bodyParts] = useState([
    'all', 'back', 'cardio', 'chest', 'lower arms', 
    'lower legs', 'neck', 'shoulders', 'upper arms', 
    'upper legs', 'waist'
  ]);

  const handleSearch = async () => {
    if (search) {
      // Mock exercise data for demonstration
      const mockExercises = [
        {
          id: '1',
          name: 'bench press',
          target: 'chest',
          bodyPart: 'chest',
          gifUrl: 'https://v2.exercisedb.io/image/7j3hbXxz9WrRQL',
          equipment: 'barbell'
        },
        {
          id: '2',
          name: 'deadlift',
          target: 'back',
          bodyPart: 'back',
          gifUrl: 'https://v2.exercisedb.io/image/7j3hbXxz9WrRQL',
          equipment: 'barbell'
        }
      ];
      
      const searchedExercises = mockExercises.filter(
        (exercise) => 
          exercise.name.toLowerCase().includes(search.toLowerCase()) ||
          exercise.target.toLowerCase().includes(search.toLowerCase()) ||
          exercise.equipment.toLowerCase().includes(search.toLowerCase()) ||
          exercise.bodyPart.toLowerCase().includes(search.toLowerCase())
      );

      setSearch('');
      setExercises(searchedExercises);
    }
  };

  return (
    <div className="mt-16 container mx-auto px-4">
      <div className="text-center mb-12 transform translate-y-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
        <h2 className="text-4xl font-bold mb-4">
          Awesome Exercises You <br /> Should Know
        </h2>
        <div className="flex justify-center mt-8">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Exercises"
              className="w-full px-6 py-4 rounded-full border-2 border-gray-300 focus:outline-none focus:border-primary transition-colors duration-300"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-4 rounded-full hover:bg-red-600 transition-colors duration-300"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center mb-16">
        {bodyParts.map((part) => (
          <button
            key={part}
            onClick={() => setBodyPart(part)}
            className={`px-6 py-3 rounded-full capitalize transition-all duration-300 hover:scale-105 ${
              bodyPart === part ? 'bg-primary text-white' : 'bg-white hover:bg-primary hover:text-white'
            }`}
          >
            {part}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchExercises;