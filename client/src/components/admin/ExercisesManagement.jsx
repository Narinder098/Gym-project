import { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ExercisesManagement = () => {
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: 'Bench Press',
      category: 'Strength',
      difficulty: 'Intermediate',
      target: 'Chest',
      instructions: ['Lie on bench', 'Grip barbell', 'Lower to chest', 'Press up']
    },
    {
      id: 2,
      name: 'Squats',
      category: 'Strength',
      difficulty: 'Beginner',
      target: 'Legs',
      instructions: ['Stand with feet shoulder-width', 'Lower body', 'Keep back straight', 'Return to start']
    }
  ]);

  const [newExercise, setNewExercise] = useState({
    name: '',
    category: '',
    difficulty: '',
    target: '',
    instructions: []
  });

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (newExercise.name && newExercise.category) {
      setExercises([
        ...exercises,
        {
          id: exercises.length + 1,
          ...newExercise
        }
      ]);
      setNewExercise({
        name: '',
        category: '',
        difficulty: '',
        target: '',
        instructions: []
      });
      toast.success('Exercise added successfully');
    }
  };

  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter(exercise => exercise.id !== id));
    toast.success('Exercise deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exercises Management</h1>
        <button
          onClick={() => document.getElementById('addExerciseForm').scrollIntoView({ behavior: 'smooth' })}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Add Exercise
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map(exercise => (
          <div
            key={exercise.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">Category: {exercise.category}</p>
                  <p className="text-sm text-gray-600">Difficulty: {exercise.difficulty}</p>
                  <p className="text-sm text-gray-600">Target: {exercise.target}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <ol className="list-decimal list-inside text-sm text-gray-600">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form id="addExerciseForm" onSubmit={handleAddExercise} className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Add New Exercise</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Exercise Name"
            value={newExercise.name}
            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newExercise.category}
            onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Difficulty"
            value={newExercise.difficulty}
            onChange={(e) => setNewExercise({ ...newExercise, difficulty: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Target Muscle"
            value={newExercise.target}
            onChange={(e) => setNewExercise({ ...newExercise, target: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Add Exercise
        </button>
      </form>
    </div>
  );
};

export default ExercisesManagement;