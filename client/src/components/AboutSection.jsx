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
        {/* Intro */}
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Fitness Hub</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Fitness Hub is your ultimate destination for a healthier, stronger you. Our mission is to inspire and empower everyone—from beginners to athletes—through cutting-edge equipment, expert guidance, and a vibrant community.
          </p>
        </motion.div>

        {/* Section Items */}
        {[
          {
            title: "State-of-the-Art Facilities",
            icon: <FaDumbbell className="text-blue-600 mr-2" />,
            description: "Our gym is equipped with advanced cardio machines, free weights, and dedicated areas for stretching and HIIT.",
            image: "https://th.bing.com/th/id/OIP.hOlcD1pOkAlqIakajAWegAHaE8?rs=1&pid=ImgDetMain&cb=idpwebpc2",
            reverse: false
          },
          {
            title: "Expert Trainers",
            icon: <FaStar className="text-blue-600 mr-2" />,
            description: "Certified trainers provide customized workout and nutrition plans tailored to your goals.",
            image: "https://tse4.mm.bing.net/th/id/OIP.FxqWAwJJa3vsjsvw8vO0LAHaE8?rs=1&pid=ImgDetMain&cb=idpwebpc2",
            reverse: true
          },
          {
            title: "Dynamic Classes",
            icon: <FaRunning className="text-blue-600 mr-2" />,
            description: "From yoga and Zumba to CrossFit and spinning, our group classes keep you motivated and energized.",
            image: "https://tse3.mm.bing.net/th/id/OIP.bBFl3U0LZ1qXz5DVXKv8oQHaEJ?rs=1&pid=ImgDetMain&cb=idpwebpc2",
            reverse: false
          },
          {
            title: "Our Community",
            icon: <FaUsers className="text-blue-600 mr-2" />,
            description: "We foster a positive, encouraging space where members lift each other up and celebrate progress together.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=1080&q=80",
            reverse: true
          },
          {
            title: "Transformations That Inspire",
            icon: <FaStar className="text-yellow-500 mr-2" />,
            description: "Real success stories showcase how determination, support, and training can change lives.",
            image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=compress&cs=tinysrgb&w=1080&q=80",
            reverse: false
          },
          {
            title: "Wellness Beyond Fitness",
            icon: <FaUsers className="text-green-600 mr-2" />,
            description: "From mental wellness workshops to lifestyle coaching, we support total well-being.",
            image: "https://tse1.mm.bing.net/th/id/OIP.Y_F8ncR5hhTxw4wGhN-x9gHaE8?rs=1&pid=ImgDetMain&cb=idpwebpc2",
            reverse: true
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className={`flex flex-col ${item.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6`}>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <img
                src={item.image}
                alt={item.title}
                className="md:w-1/2 h-64 object-cover rounded-lg shadow"
                loading="lazy"
              />
            </div>
          </motion.div>
        ))}

        {/* Divider */}
        <hr className="my-12 border-t border-gray-300 w-1/2 mx-auto" />

        {/* CTA */}
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
