import React, { useEffect, useState } from "react";
import {
  FaPhone,
  FaWhatsapp,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaAppStore,
  FaSchool,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SupportForm from "./SupportForm";
import AddCollege from "./CollegeForm"; // Ensure this matches your file structure
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
  const [support, setSupport] = useState([]);
  const [showAppDetails, setShowAppDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getColleges(), getCourses(), getTags(), getSupport()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getTags = async () => {
    try {
      const res = await getterFunction(collegeApi.getTag);
      if (res.success) {
        setTags(res.data);
      }
    } catch (e) {
      console.error("Error fetching tags:", e);
    }
  };

  const getSupport = async () => {
    try {
      const res = await getterFunction(collegeApi.getSupport);
      if (res.success) {
        setSupport(res.data);
      }
    } catch (e) {
      console.error("Error fetching support:", e);
    }
  };

  const filteredColleges = colleges.filter(
    (college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.mainCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!navigate) {
    console.error("Navigation not available");
    return <div>Error: Navigation not available</div>;
  }

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

  const getColleges = async () => {
    try {
      const res = await getterFunction(collegeApi.getColleges);
      if (res.success) {
        setColleges(res.data);
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const getCourses = async () => {
    try {
      const res = await getterFunction(collegeApi.getCourses);
      if (res.success) {
        setCourses(res.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleEdit = (college) => {
    setEditMode(college);
    setShowCollege(true);
  };

  const handleDelete = async (collegeId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this college!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const { value: code } = await Swal.fire({
          title: "Enter Security Code",
          input: "text",
          inputLabel: "Only authorized users can delete colleges.",
          inputPlaceholder: "Enter code",
          inputAttributes: { autocapitalize: "off", autocorrect: "off" },
          showCancelButton: true,
          confirmButtonText: "Verify",
          cancelButtonText: "Cancel",
          preConfirm: (value) => {
            if (value !== "727798") {
              Swal.showValidationMessage("Incorrect code");
            }
            return value;
          },
        });

        if (code === "727798") {
          const res = await removerFunction(`${collegeApi.removeCollege}/${collegeId}`); // Fixed typo
          if (res.success) {
            Swal.fire("Deleted!", "Your college has been deleted.", "success");
            getColleges();
          } else {
            Swal.fire("Error!", "Failed to delete the college.", "error");
          }
        }
      }
    } catch (e) {
      console.error("Error deleting college:", e);
      Swal.fire("Oops!", "Something went wrong.", "error");
    }
  };

  const renderFeeDetails = (fees, courseIndex) => {
    if (!fees || fees.length === 0) return null;

    const feeDetails = fees.map((fee, idx) => (
      <li key={idx}>
        {fee.period ? `${fee.period} Fee: ₹${fee.amount}` : `Course Fee: ₹${fee.amount}`}
      </li>
    ));

    return <ul className="list-disc list-inside text-gray-600 text-sm">{feeDetails}</ul>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {showCourse ? (
        <AddCourse handleClose={handleClose} />
      ) : showCollege ? (
        <AddCollege handleClose={handleClose} editMode={editMode} />
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
              placeholder="Search colleges by name or location"
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
            {filteredColleges.map((college) => (
              <div
                key={college._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
              >
                {college.images?.length > 0 && (
                  <img
                    src={college.images[0]}
                    alt={college.name}
                    className="w-full h-40 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{college.name}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">University:</span> {college.university}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Address:</span> {college.address}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">City:</span> {college.mainCity}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Campus Highlight:</span> {college.campus_Highlight}
                </p>
                <p className="text-gray-600 mb-1 flex items-center">
                  <FaPhone className="mr-2 text-blue-500" />
                  {college.mobile}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Rank:</span> {college.rank || "N/A"}
                </p>
                {college.description && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Description:</span> {college.description.slice(0, 100)}...
                  </p>
                )}
                {college.path && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">How to Reach:</span> {college.path}
                  </p>
                )}
                {college.selectedTags?.length > 0 && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Tags:</span>{" "}
                    {college.selectedTags.map((tagId) => {
                      const tag = tags.find((t) => t._id === tagId);
                      return tag ? tag.title : tagId;
                    }).join(", ")}
                  </p>
                )}
                {college.feeTags?.length > 0 && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Fee Includes:</span> {college.feeTags.join(", ")}
                  </p>
                )}
                {college.courseIds?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-gray-600 font-medium">Courses:</p>
                    <ul className="list-disc list-inside text-gray-600 text-sm">
                      {college.courseIds.map((courseId, index) => (
                        <li key={courseId}>
                          {courses?.find((c) => c._id === courseId)?.title || courseId}
                          {college.fees && college.fees.length > 0 && (
                            <div>
                              {renderFeeDetails(
                                college.fees.filter(
                                  (_, i) =>
                                    i >= (index * college.fees.length) / college.courseIds.length &&
                                    i < ((index + 1) * college.fees.length) / college.courseIds.length
                                ),
                                index
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {college.supportIds?.length > 0 && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Support Staff:</span>{" "}
                    {college.supportIds.map((supportId) => {
                      const staff = support.find((s) => s._id === supportId); // Fixed condition
                      return staff ? `${staff.name} (${staff.mobile})` : supportId;
                    }).join(", ")}
                  </p>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(college)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="Edit College"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(college._id)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Delete College"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
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