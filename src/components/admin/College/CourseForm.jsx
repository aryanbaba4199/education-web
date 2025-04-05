import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Added icons for edit and delete
import { collegeApi, getterFunction, posterFunction, deleterFunction, removerFunction } from '../../../Api'; // Assuming deleterFunction exists
import Swal from 'sweetalert2';

const AddCourse = ({ handleClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    Eligibility: '',
  });
  const [courses, setCourses] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const res = await getterFunction(collegeApi.getCourses);
      if (res.success) {
        setCourses(res.data);
      }
    } catch (e) {
      console.error('Error fetching courses:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingCourseId) {
        // Update existing course
        res = await posterFunction(`${collegeApi.updateCourse}/${editingCourseId}`, formData);
      } else {
        // Create new course
        res = await posterFunction(collegeApi.createCourse, formData);
      }
      
      if (res.success) {
        Swal.fire({
          title: editingCourseId ? 'Course Updated Successfully!' : 'Course Added Successfully!',
          text: '',
          icon: 'success',
          confirmButtonText: 'Okay'
        });
        setFormData({ title: '', Eligibility: '' });
        setEditingCourseId(null);
        getCourses(); // Refresh course list
        if (!editingCourseId) handleClose(); // Only close on add, not edit
      }
    } catch (e) {
      console.error('Error in submitting form:', e);
      Swal.fire({
        title: 'Error',
        text: e?.response?.data?.message || "Error in submitting form",
        icon: 'error',
        confirmButtonText: 'Okay'
      });
    }
  };

  const handleEdit = (course) => {
    setFormData({
      title: course.title,
      Eligibility: course.Eligibility || ''
    });
    setEditingCourseId(course._id);
  };

  const handleDelete = async (courseId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removerFunction(`${collegeApi.deleteCourse}/${courseId}`);
          if (res.success) {
            Swal.fire(
              'Deleted!',
              'The course has been deleted.',
              'success'
            );
            getCourses(); // Refresh course list
          }else{
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete course',
              icon: 'error'
            });
          }
        } catch (e) {
          console.error('Error deleting course:', e);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete course',
            icon: 'error'
          });
        }
      }
    });
  };

  const handleCancelEdit = () => {
    setFormData({ title: '', Eligibility: '' });
    setEditingCourseId(null);
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {editingCourseId ? 'Edit Course' : 'Add New Course'}
        </h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={1}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Eligibility</label>
            <input
              type="text"
              value={formData.Eligibility}
              onChange={(e) => setFormData({ ...formData, Eligibility: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              {editingCourseId ? 'Update Course' : 'Submit Course'}
            </button>
            {editingCourseId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Course List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Existing Courses</h3>
          {courses.length === 0 ? (
            <p className="text-gray-600">No courses available</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{course.title}</p>
                    <p className="text-sm text-gray-600">
                      Eligibility: {course.Eligibility || 'Not specified'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="Edit Course"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Delete Course"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleClose}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;