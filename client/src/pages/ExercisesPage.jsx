import Exercises from '../components/Exercises';

const ExercisesPage = () => {
  return (
    <div>
      <div className="py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Exercise Library</h1>
          {/* <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Discover a comprehensive collection of exercises to help you achieve your fitness goals. 
            Filter by body part or search for specific exercises.
          </p> */}
        </div>
      </div>
      <Exercises />
    </div>
  );
};

export default ExercisesPage;