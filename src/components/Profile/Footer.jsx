import React from 'react'
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';


const Footer = () => {
  return (
    <>
    <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20 flex flex-col items-center text-center space-y-6">
    {/* Decorative background shapes */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-indigo-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>
    </div>

    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight z-10">
      Join <span className="text-orange-400">Stand Alone App</span> Today
    </h2>

    <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl z-10">
      Empower your academic journey with verified insights, personalized support, and all-in-one college planning — trusted by thousands of students nationwide.
    </p>

    <Link
      to="/get-started"
      className="z-10 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      Start Exploring
      <FaArrowRight className="mt-0.5" />
    </Link>

    {/* Optional trust section */}
    <div className="z-10 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-sm text-gray-200">
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-green-400" />
        100% Free to Get Started
      </div>
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-green-400" />
        No Hidden Charges
      </div>
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-green-400" />
        Trusted by 50,000+ Students
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default Footer
