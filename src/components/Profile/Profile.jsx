import React from 'react';
import { Container, Typography, Box} from '@mui/material';
import { FaGraduationCap} from 'react-icons/fa';
import { motion } from 'framer-motion';
import TestimonialSlider from './TestimonialSlider';


const Profile = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
       <Box className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-20 sm:py-28 overflow-hidden">
      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-700/80 z-0" />

      <Container maxWidth="lg" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4 flex-col flex justify-center items-center gap-6"
        >
          <Typography
            variant="h1"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md"
          >
            Stand Alone App
          </Typography>

          <Typography
            variant="h5"
            className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            Discover top colleges, plan your journey, and secure your admission with personalized guidance.
          </Typography>
        </motion.div>
      </Container>
    </Box>   
      {/* Mission Statement */}
      <Container maxWidth="lg" className="py-12 sm:py-16 px-4">
        <div className="text-center w-full flex flex-col justify-center items-center mb-12">
          <FaGraduationCap className="text-5xl sm:text-6xl text-orange-500 mx-auto mb-4" />
          <Typography
            variant="h3"
            className="text-2xl sm:text-3xl md:text-4xl text-blue-900 font-bold mb-4"
          >
            Our Mission
          </Typography>
          <Typography
            variant="body1"
            className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto"
          >
            At Stand Alone App, we empower students with detailed college insights, real-time travel routes, and dedicated admission support to make informed decisions.
          </Typography>
        </div>
      </Container>

      {/* Services Section */}
     <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-8">Why Choose Stand Alone App?</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="text-left px-6 py-4 text-lg">Feature</th>
                <th className="text-center px-6 py-4 text-lg">Stand Alone App</th>
                <th className="text-center px-6 py-4 text-lg">Others</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-base">
              {[
                ['Personalized Guidance', '✅', '❌'],
                ['Travel Planning', '✅', '❌'],
                ['Verified College Info', '✅', '⚠️'],
                ['Colleges with Proven Placement Success', '✅', '❌'],
                ['Scholarship Opportunities', '✅', '❌'],
                ['Personalized Solutions', '✅', '❌'],
              ].map(([feature, app, other], idx) => (
                <tr
                  key={feature}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 font-medium">{feature}</td>
                  <td className="px-6 py-4 text-center text-green-600 font-semibold">{app}</td>
                  <td className="px-6 py-4 text-center text-red-500 font-semibold">{other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
      {/* Testimonials Section */}
      <TestimonialSlider />

      {/* CTA Footer */}
      <Box className="bg-blue-900 text-white py-12 sm:py-16">
        <Container maxWidth="lg" className="px-4">
          <div className="text-center flex justify-center items-center flex-col">
            <Typography
              variant="h3"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              Ready to Find Your Dream College?
            </Typography>
            <Typography
              variant="h6"
              className="text-base sm:text-lg text-gray-200 mb-8 max-w-2xl mx-auto"
            >
              Join thousands of students who trust Stand Alone App for their college journey.
            </Typography>
           
          </div>
        </Container>
      </Box>
    </div>
  );
};

export default Profile;