import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';

const testimonials = [
  {
    name: "Rahul Singh",
    feedback: "Joining Fitness Hub changed my life. I feel stronger, healthier, and more confident every day.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "Priya Kapoor",
    feedback: "The trainers are supportive and the environment is always positive. Highly recommended!",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Aman Verma",
    feedback: "This is the best gym I've ever been to. Clean, modern, and very professional staff.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
  },
];

const faqs = [
  {
    question: "What are the gym's working hours?",
    answer: "We’re open from 5:00 AM to 11:00 PM every day, including weekends.",
  },
  {
    question: "Do you offer personal training?",
    answer: "Yes! Our certified trainers provide one-on-one sessions tailored to your goals.",
  },
  {
    question: "Are there any free trials?",
    answer: "Absolutely! New members can enjoy a free 3-day trial before joining.",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Testimonials Header */}
        <motion.h2
          className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Our Members Say
        </motion.h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Real transformations, real stories. Hear from our members who have made fitness a lifestyle.
        </p>

        {/* Testimonials Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-blue-500"
              />
              <p className="text-gray-700 italic mb-3">“{t.feedback}”</p>
              <p className="font-semibold text-blue-600">{t.name}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="text-left max-w-4xl mx-auto">
          <motion.h3
            className="text-2xl font-bold mb-6 text-center text-gray-900 flex justify-center items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FaQuestionCircle className="text-blue-500" />
            Quick FAQs
          </motion.h3>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
