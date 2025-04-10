import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaBook,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaRuler,
  FaHome,
  FaWhatsapp,
  FaTrain,
  FaShuttleVan,
  FaPlane,
  FaRoad,
  FaBus,
} from "react-icons/fa";
import {
  collegeApi,
  distanceApi,
  getterFunction,
  posterFunction,
} from "../../Api"; // Adjust path as needed
import { getCurrentDistance } from "../../functions/Location";

const CollegeDetails = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const slides = JSON.parse(atob(searchParams.get("slide")));
  const [fade, setFade] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const [collegeData, setCollegeData] = useState(null);
  const [distance, setDistance] = useState(null);
  const [unlockedCourses, setUnlockedCourses] = useState([]); // Track unlocked courses

  useEffect(() => {
    if (id) {
      getCollegeDetails(id);
    }
  }, [id]);

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

  const getHomeDistance = async (add1) => {
    try {
      const message = await getCurrentDistance(add1);
      const match = message.match(/Approx\s(\d+)\s?km/i);
      const distanceValue = match ? parseInt(match[1]) : null;

      setCollegeData((prev) => ({
        ...prev,
        college: {
          ...(prev?.college || {}),
          path: message,
        },
      }));

      if (distanceValue) {
        setDistance(distanceValue);
      }
    } catch (e) {
      console.error("Error getting home distance:", e);
      alert("An unexpected error occurred while fetching your location.");
    }
  };

  const getCollegeDetails = async (id) => {
    try {
      const res = await getterFunction(`${collegeApi.getCollege}/${id}`);
      if (res.success) {
        setCollegeData(res.data);
      }
    } catch (e) {
      console.error("Error getting college details:", e);
    }
  };

  const handleUnlock = (courseId, supportIndex) => {
    try {
      const support = collegeData?.supoorts[supportIndex];
      if (!support || !support.mobile) {
        console.error("Support staff or mobile number not found");
        return;
      }

      // Unlock the course and initiate phone call
      // setUnlockedCourses((prev) => [...prev, courseId]);
      window.location.href = `tel:${support.mobile}`;
    } catch (e) {
      console.error("Error in unlocking:", e);
    }
  };

  if (!collegeData) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-600">Loading college details...</p>
      </div>
    );
  }

  const {
    name,
    description,
    university,
    mobile,
    address,
    mainCity,
    mainCityDistance,
    path,
    fees,
    images,
    courseIds,
  } = collegeData?.college;

  const renderTitle = (heading) => {
    const normalized = heading.trim().toLowerCase();

    if (normalized.includes("road")) {
      return (
        <div className="flex justify-start gap-2 items-center bg-yellow-600 text-white w-fit px-4 py-1 rounded-md">
          <FaShuttleVan />
          <h3>By Road</h3>
        </div>
      );
    }

    if (normalized.includes("train")) {
      return (
        <div className="flex justify-start gap-2 items-center bg-green-600 text-white w-fit px-4 py-1 rounded-md">
          <FaTrain />
          <h3>By Train</h3>
        </div>
      );
    }

    if (normalized.includes("flight")) {
      return (
        <div className="flex justify-start gap-2 items-center bg-blue-600 text-white w-fit px-4 py-1 rounded-md">
          <FaPlane />
          <h3>By Flight</h3>
        </div>
      );
    }

    if (normalized.includes("bus")) {
      return (
        <div className="flex justify-start gap-2 items-center bg-red-600 text-white w-fit px-4 py-1 rounded-md">
          <FaBus />
          <h3>By Bus</h3>
        </div>
      );
    }

    if (normalized.includes("alternative")) {
      return (
        <div className="flex justify-start gap-2 items-center bg-purple-600 text-white w-fit px-4 py-1 rounded-md">
          <FaRoad />
          <h3>Alternative Options</h3>
        </div>
      );
    }

    // fallback
    return <h3 className="text-lg font-bold text-black">{heading}</h3>;
  };

  // Group fees by courseId
  const groupedFees = courseIds.map((courseId, index) => {
    const courseFees = fees.filter((fee) => fee.courseId === courseId);
    return { courseId, fees: courseFees, supportIndex: index };
  });

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      {/* Header Card */}
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

      {/* College Info */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg mb-6 p-6">
        <h1 className="text-3xl font-bold text-teal-600">{name}</h1>
        <p className="text-lg text-gray-600 mb-4">{`( ${university} )`}</p>
        <p className="bg-teal-600 text-white w-fit px-4 rounded-sm">
          {collegeData?.category}
        </p>
        <hr className="my-4 border-gray-200" />
        <div className="flex items-center gap-2">
          <FaPhone className="text-gray-600" />
          <div>
            <p className="font-semibold">Mobile</p>
            <p className="text-gray-600">{mobile || "Not available"}</p>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg mb-6 p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-600" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-gray-600">{address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaCity className="text-gray-600" />
            <div>
              <p className="font-semibold">Main City</p>
              <p className="text-gray-600">{mainCity}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaRuler className="text-gray-600" />
            <div>
              <p className="font-semibold">Distance from Main City</p>
              <p className="text-gray-600">
                {(mainCityDistance / 1000).toFixed(2)} km
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
            <FaHome className="text-gray-600" />
            <div>
              <p className="font-semibold">Distance from Your Location</p>
              <p className="text-gray-600">
                {distance
                  ? `${distance.toFixed(0)} km`
                  : "Click calculate distance & path to Get Distance"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
            <div>
              <p className="font-semibold">How To Reach?</p>
              <button
                onClick={() => getHomeDistance(address)}
                className="bg-teal-600 text-white px-4 py-1 rounded shadow-md shadow-black active:shadow-sm"
              >
                Calculate Distance & Path
              </button>
              {path && (
                <div className="text-gray-600 space-y-4 mt-4">
                  {path.split(/\d+\.\s*/).map((section, index) => {
                    if (!section.trim()) return null;

                    const match = section.match(/^\*\*(.+?):\s*(.*)/s);
                    if (match) {
                      const heading = match[1].trim();
                      const content = match[2].trim();

                      return (
                        <div key={index}>
                          {renderTitle(heading)}
                          <p className="mt-1">{content}</p>
                        </div>
                      );
                    } else {
                      return (
                        <p key={index} className="mt-1 whitespace-pre-line">
                          {section.trim()}
                        </p>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Courses Offered
        </h2>
        <hr className="my-4 border-gray-200" />
        {collegeData?.courses.length > 0 ? (
          collegeData.courses.map((course, index) => {
            const courseFees =
              groupedFees.find((group) => group.courseId === course._id)
                ?.fees || [];
            const isUnlocked = unlockedCourses.includes(course._id);

            return (
              <div key={course._id} className="mb-6">
                <div className="flex items-center gap-2">
                  <FaBook className="text-gray-600" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {course.title.toUpperCase()}
                    </p>
                    <p className="text-gray-600">{course?.description ?? ""}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <p className="font-semibold">Eligibility:</p>
                  <p className="text-gray-600">
                    {course?.Eligibility || "Not specified"}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-semibold">Fees:</p>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-gray-600 ${
                        !isUnlocked ? "blur-sm select-none" : ""
                      }`}
                    >
                      {courseFees.length > 0
                        ? courseFees
                            .map((fee) => `${fee.period}: ₹${fee.amount}`)
                            .join(", ")
                        : "N/A"}
                    </p>
                    <button
                      onClick={() => handleUnlock(course._id, index)}
                      className="bg-[#15892e] text-white py-1 px-3 rounded shadow-md shadow-black active:shadow-none"
                    >
                      Unlock {course.title.toUpperCase()} Fee
                    </button>
                  </div>
                </div>
                <hr className="my-4 border-gray-200" />
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No courses available</p>
        )}
        <div className="flex mb-8 md:flex-row flex-col flex-wrap">
          {images.map((item, index) => (
            <img
              key={index}
              src={item}
              className="sm:w-36 w-full h-36 rounded-md"
            />
          ))}
        </div>
        {description && (
          <div className="text-gray-600 space-y-4">
            {description.split(/\*\*(.*?)\*\*/).map((section, index) => {
              if (!section.trim()) return null;

              // If it's an even index, it's plain text between headings
              if (index % 2 === 0) {
                return (
                  <p key={index} className="mt-1">
                    {section.trim()}
                  </p>
                );
              }

              // If it's an odd index, it's a heading
              const [heading, ...rest] = section.split(":");
              const content = rest.join(":").trim();

              return (
                <div key={index}>
                  <h3 className="text-lg font-bold text-black">
                    {heading.trim()}
                  </h3>
                  {content && <p className="mt-1">{content}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDetails;
