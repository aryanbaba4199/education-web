import React from 'react';
import { Container, Typography, Box, Button, Card, CardContent, Grid } from '@mui/material';
import { FaInfoCircle, FaShieldAlt, FaUsers, FaGraduationCap, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <Box className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 sm:py-24">
        <Container maxWidth="lg">
          <div className="text-center px-4 flex-col flex justify-center items-center gap-4">
            <Typography
              variant="h1"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
            >
              Stand Alone App
            </Typography>
            <Typography
              variant="h5"
              className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            >
              Discover top colleges, plan your journey, and secure your admission with personalized guidance.
            </Typography>
          
          </div>
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
      <Box className="bg-white w-full py-12 sm:py-16">
        <div className="px-4 md:grid-cols-3 grid-cols-1 justify-between items-center w-full">
          <Typography
            variant="h3"
            className="text-2xl sm:text-3xl md:text-4xl text-blue-900 font-bold text-center mb-12"
          >
            Our Profile
          </Typography>
          <div className='grid md:grid-cols-2 grid-cols-1 justify-between items-center gap-4'>
            {/* About Us Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <CardContent className="text-center flex-grow">
                  <FaUsers className="text-4xl sm:text-5xl text-orange-500 mx-auto mb-4" />
                  <Typography
                    variant="h5"
                    className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2"
                  >
                    About Us
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4 text-sm sm:text-base">
                    Discover our commitment to guiding students toward their dream colleges with transparency and care.
                  </Typography>
                  <Button
                    component={Link}
                    to="/about-us"
                    variant="contained"
                    className="bg-orange-500 hover:bg-orange-600 text-white mt-auto"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Our Services Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <CardContent className="text-center flex-grow">
                  <FaInfoCircle className="text-4xl sm:text-5xl text-blue-900 mx-auto mb-4" />
                  <Typography
                    variant="h5"
                    className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2"
                  >
                    Our Services
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4 text-sm sm:text-base">
                    Explore colleges, get real-time travel routes, and receive tailored admission guidance.
                  </Typography>
                  
                </CardContent>
              </Card>
            </Grid>

            {/* Privacy Policy Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <CardContent className="text-center flex-grow">
                  <FaShieldAlt className="text-4xl sm:text-5xl text-orange-500 mx-auto mb-4" />
                  <Typography
                    variant="h5"
                    className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2"
                  >
                    Privacy & Policies
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4 text-sm sm:text-base">
                    Your trust is our priority. Learn how we safeguard your data with transparent policies.
                  </Typography>
                  <Button
                    component={Link}
                    to="/privacy-policy"
                    variant="contained"
                    className="bg-orange-500 hover:bg-orange-600 text-white mt-auto"
                  >
                    Read Policy
                  </Button>
                </CardContent>
              </Card>
            </Grid>
             <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <CardContent className="text-center flex-grow">
                  <FaShieldAlt className="text-4xl sm:text-5xl text-orange-500 mx-auto mb-4" />
                  <Typography
                    variant="h5"
                    className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2"
                  >
                    Terms & Condition
                  </Typography>
                  <Typography variant="body1" className="text-gray-600 mb-4 text-sm sm:text-base">
                    Your trust is our priority. Learn about our terms and condition.
                  </Typography>
                  <Button
                    component={Link}
                    to="/terms-and-condition"
                    variant="contained"
                    className="bg-orange-500 hover:bg-orange-600 text-white mt-auto"
                  >
                    Read Terms and Condition
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </div>
        </div>
      </Box>

      {/* Testimonials Section */}
      <Box className="bg-gray-100 py-12 flex flex-col flex-wrap justify-between items-center w-full sm:py-16">
        <div maxWidth="lg" className="px-4">
          <Typography
            variant="h3"
            className="text-2xl sm:text-3xl md:text-4xl text-blue-900 font-bold text-center mb-12"
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Card className="shadow-md h-full">
                <CardContent className="text-center">
                  <Box className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg sm:text-xl" />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    className="text-gray-600 italic mb-4 text-sm sm:text-base"
                  >
                    "Stand Alone App simplified my college search! The travel routes and admission guidance were incredibly helpful."
                  </Typography>
                  <Typography
                    variant="h6"
                    className="text-blue-900 font-semibold text-base sm:text-lg"
                  >
                    Priya S., Student
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className="shadow-md h-full">
                <CardContent className="text-center">
                  <Box className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-lg sm:text-xl" />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    className="text-gray-600 italic mb-4 text-sm sm:text-base"
                  >
                    "The detailed college insights and personalized support made my admission process seamless!"
                  </Typography>
                  <Typography
                    variant="h6"
                    className="text-blue-900 font-semibold text-base sm:text-lg"
                  >
                    Arjun M., Student
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Box>

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