import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaPhone, FaEdit, FaTrash } from "react-icons/fa";
import { collegeApi, getterFunction, removerFunction } from "../../../Api";
import Swal from "sweetalert2";
import AddCollege from "./CollegeForm";

const AdminCollegeDetails = () => {
  const { collegeId } = useParams();
  const [college, setCollege] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategory] = useState([]);
  const [editCollege, setEditCollege] = useState(false);
  const [tags, setTags] = useState([]);
  const [support, setSupport] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (collegeId) {
      fetchCollegeData(collegeId);
    }
  }, [collegeId]);

  const fetchCollegeData = async (id) => {
    try {
      const [collegeRes, coursesRes, tagsRes, supportRes, catRes] = await Promise.all([
        getterFunction(`${collegeApi.getCollegeDetails}/${id}`),
        getterFunction(collegeApi.getCourses),
        getterFunction(collegeApi.getTag),
        getterFunction(collegeApi.getSupport),
        getterFunction(collegeApi.getCategory),
      ]);

      if (collegeRes.success) {
        console.log("College Data:", collegeRes.data.college);
        console.log("Fees:", collegeRes.data.college.fees);
        console.log("Fee Tags:", collegeRes.data.college.feeTags);
        setCollege(collegeRes.data.college);
      }
      if (coursesRes.success) setCourses(coursesRes.data);
      if (tagsRes.success) setTags(tagsRes.data);
      if (supportRes.success) setSupport(supportRes.data);
      if (catRes.success) setCategory(catRes.data);
    } catch (e) {
      console.error("Error fetching college data:", e);
    }
  };

  const handleEdit = () => {
    setEditCollege(true);
  };

  const handleDelete = async () => {
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
          const res = await removerFunction(
            `${collegeApi.removeCollge}/${collegeId}`
          );
          if (res.success) {
            Swal.fire("Deleted!", "Your college has been deleted.", "success");
            navigate("/admin/colleges");
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

  // Map expected durations for courses (replace courseIds with actual values)
  const courseDurations = {
    // Example: Replace with actual courseId for BSC NURSING and GNM
    "bsc123": 3, // BSC NURSING
    "gnm456": 3, // GNM
  };

  const renderFeeDetails = (courseId, fees) => {
    if (!fees || fees.length === 0) return <p>No fee details available</p>;

    // Filter fees for the specific courseId and limit to expected duration
    const courseFees = fees
      .filter((fee) => fee.courseId === courseId)
      .slice(0, courseDurations[courseId] || 3); // Default to 3 if unknown

    if (courseFees.length === 0) return <p>No fees for this course</p>;

    // Get feeTags for this course
    let feeTags = [];
    if (college.feeTags) {
      // Handle different feeTags structures
      if (Array.isArray(college.feeTags) && college.feeTags.length > 0) {
        if (typeof college.feeTags[0] === "string") {
          // Flat array of strings
          feeTags = [college.feeTags.find((tag) => tag === "Hostel, Food and accommodation") || "Hostel, Food and accommodation"];
        } else if (typeof college.feeTags[0] === "object" && college.feeTags[0].courseId) {
          // Array of { courseId, feeTags }
          const courseFeeTags = college.feeTags.find((tag) => tag.courseId === courseId)?.feeTags || [];
          feeTags = courseFeeTags.length > 0 ? courseFeeTags : ["Hostel, Food and accommodation"];
        }
      }
    } else {
      feeTags = ["Hostel, Food and accommodation"]; // Fallback
    }

    return (
      <ul className="list-disc list-inside text-gray-600 text-sm">
        {courseFees.map((fee, idx) => (
          <li key={idx}>
            {fee.period.includes("Course")
              ? `Course Fee: ₹ ${fee.amount} (Includes: ${feeTags.join(", ")})`
              : <span><span className="px-2 font-semibold">{fee.period} Fee : ₹ {fee.amount}</span> <span> {`( Includes : ${feeTags.join(", ")})`}</span> </span>}
          </li>
        ))}
      </ul>
    );
  };

  if (!college) {
    return <div>Loading college details...</div>;
  }

  return (
    <>
      {editCollege ? (
        <AddCollege
          handleClose={() => setEditCollege(false)}
          editMode={college}
        />
      ) : (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6">
          <div className="flex justify-start items-center gap-8 w-full px-16">
            <Link
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-1"
              to="/"
            >
              Dashboard
            </Link>
            <Link
              className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-1"
              to="/admin/college"
            >
              Colleges
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-full px-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {college.name}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="Edit College"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete College"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-black mr-2">University:</span>{" "}
              {college.university || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-black mr-2">Category:</span>{" "}
              <span className="bg-slate-700 text-white px-2 rounded-md">
                {categories.find((item) => item._id === college.category)?.title || "N/A"}
              </span>
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-black mr-2">Address:</span>{" "}
              {college.address || "N/A"}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold text-black mr-2">Distance from Main City:</span>{" "}
              {college.mainCityDistance
                ? `${(college.mainCityDistance / 1000).toFixed(2)} km`
                : "N/A"}
            </p>

            {college.mainCity && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-black mr-2">Main City:</span>{" "}
                {college.mainCity}
              </p>
            )}
            {college.campus_Highlight && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-black mr-2">Campus Highlight:</span>{" "}
                {college.campus_Highlight}
              </p>
            )}
            {college.mobile && (
              <p className="text-gray-600 mb-2 flex items-center">
                <span className="font-semibold text-black mr-2">Mobile:</span>{" "}
                {college.mobile}
              </p>
            )}
            {college.rank && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-black mr-2">Rank:</span> {college.rank}
              </p>
            )}
            {college.path && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-black mr-2">How to Reach:</span>{" "}
                {college.path}
              </p>
            )}
            {college.selectedTags?.length > 0 && (
              <p className="text-gray-600 mb-2 mt-2">
                <span className="font-semibold text-black mr-2">Tags:</span>{" "}
                {college.selectedTags
                  .map((tagId) => {
                    const tag = tags.find((t) => t._id === tagId);
                    return tag ? tag.title : tagId;
                  })
                  .join(", ")}
              </p>
            )}
            {college.courseIds?.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-600 font-semibold text-black mr-2 mb-1">Courses:</p>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {college.courseIds.map((courseId) => (
                    <li key={courseId}>
                      {courses.find((c) => c._id === courseId)?.title || courseId}
                      {college.fees && college.fees.length > 0 && (
                        <div>
                          {renderFeeDetails(courseId, college.fees)}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {college.supportIds?.length > 0 && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-black mr-2">Support Staff:</span>{" "}
                {college.supportIds
                  .map((supportId) => {
                    const staff = support.find((s) => s._id === supportId);
                    return staff
                      ? `${staff.name} (${staff.mobile})`
                      : supportId;
                  })
                  .join(", ")}
              </p>
            )}
            {college.images?.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-600 font-semibold text-black mr-2 mb-1">Images:</p>
                <div className="flex flex-wrap gap-2">
                  {college.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`College Image ${idx + 1}`}
                      className="w-32 h-32 my-2 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}
            {college.videos?.length > 0 && (
              <div className="mt-2">
                <p className="text-gray-600 font-semibold text-black mr-2 mb-1">Videos:</p>
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {college.videos.map((video, idx) => (
                    <li key={idx}>
                      <a
                        href={video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Video {idx + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {college.description && (
              <div className="text-gray-600 space-y-4 mt-4">
                {college.description.split(/\d+\.\s*/).map((section, index) => {
                  if (!section.trim()) return null;

                  const match = section.match(/^(.+?):\s*(.*)/s);
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
      )}
    </>
  );
};

export default AdminCollegeDetails;