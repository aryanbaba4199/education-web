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
import Swal from "sweetalert2";

const College = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [colleges, setColleges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [courses, setCourses] = useState([]);
  const [supports, setSupports] = useState([]); // New state for support staff
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [slides, setSlides] = useState([]);
  const [fade, setFade] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
          getCourses(),
          getSupports(), // Fetch support staff data
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

  const getCourses = async () => {
    try {
      const res = await getterFunction(collegeApi.getCourses);
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (e) {
      console.error("Error getting courses:", e);
      setError("Error fetching courses.");
    }
  };

  const getSupports = async () => {
    try {
      const res = await getterFunction(collegeApi.getSupport);
      if (res.success) {
        setSupports(res.data || []);
      }
    } catch (e) {
      console.error("Error getting supports:", e);
      setError("Error fetching support staff.");
    }
  };

  const filteredColleges = colleges.filter((college) => {
    if (!college) return false;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

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
    const collegeCourses = (college.courseIds || [])
      .map((courseId) =>
        courses.find((course) => course._id === courseId)?.title?.toLowerCase()
      )
      .filter(Boolean)
      .join(" ");

    return (
      collegeName.includes(query) ||
      collegeLocation.includes(query) ||
      collegeCategory.includes(query) ||
      collegeTags.includes(query) ||
      collegeCourses.includes(query)
    );
  });

  const handleUnlock = (college, courseIndex) => {
    try {
      // Get the support ID corresponding to the course index
      const supportId = college.supportIds[courseIndex];
      if (!supportId) {
        console.error("No support ID found for this course");
        return;
      }

      // Find the support staff details
      const support = supports.find((item) => item._id === supportId);
      if (!support || !support.mobile) {
        console.error("Support staff or mobile number not found");
        return;
      }
      Swal.fire({
        title: "Unlocking",
        text: "Connecting to our representative to unlock the fee",
        icon: "success",
        confirmButtonText: "",
        timer: 3000,
      });
      setTimeout(() => {
        window.location.href = `tel:${support.mobile}`;
      }, 3000);
      // Redirect to phone dialer with the support mobile number
    } catch (e) {
      console.error("Error in unlocking:", e);
    }
  };

  const handleCall = () => {
    const appDetails = localStorage.getItem("appDetails");
    window.location.href = `tel:${
      JSON.parse(appDetails)?.mobile || "+917005742790"
    }`;
  };

  const handleWhatsApp = () => {
    const appDetails = localStorage.getItem("appDetails");
    window.open(
      `https://wa.me/${JSON.parse(appDetails)?.whatsapp || "+917005742790"}`,
      "_blank"
    );
  };

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center text-gray-600 p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen overflow-hidden">
      {/* Slideshow Section */}
      <div className="h-[30%] bg-white shadow-md border-b border-gray-200 overflow-hidden">
        {slides.length > 0 ? (
          <img
            src={slides[currentSlideIndex].image}
            alt="Slide"
            className={`w-full h-[160px] object-cover transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <img
            src="https://i.pinimg.com/736x/70/42/f8/7042f811eba5fdd333382d89b9521cca.jpg"
            alt="Default"
            className="w-full h-[160px] object-cover rounded"
          />
        )}
        <div className="p-4 bg-white sticky top-0 z-50 shadow-md border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={handleCall}
              className="bg-teal-600 text-white py-1 px-4 rounded-md hover:bg-teal-700 flex items-center"
            >
              <FaPhone className="mr-2" />
              Call
            </button>
            <button
              onClick={handleWhatsApp}
              className="bg-teal-600 text-white py-1 px-4 rounded-md hover:bg-teal-700 flex items-center"
            >
              <FaWhatsapp className="mr-2" />
              WhatsApp
            </button>
            <div className="flex justify-center items-center rounded-md bg-red-600 text-white hover:bg-red-700">
              <button
                onClick={() => {
                  localStorage.removeItem("edutoken");
                  localStorage.removeItem("eduadmintoken");
                  navigate("/");
                }}
                className="text-white px-4 py-1 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 flex">
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, location, tags, category, or course"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
      </div>

      {/* College List */}
      <div className="flex-1 px-4 h-[40%] overflow-y-auto">
        {refreshing ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : filteredColleges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredColleges.map((item) => {
              const feesPerCourse = Math.ceil(
                item.fees.length / item.courseIds.length
              );
              const collegeCourses = item.courseIds.map((courseId, index) => {
                const course = courses.find((c) => c._id === courseId);
                const courseFees = item.fees.slice(
                  index * feesPerCourse,
                  (index + 1) * feesPerCourse
                );
                return { course, fees: courseFees };
              });

              return (
                <div
                  key={item._id}
                  className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div onClick={() => {
                        const base64Slides = btoa(JSON.stringify(slides));
                        navigate(
                          `/college-details?id=${item._id}&slide=${base64Slides}`
                        );
                      }} className="flex justify-between items-start">
                    {item.images?.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="mt-2 w-full rounded-md h-28 object-cover"
                      />
                    ) : (
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png"
                        alt={item.name}
                        className="mt-2 w-28 h-32 object-cover rounded-full"
                      />
                    )}
                    
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    University : {item.university || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Address : {item.address || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Main City Distance : {item.mainCityDistance/1000 || "N/A"} KM
                  </p>
                  {/* <div className="mt-2">
                    <p className="bg-teal-600 px-4 w-fit text-white rounded-md">
                      Courses Offered
                    </p>
                    <div className="mt-2 space-y-2">
                      {collegeCourses.map(({ course, fees }, idx) => (
                        <div
                          key={course?._id || idx}
                          className="border p-2 rounded-md bg-white shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">
                                {course?.title || "Unknown Course"}
                              </p>
                              <p className="text-sm text-gray-600">
                                Fees:{" "}
                                {fees.length > 0
                                  ? fees
                                      .map((fee) => (
                                        <span key={fee.period}>
                                          {fee.period}:{" "}
                                          <span className="blur-sm select-none">
                                            ₹{fee.amount}
                                          </span>
                                        </span>
                                      ))
                                      .reduce((prev, curr) => [prev, ", ", curr])
                                  : "N/A"}
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnlock(item, idx)}
                              className="bg-[#15892e] px-4 py-1 text-white rounded-sm shadow-md shadow-black active:shadow-none"
                            >
                              Unlock
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div> */}

                  <div className="flex justify-center mt-2 bg-gray-800 rounded-md items-center w-full">
                  <button
                      onClick={() => {
                        const base64Slides = btoa(JSON.stringify(slides));
                        navigate(
                          `/college-details?id=${item._id}&slide=${base64Slides}`
                        );
                      }}
                      className=" text-white px-4 py-2  rounded-md flex gap-2 items-center"
                    >
                      College Details <FaArrowRight />
                    </button>
                    </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600">No colleges found</p>
        )}
      </div>
    </div>
  );
};

export default College;
