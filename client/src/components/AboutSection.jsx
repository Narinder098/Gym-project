import { motion } from 'framer-motion';
import { FaDumbbell, FaUsers, FaStar, FaRunning } from 'react-icons/fa';

const AboutSection = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission */}
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Fitness Hub</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fitness Hub is your ultimate destination for a healthier, stronger you. Founded with a passion for fitness, we provide a welcoming environment where everyone, from beginners to athletes, can thrive. Our mission is to inspire and empower you to reach your fitness goals through top-notch facilities, expert guidance, and a supportive community.
          </p>
        </motion.div>

        {/* Facilities */}
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                <FaDumbbell className="text-blue-600 mr-2" /> State-of-the-Art Facilities
              </h3>
              <p className="text-gray-600">
                Our gym is equipped with the latest fitness technology, including advanced cardio machines, a wide range of free weights, and dedicated spaces for functional training and stretching.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1601420053934-7c07c5dcb481?auto=format&fit=crop&w=1470&q=80"
              alt="Gym facilities"
              className="md:w-1/2 h-64 object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* Trainers */}
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <div className="flex flex-col md:flex-row-reverse items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                <FaStar className="text-blue-600 mr-2" /> Expert Trainers
              </h3>
              <p className="text-gray-600">
                Our certified trainers are here to guide you every step of the way. With expertise in strength training, nutrition, and recovery, they offer personalized plans and group sessions.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1470&q=80"
              alt="Trainers"
              className="md:w-1/2 h-64 object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* Classes */}
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                <FaRunning className="text-blue-600 mr-2" /> Dynamic Classes
              </h3>
              <p className="text-gray-600">
                From yoga and Pilates to HIIT and spin classes, our diverse schedule caters to all fitness levels. Join our energetic group sessions to stay engaged and have fun.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1583454110551-e6c08c1dc6c6?auto=format&fit=crop&w=1470&q=80"
              alt="Classes"
              className="md:w-1/2 h-64 object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* Community */}
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <div className="flex flex-col md:flex-row-reverse items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                <FaUsers className="text-blue-600 mr-2" /> Our Community
              </h3>
              <p className="text-gray-600">
                At Fitness Hub, you’re part of a family. Our members connect through workouts, fitness challenges, and events. Whether you’re celebrating or struggling, we’re here for you.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1594737625785-c55d34b4a3fa?auto=format&fit=crop&w=1470&q=80"
              alt="Community"
              className="md:w-1/2 h-64 object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                <FaStar className="text-yellow-500 mr-2" /> Transformations That Inspire
              </h3>
              <p className="text-gray-600">
                Meet the people who turned goals into results. From weight loss to strength building, their stories show what's possible with commitment and support.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1583454110551-21b575db0a3b?auto=format&fit=crop&w=1470&q=80"
              alt="Success Story"
              className="md:w-1/2 h-64 object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* Wellness */}
        <motion.div className="mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <div className="flex flex-col md:flex-row-reverse items-center gap-6">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                <FaUsers className="text-green-600 mr-2" /> Wellness Beyond Fitness
              </h3>
              <p className="text-gray-600">
                We promote holistic well-being. From mental health workshops to eco-conscious practices, Fitness Hub goes beyond workouts to support your lifestyle.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1588776814546-b9227e53a614?auto=format&fit=crop&w=1470&q=80"
              alt="Wellness"
              className="md:w-1/2 h-64 object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* Divider */}
        <hr className="my-12 border-t border-gray-300 w-1/2 mx-auto" />

        {/* Call to Action */}
        <motion.div className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
          >
            Join Now
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;
