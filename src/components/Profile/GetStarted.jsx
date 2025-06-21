import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const GetStarted = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-6">
          Welcome to StandAlone App
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Empowering students and professionals with smart tools, personalized recommendations, and a seamless experience to plan your academic journey. Let’s get started!
        </p>

        {/* Feature Highlights */}
        <div className="grid gap-6 sm:grid-cols-2 text-left max-w-2xl mx-auto mb-12">
          <div className="flex items-start space-x-3">
            <FaCheckCircle className="text-blue-600 text-xl mt-1" />
            <span className="text-gray-800">Create your profile to get personalized suggestions</span>
          </div>
          <div className="flex items-start space-x-3">
            <FaCheckCircle className="text-blue-600 text-xl mt-1" />
            <span className="text-gray-800">Track college deadlines and get real-time updates</span>
          </div>
          <div className="flex items-start space-x-3">
            <FaCheckCircle className="text-blue-600 text-xl mt-1" />
            <span className="text-gray-800">Smart search tools and travel estimators built-in</span>
          </div>
          <div className="flex items-start space-x-3">
            <FaCheckCircle className="text-blue-600 text-xl mt-1" />
            <span className="text-gray-800">Connect with mentors and community support</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/signup"
            className="bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-blue-800 transition"
          >
            Create an Account
          </Link>

          <Link
            to="/learn-more"
            className="inline-flex items-center text-blue-700 font-semibold text-lg hover:underline"
          >
            Learn More <FaArrowRight className="ml-2 mt-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
