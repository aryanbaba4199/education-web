import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaWhatsapp,
  FaSchool,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";
import { collegeApi, getterFunction } from "../../Api"; // Adjust path as needed

const College = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [colleges, setColleges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [slides, setSlides] = useState([]);
  const [fade, setFade] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Track overall loading state
  const [error, setError] = useState(null); // Track errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getColleges(),
          getSlide(),
          getCategories(),
          getTags(),
        ]);
      } catch (e) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
          setFade(true);
        }, 500);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  const getColleges = async () => {
    setRefreshing(true);
    try {
      const res = await getterFunction(collegeApi.getColleges);
      if (res.success) {
        setColleges(res.data || []);
      } else {
        throw new Error("Failed to fetch colleges");
      }
    } catch (e) {
      console.error("Error getting colleges:", e);
      setError("Error fetching colleges.");
    }
    setRefreshing(false);
  };

  const getSlide = async () => {
    try {
      const res = await getterFunction(collegeApi.getSlide);
      if (res.success) {
        const sortedSlides = (res.data || []).sort((a, b) => a.rank - b.rank);
        setSlides(sortedSlides);
      }
    } catch (e) {
      console.error("Error getting slide", e);
    }
  };

  const getCategories = async () => {
    try {
      const res = await getterFunction(collegeApi.getCategory);
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (e) {
      console.error("Error getting categories:", e);
      setError("Error fetching categories.");
    }
  };

  const getTags = async () => {
    try {
      const res = await getterFunction(collegeApi.getTag);
      if (res.success) {
        setTags(res.data || []);
      }
    } catch (e) {
      console.error("Error getting tags:", e);
      setError("Error fetching tags.");
    }
  };

  const filteredColleges = colleges.filter((college) => {
    if (!college) return false; // Skip invalid college entries
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true; // Show all if query is empty

    const collegeName = college.name?.toLowerCase() || "";
    const collegeLocation =
      college.location?.toLowerCase() || college.address?.toLowerCase() || "";
    const collegeCategory =
      categories
        .find((cat) => cat._id === college.category)
        ?.title?.toLowerCase() || "";
    const collegeTags = (college.selectedTags || [])
      .map((tagId) =>
        tags.find((tag) => tag._id === tagId)?.title?.toLowerCase()
      )
      .filter(Boolean)
      .join(" ");

    return (
      collegeName.includes(query) ||
      collegeLocation.includes(query) ||
      collegeCategory.includes(query) ||
      collegeTags.includes(query)
    );
  });

  const handleCall = () => {
    window.location.href = "tel:+917005742790";
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/+917005742790", "_blank");
  };

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center text-gray-600 p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Slideshow Section */}
      <div className="h-1/4 bg-white shadow-md border-b border-gray-200 overflow-hidden">
        {slides.length > 0 ? (
          <img
            src={slides[currentSlideIndex].image}
            alt="Slide"
            className={`w-full h-[340px] object-cover transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
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
            placeholder="Search by name, location, tags, or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div className="flex justify-center items-center bg-red-600 px-4 text-white hover:bg-red-700">
          <button
            onClick={() => {
              localStorage.removeItem("edutoken");
              localStorage.removeItem("eduadmintoken");
              navigate("/");
            }}
            className="text-white px-4 py-1"
          >
            Log out
          </button>
          <FaArrowRight />
        </div>
      </div>

      {/* College List */}
      <div className="flex-1 p-4">
        {refreshing ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredColleges.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/college-details?id=${item._id}`)}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
              >
                {item.images?.length > 0 && (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="mt-2 w-full h-32 object-cover rounded"
                  />
                )}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h3>
                  <FaSchool className="text-teal-600 text-xl" />
                </div>
                <p className="text-gray-600">
                  University: {item.university || "N/A"}
                </p>
                <p className="text-gray-600">
                  Location: {item.address || "N/A"}
                </p>
                <p className="text-gray-500">
                  {(parseInt(item.mainCityDistance) / 1000 || 0).toFixed(0)} KM
                  from Main City
                </p>
                <p className="text-gray-600">
                  Category:{" "}
                  {categories.find((cat) => cat._id === item.category)?.title ||
                    "N/A"}
                </p>
                <p className="text-gray-600">
                  Tags:{" "}
                  {(item.selectedTags || [])
                    .map(
                      (tagId) => tags.find((tag) => tag._id === tagId)?.title
                    )
                    .filter(Boolean)
                    .join(", ") || "None"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No colleges found</p>
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
