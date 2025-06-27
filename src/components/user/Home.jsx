import React from "react";
// import React, { useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";
import Profile from "../Profile/Profile";
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
// import AboutUs from "../Profile/Aboutus";

import HandleUser from "./HandleUser";
import Footer from "../Profile/Footer";
// import { collegeApi, getterFunction, posterFunction, userApi } from "../../Api"; // Adjust path as needed

const Home = () => {
 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* <AboutUs/> */}
       <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Discover the Smart Way to <span className="text-teal-300">Plan Education</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 max-w-xl">
            Personalized tools, real insights, and guidance to help students make smarter college decisions. One platform, endless possibilities.
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg text-base transition-transform duration-300 hover:scale-105 shadow-lg"
          >
            Get Started <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {/* Image or Illustration Placeholder */}
        <div className="flex-1 flex justify-center">
          <img
            src="./heroHome.svg" // Replace with your image
            alt="Education Planning"
            className="w-full max-w-md animate-fade-in"
          />
        </div>
      </div>
    </section>
      <HandleUser/>
      <Profile/>
      <HandleUser/>
      <Footer />
    </div>
  );
};

export default Home;
