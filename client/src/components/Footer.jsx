import { FaDumbbell } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center transform translate-y-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
          <div className="flex items-center space-x-2 mb-6">
            <FaDumbbell className="text-primary text-3xl" />
            <span className="text-2xl font-bold">Fitness Hub</span>
          </div>
          <p className="text-gray-400 text-center">
            Made with ❤️ for fitness enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;