import React, { useEffect, useState } from 'react';
import { FaPhone, FaWhatsapp, FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SupportForm from './SupportForm';
import AddCollege from './CollegeForm';
import AddCourse from './CourseForm';
import { collegeApi, getterFunction, removerFunction } from '../../../Api';
import Swal from 'sweetalert2';

const CollegeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSuport, setShowSuport] = useState(false);
  const [showCourse, setShowCourse] = useState(false);
  const [showCollege, setShowCollege] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getColleges();
    getCourses();
  }, []);

 

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.mainCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!navigate) {
    console.error('Navigation not available');
    return <div>Error: Navigation not available</div>;
  }

  const handleClose = () => {
    setShowSuport(false);
    setShowCourse(false);
    setShowCollege(false);
  };

  const getColleges = async () => {
    try {
      const res = await getterFunction(collegeApi.getColleges);
      if (res.success) {
        setColleges(res.data);
      }
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const handleEdit = (collegeId) => {
    // Implement edit functionality here
    console.log(`Edit college with ID: ${collegeId}`);
    // You might want to navigate to an edit page or open a modal
  };

  const handleDelete = (collegeId) => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this college!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Ask for security code
          const { value: code } = await Swal.fire({
            title: 'Enter Security Code',
            input: 'text',
            inputLabel: 'Only authorized users can delete colleges.',
            inputPlaceholder: 'Enter code',
            inputAttributes: {
              autocapitalize: 'off',
              autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Verify',
            cancelButtonText: 'Cancel',
            preConfirm: (value) => {
              if (value !== '727798') {
                Swal.showValidationMessage('Incorrect code');
              }
              return value;
            }
          });
  
          if (code === '727798') {
            const res = await removerFunction(`${collegeApi.removeCollge}/${collegeId}`);
            if (res.success) {
              Swal.fire('Deleted!', 'Your college has been deleted.', 'success');
              getColleges();
            } else {
              Swal.fire('Error!', 'Failed to delete the college.', 'error');
            }
          }
        }
      });
    } catch (e) {
      console.error('Error deleting college:', e);
      Swal.fire('Oops!', 'Something went wrong.', 'error');
    }
  };
  

  const getCourses = async()=>{
    try {
      const res = await getterFunction(collegeApi.getCourses);
      if (res.success) {
        setCourses(res.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      {showCourse ? <AddCourse handleClose={handleClose} /> :  
      <>
      {showCollege ? <AddCollege handleClose={handleClose} /> :
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
        <div className="md:flex block justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Colleges</h2>
          <div className="space-x-2 flex md:flex-col flex-col gap-4 mt-12 items-center">
            
            <button
              onClick={() => setShowSuport(true)}
              className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
            >
              <FaPlus className="mr-2" /> Add Support
            </button>
            <button
              onClick={() => setShowCourse(true)}
              className="inline-flex w-48  items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
            >
              <FaPlus className="mr-2" /> Add Course
            </button>
            <button
              onClick={() => setShowCollege(true)}
              className="inline-flex w-48 items-center px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700"
            >
              <FaPlus className="mr-2" /> Add College
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
              {/* College Image */}
              {college.images && college.images.length > 0 && (
                <img
                  src={college.images[0]}
                  alt={college.name}
                  className="w-full h-40 object-cover rounded-t-lg mb-4"
                />
              )}

              {/* College Details */}
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
              <p className="text-gray-600 mb-1 flex items-center">
                <FaPhone className="mr-2 text-blue-500" />
                {college.mobile}
              </p>
              
              {/* Courses */}
              {college.courseIds && college.courseIds.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-600 font-medium">Courses:</p>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {college.courseIds.map((courseId, index) => (
                      <li key={courseId}>
                        {courses?.find(c => c._id === courseId)?.title || courseId} 
                        {college.fees && college.fees[index] && ` - ₹ ${college.fees[index]}/-`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(college._id)}
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
      }
      </>
    }

      {/* Modals */}
      {showSuport && (
        <div className="absolute inset-6 z-50 bg-inherit min-h-screen w-full flex justify-center items-center">
          <SupportForm handleClose={handleClose} />
        </div>
      )}
      {/* {showCollege && (
        <div className="absolute z-50 bg-inherit min-h-screen w-full px-16 flex flex-col justify-center items-center">
          <AddCollege handleClose={handleClose} />
        </div>
      )} */}
      {/* {showCourse && (
        <div className="absolute inset-6 z-50 bg-inherit min-h-screen w-full flex justify-center items-center">
          <AddCourse handleClose={handleClose} />
        </div>
      )} */}
    </div>
  );
};

export default CollegeList;