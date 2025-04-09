import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaAppStore,
  FaSchool,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SupportForm from "./SupportForm";
import AddCollege from "./CollegeForm";
import AddCourse from "./CourseForm";
import { collegeApi, getterFunction, removerFunction } from "../../../Api";
import Swal from "sweetalert2";
import Category from "./Category";
import Tag from "./Tag";
import AppDetails from "./AppDetails";
import { Dialog } from "@mui/material";
import FeesTags from "./FeesTags";

const CollegeList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuport, setShowSuport] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [showCourse, setShowCourse] = useState(false);
  const [showCollege, setShowCollege] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [showCat, setShowCat] = useState(false);
  const [showFessTag, setShowFeesTag] = useState(false);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]); // Added categories state
  const [support, setSupport] = useState([]);
  const [showAppDetails, setShowAppDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getColleges(),
          getCourses(),
          getTags(),
          getCategories(), // Fetch categories
          getSupport(),
        ]);
      } catch (error) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getColleges = async () => {
    try {
      const res = await getterFunction(collegeApi.getColleges);
      if (res.success) {
        setColleges(res.data || []);
      } else {
        throw new Error("Failed to fetch colleges");
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      setError("Error fetching colleges.");
    }
  };

  const getCourses = async () => {
    try {
      const res = await getterFunction(collegeApi.getCourses);
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Error fetching courses.");
    }
  };

  const getTags = async () => {
    try {
      const res = await getterFunction(collegeApi.getTag);
      if (res.success) {
        setTags(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setError("Error fetching tags.");
    }
  };

  const getCategories = async () => {
    try {
      const res = await getterFunction(collegeApi.getCategory);
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories.");
    }
  };

  const getSupport = async () => {
    try {
      const res = await getterFunction(collegeApi.getSupport);
      if (res.success) {
        setSupport(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching support:", error);
      setError("Error fetching support.");
    }
  };

  const filteredColleges = colleges.filter((college) => {
    if (!college) return false; // Skip invalid college entries
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true; // Show all if query is empty

    const collegeName = college.name?.toLowerCase() || "";
    const collegeAddress = college.address?.toLowerCase() || ""; // Using address instead of location
    const collegeCategory =
      categories.find((cat) => cat._id === college.category)?.title?.toLowerCase() || "";
    const collegeTags = (college.selectedTags || [])
      .map((tagId) => tags.find((tag) => tag._id === tagId)?.title?.toLowerCase())
      .filter(Boolean)
      .join(" ");

    return (
      collegeName.includes(query) ||
      collegeAddress.includes(query) ||
      collegeCategory.includes(query) ||
      collegeTags.includes(query)
    );
  });

  const handleClose = () => {
    setShowSuport(false);
    setShowCourse(false);
    setShowCollege(false);
    setShowCat(false);
    setShowTag(false);
    setShowAppDetails(false);
    setShowFeesTag(false);
    setEditMode(null);
  };

  const handleViewMore = (collegeId) => {
    navigate(`/admin/collegeDetails/${collegeId}`);
  };

  if (!navigate) {
    console.error("Navigation not available");
    return <div>Error: Navigation not available</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center text-gray-600 p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {showCourse ? (
        <AddCourse handleClose={handleClose} />
      ) : showCollege ? (
        <AddCollege handleClose={handleClose} />
      ) : showCat ? (
        <Category handleClose={handleClose} />
      ) : showTag ? (
        <Tag handleClose={handleClose} />
      ) : showAppDetails ? (
        <AppDetails handleClose={handleClose} />
      ) : showFessTag ? (
        <Dialog open={showFessTag} onClose={handleClose}>
          <FeesTags handleClose={handleClose} />
        </Dialog>
      ) : (
        <div className="container mx-auto px-4 py-6 flex-1">
          {/* Search Bar */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search colleges by name, address, category, or tags"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Controls */}
          <div className="block justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Colleges</h2>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-4 mt-12 items-center">
              <button
                onClick={() => setShowSuport(true)}
                className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
              >
                <FaPlus className="mr-2" /> Add Support
              </button>
              <button
                onClick={() => setShowCourse(true)}
                className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
              >
                <FaPlus className="mr-2" /> Add Course
              </button>
              <button
                onClick={() => setShowCat(true)}
                className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
              >
                <FaPlus className="mr-2" /> Add Category
              </button>
              <button
                onClick={() => setShowTag(true)}
                className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
              >
                <FaPlus className="mr-2" /> Tags
              </button>
              <button
                onClick={() => setShowFeesTag(true)}
                className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
              >
                <FaPlus className="mr-2" /> Fees Tags
              </button>
              <button
                onClick={() => setShowAppDetails(true)}
                className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
              >
                <FaAppStore className="mr-2" /> App Details
              </button>
              <button
                onClick={() => {
                  setEditMode(null);
                  setShowCollege(true);
                }}
                className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
              >
                <FaSchool className="mr-2" /> Add College
              </button>
            </div>
          </div>

          {/* College Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college) => (
                <div
                  key={college._id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{college.name}</h3>
                  {college.images?.length > 0 ? (
                    <img
                      src={college.images[0]}
                      alt={college.name}
                      className="w-24 h-24 rounded-full absolute right-2 top-2 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full absolute right-2 top-2 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">University:</span>{" "}
                    {college.university || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Address:</span> {college.address || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Distance from Main City:</span>{" "}
                    {college.mainCityDistance
                      ? `${(college.mainCityDistance / 1000).toFixed(2)} km`
                      : "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Category:</span>{" "}
                    {categories.find((cat) => cat._id === college.category)?.title || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Tags:</span>{" "}
                    {(college.selectedTags || [])
                      .map((tagId) => tags.find((tag) => tag._id === tagId)?.title)
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </p>
                  <div className="mt-4 flex justify-end items-center">
                    <button
                      onClick={() => handleViewMore(college._id)}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1 rounded-md font-medium"
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No colleges found</p>
            )}
          </div>
        </div>
      )}

      {showSuport && (
        <div className="absolute inset-6 z-50 bg-inherit min-h-screen w-full flex justify-center items-center">
          <SupportForm handleClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default CollegeList;