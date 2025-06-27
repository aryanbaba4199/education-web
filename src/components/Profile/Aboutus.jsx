import React,{useEffect} from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap,
  FaMapMarkerAlt,
  FaHandHoldingHeart,
  // FaUsers,
  // FaStar,      // not used in this component
  FaUserFriends
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import TestimonialSlider from './TestimonialSlider';
import HandleUser from '../user/HandleUser'
import Footer from './Footer';

const AboutUs = () => {
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 md:py-28 text-center px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FaGraduationCap className="text-6xl md:text-7xl mx-auto mb-6 text-orange-500 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              About Stand Alone App
            </h1>
            <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              We are dedicated to simplifying the college selection, travel planning, and admission process for students worldwide.
            </p>
            <Link
              to='/get-started'
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-6 py-3 rounded-full transition-transform transform hover:scale-105"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* <HandleUser /> */}
      {/* // not working and rerendering to the home page */}
       

      {/* Organization Summary */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">What We Do</h2>
            <p className="text-gray-700 text-lg">
              Our platform bridges the gap between students and their dream colleges by providing real-time travel routes, deep college insights, and personalized admission guidance — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg">
              To empower students with comprehensive college information, personalized travel guidance, and seamless admission support, making higher education accessible and stress-free.
            </p>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 text-lg">
              To be the global go-to platform for students, bridging the gap between their educational aspirations and achievements with innovative tools and dedicated support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-100 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
            Why Choose Stand Alone App?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <FaMapMarkerAlt className="text-4xl text-orange-500" />,
                title: 'Real-Time Travel Routes',
                desc: 'Plan your journey with detailed travel options (plane, train, bus) from your location to your chosen college.'
              },
              {
                icon: <FaGraduationCap className="text-4xl text-blue-900" />,
                title: 'Comprehensive College Insights',
                desc: 'Explore detailed information on academics, faculty, courses, fees, and more for top colleges.'
              },
              {
                icon: <FaHandHoldingHeart className="text-4xl text-orange-500" />,
                title: 'Personalized Admission Support',
                desc: 'Get step-by-step guidance to navigate the admission process with confidence and ease.'
              }
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex space-x-4 items-start"
                whileHover={{ scale: 1.02 }}
              >
                {icon}
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Section: Our Values */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Core Values</h2>
            <p className="text-gray-700 text-lg mb-4">
              Transparency. Innovation. Student-first. Collaboration.
            </p>
            <p className="text-gray-600">
              Every decision we make is guided by our commitment to empower students with honesty, creativity, and a relentless focus on their success.
            </p>
          </motion.div>
        </div>
      </section>

       {/* Team Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gray-100 rounded-lg shadow-md p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
              <FaUserFriends className="text-4xl sm:text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                Sarah K.
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Education Consultant
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-md p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
              <FaUserFriends className="text-4xl sm:text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                Rohan P.
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Travel Planner
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg shadow-md p-6 text-center transform hover:-translate-y-2 transition-transform duration-300">
              <FaUserFriends className="text-4xl sm:text-5xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                Anika R.
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Admission Specialist
              </p>
            </div>
          </div>
        </div>
      </section>

    
            {/* Testimonial Slider */}
      <TestimonialSlider/>

      {/* CTA Footer */}

    <Footer />
    </div>
  );
};

export default AboutUs;
