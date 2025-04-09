import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaBook,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaRuler,
  FaHome,
  FaFileAlt,
} from "react-icons/fa";
import {
  collegeApi,
  distanceApi,
  getterFunction,
  posterFunction,
} from "../../Api"; // Adjust path as needed

const CollegeDetails = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [collegeData, setCollegeData] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (id) {
      getCollegeDetails(id);
    }
  }, [id]);

  const requestLocationPermission = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "granted") {
            resolve(true);
          } else if (result.state === "prompt") {
            resolve(true); // Will prompt user when getCurrentPosition is called
          } else {
            alert(
              "Location permission is required to calculate the distance. Please enable it in your browser settings."
            );
            resolve(false);
          }
        });
      } else {
        alert("Geolocation is not supported by this browser.");
        resolve(false);
      }
    });
  };

  const getHomeDistance = async (add1) => {
    if (distance) return; // Skip if distance is already calculated

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      console.log("Getting Location Permissions");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const add2 = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("User location:", add2);

          const formData = { add1, add2 };
          const res = await posterFunction(distanceApi.getDistance, formData);

          if (res.success) {
            console.log("Distance:", res.data);
            setDistance(res.data); // Store distance in meters, convert on display
          } else {
            alert("Failed to calculate distance. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          let message = "Unable to get your location.";
          if (error.code === 1) message = "Location permission denied.";
          else if (error.code === 2) message = "Location unavailable.";
          else if (error.code === 3) message = "Location request timed out.";
          alert(message);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 10000,
        }
      );
    } catch (e) {
      console.error("Error getting home distance:", e);
      alert("An unexpected error occurred while fetching your location.");
    }
  };

  const getCollegeDetails = async (id) => {
    try {
      const res = await getterFunction(`${collegeApi.getCollege}/${id}`);
      console.log(res);
      if (res.success) {
        console.log(res.data);
        setCollegeData(res.data);
      }
    } catch (e) {
      console.error("Error getting college details:", e);
    }
  };

  const handleInquiryCall = (number) => {
    window.location.href = `tel:${number}`;
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
  } = collegeData?.college;

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      {/* Header Card */}
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
          <div
            onClick={() => getHomeDistance(address)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <FaHome className="text-gray-600" />
            <div>
              <p className="font-semibold">Distance from Your Location</p>
              <p className="text-gray-600">
                {distance
                  ? `${(distance / 1000).toFixed(0)} km`
                  : "Click to calculate distance"}
              </p>
            </div>
          </div>
          <div
            onClick={() => getHomeDistance(address)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <div>
              <p className="font-semibold">How To Reach ? </p>
              {path && (
                <div className="text-gray-600 space-y-4">
                  {path.split(/\d+\.\s*/).map((section, index) => {
                    if (!section.trim()) return null;

                    const match = section.match(/^(.+?):\s*(.*)/s); // match "Heading: content"

                    if (match) {
                      const heading = match[1].trim();
                      const content = match[2].trim();

                      return (
                        <div key={index}>
                          <h3 className="text-lg font-bold text-black">
                            {heading}
                          </h3>
                          <p className="mt-1">{content}</p>
                        </div>
                      );
                    } else {
                      // Fallback for general intro or unmatched parts
                      return (
                        <p key={index} className="mt-1">
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
          collegeData.courses.map((course, index) => (
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
                <button
                  onClick={() =>
                    handleInquiryCall(
                      collegeData?.supoorts[index]?.mobile || mobile
                    )
                  }
                  className="bg-teal-100 text-teal-600 py-1 px-3 rounded hover:bg-teal-200"
                >
                  Inquiry
                </button>
              </div>
              <hr className="my-4 border-gray-200" />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No courses available</p>
        )}
        {description && (
          <div className="text-gray-600 space-y-4">
            {description.split(/\d+\.\s*/).map((section, index) => {
              if (!section.trim()) return null;

              const match = section.match(/^(.+?):\s*(.*)/s); // match "Heading: content"

              if (match) {
                const heading = match[1].trim();
                const content = match[2].trim();

                return (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-black">{heading}</h3>
                    <p className="mt-1">{content}</p>
                  </div>
                );
              } else {
                // Fallback for general intro or unmatched parts
                return (
                  <p key={index} className="mt-1">
                    {section.trim()}
                  </p>
                );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDetails;
