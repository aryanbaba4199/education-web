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
          </div>
        </div>
      </section>

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

export default AboutUs;