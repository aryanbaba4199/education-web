<<<<<<< HEAD
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
              to="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold px-6 py-3 rounded-full transition-transform transform hover:scale-105"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

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
=======
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaMapMarkerAlt, FaHandHoldingHeart, FaUsers, FaStar, FaUserFriends } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 sm:py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaGraduationCap className="text-6xl sm:text-7xl mx-auto mb-6 text-orange-500 animate-bounce" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
            About Stand Alone App
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            We are dedicated to simplifying the college selection, travel planning, and admission process for students worldwide.
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-full transition duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {/* Mission */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl text-blue-900 font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
                To empower students with comprehensive college information, personalized travel guidance, and seamless admission support, making higher education accessible and stress-free.
              </p>
            </div>
            {/* Vision */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl text-blue-900 font-bold mb-6">
                Our Vision
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
                To be the global go-to platform for students, bridging the gap between their educational aspirations and achievements with innovative tools and dedicated support.
              </p>
            </div>
>>>>>>> 10acf22f2f78571a107ea624cf9336af654eb0fe
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold text-center mb-12">
            Why Choose Stand Alone App?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <FaMapMarkerAlt className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                  Real-Time Travel Routes
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Plan your journey with detailed travel options (plane, train, bus) from your location to your chosen college.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <FaGraduationCap className="text-3xl sm:text-4xl text-blue-900 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                  Comprehensive College Insights
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Explore detailed information on academics, faculty, courses, fees, and more for top colleges.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <FaHandHoldingHeart className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                  Personalized Admission Support
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Get step-by-step guidance to navigate the admission process with confidence and ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
>>>>>>> 10acf22f2f78571a107ea624cf9336af654eb0fe
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

<<<<<<< HEAD
    
            {/* Testimonial Slider */}
      <TestimonialSlider/>

      {/* CTA Footer */}

=======
      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg sm:text-xl" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 italic mb-4">
                "Stand Alone App transformed my college search with detailed insights and amazing travel planning tools!"
              </p>
              <h4 className="text-base sm:text-lg text-blue-900 font-semibold">
                Priya S., Student
              </h4>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg sm:text-xl" />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 italic mb-4">
                "The personalized admission support made my journey to my dream college so smooth!"
              </p>
              <h4 className="text-base sm:text-lg text-blue-900 font-semibold">
                Arjun M., Student
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
>>>>>>> 10acf22f2f78571a107ea624cf9336af654eb0fe
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Join Stand Alone App Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Start your journey to your dream college with our comprehensive tools and dedicated support.
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-full transition duration-300 transform hover:scale-105"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </div>
  );
};

<<<<<<< HEAD
export default AboutUs;
=======
export default AboutUs;
>>>>>>> 10acf22f2f78571a107ea624cf9336af654eb0fe
