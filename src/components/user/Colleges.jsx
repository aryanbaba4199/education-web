import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaWhatsapp, FaSchool, FaSearch, FaArrowRight } from 'react-icons/fa';
import { collegeApi, getterFunction } from '../../Api'; // Adjust path as needed

const College = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [slides, setSlides] = useState([]);
  const [fade, setFade] = useState(true); // Control fade effect
  const navigate = useNavigate();

  useEffect(() => {
    getColleges();
    getSlide();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setFade(false); // Start fade out
        setTimeout(() => {
          setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
          setFade(true); // Fade in new image
        }, 500); // Wait for fade out (0.5s) before changing image
      }, 3000); // Total cycle every 3 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [slides]);

  const getColleges = async () => {
    setRefreshing(true);
    try {
      const res = await getterFunction(collegeApi.getColleges);
      if (res.success) {
        setColleges(res.data);
      }
    } catch (e) {
      console.error('Error getting colleges:', e);
    }
    setRefreshing(false);
  };

  const getSlide = async () => {
    try {
      const res = await getterFunction(collegeApi.getSlide);
      if (res.success) {
        const sortedSlides = res.data.sort((a, b) => a.rank - b.rank);
        setSlides(sortedSlides);
      }
    } catch (e) {
      console.error('Error getting slide', e);
    }
  };

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.mainCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCall = () => {
    window.location.href = 'tel:+917005742790';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/+917005742790', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Slideshow Section */}
      <div className="h-1/4 bg-white shadow-md border-b border-gray-200 overflow-hidden">
        {slides.length > 0 ? (
          <img
            src={slides[currentSlideIndex].image}
            alt="Slide"
            className={`w-full h-[340px] object-cover transition-opacity duration-500 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <img
            src="https://i.pinimg.com/736x/70/42/f8/7042f811eba5fdd333382d89b9521cca.jpg"
            alt="Default"
            className="w-full h-[340px] object-cover rounded"
          />
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 flex">
        <div className="relative w-1/2 mx-auto">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search colleges by name or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div className='flex justify-center items-center bg-red-600 px-4 text-white hover:bg-red-700'>
          <button onClick={()=>{
            localStorage.removeItem('edutoken');
            localStorage.removeItem('eduadmintoken');
            navigate('/');
          }} className=' text-white px-4 py-1'>Log out</button>
          <FaArrowRight/>
        </div>
      </div>

      {/* College List */}
      <div className="flex-1 p-4">
        {refreshing ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredColleges.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/college-details?id=${item._id}`)}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <FaSchool className="text-teal-600 text-xl" />
                </div>
                <p className="text-gray-600">City: {item.mainCity}</p>
                <p className="text-gray-600">Location: {item.address}</p>
                <p className="text-gray-500">
                  {(parseInt(item.mainCityDistance) / 1000).toFixed(0)} KM from Main City
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advertiser Contact */}
      <div className="p-4 bg-white shadow-md border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <span className="text-gray-600 mb-2 sm:mb-0">+91-7005742790</span>
        <div className="flex gap-4">
          <button
            onClick={handleCall}
            className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 flex items-center"
          >
            <FaPhone className="mr-2" />
            Call
          </button>
          <button
            onClick={handleWhatsApp}
            className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 flex items-center"
          >
            <FaWhatsapp className="mr-2" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default College;