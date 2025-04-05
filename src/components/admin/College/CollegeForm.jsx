import React, { useEffect, useState, useRef } from 'react';
import { collegeApi, getterFunction, posterFunction } from '../../../Api';
import Swal from 'sweetalert2';

const AddCollege = ({ handleClose }) => {
  const [courses, setCourses] = useState([]);
  const [support, setSupport] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    university: '',
    address: '',
    mainCity: '',
    mobile: '',
    courseIds: [],
    supportIds: [],
    fees: [], // Added fees array
    images: [],
    videos: [], // Changed video to videos array
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [mainCitySuggestions, setMainCitySuggestions] = useState([]);
  const addressInputRef = useRef(null);
  const mainCityInputRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    getCourses();
    getSupport();
    adjustTextareaHeight();
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [formData.description]);

  const adjustTextareaHeight = () => {
    const textarea = descriptionRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Video handlers
  const handleAddVideo = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      videos: [...prev.videos, ''],
    }));
  };

  const handleRemoveVideo = (e, index) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleVideoChange = (index, value) => {
    const updatedVideos = [...formData.videos];
    updatedVideos[index] = value;
    setFormData((prev) => ({ ...prev, videos: updatedVideos }));
  };

  // Image handlers (unchanged)
  const handleAddImage = (e) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const handleRemoveImage = (e, index) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  // Fee handler
  const handleFeeChange = (index, value) => {
    const updatedFees = [...formData.fees];
    updatedFees[index] = value;
    setFormData((prev) => ({ ...prev, fees: updatedFees }));
  };

  // Existing fetchSuggestions and debounce functions remain unchanged
  const fetchSuggestions = async (input, type, setSuggestions) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await getterFunction(`${collegeApi.suggestLocation}?input=${encodeURIComponent(input)}&type=${type}`);
      const data = res.data || res;
      if (data && data.predictions && data.status === 'OK') {
        setSuggestions(data.predictions.map((pred) => pred.description));
      } else {
        setSuggestions([]);
      }
    } catch (e) {
      console.error(`Error fetching ${type} suggestions:`, e);
      setSuggestions([]);
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleAddressChange = debounce((value) => {
    setFormData((prev) => ({ ...prev, address: value }));
    fetchSuggestions(value, 'geocode', setAddressSuggestions);
  }, 300);

  const handleMainCityChange = debounce((value) => {
    setFormData((prev) => ({ ...prev, mainCity: value }));
    fetchSuggestions(value, '(cities)', setMainCitySuggestions);
  }, 300);

  const getCourses = async () => {
    try {
      const res = await getterFunction(collegeApi.getCourses);
      if (res.success) setCourses(res.data);
    } catch (e) {
      console.error('Error getting courses:', e);
    }
  };

  const getSupport = async () => {
    try {
      const res = await getterFunction(collegeApi.getSupport);
      if (res.success) setSupport(res.data);
    } catch (e) {
      console.error('Error getting support:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await posterFunction(collegeApi.createCollege, formData);
      if (res?.success) {
        Swal.fire({
          title: 'College Added Successfully!',
          text: 'You have added a new college.',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
        handleClose();
        setFormData({
          name: '',
          description: '',
          university: '',
          address: '',
          mainCity: '',
          mobile: '',
          courseIds: [],
          supportIds: [],
          fees: [],
          images: [],
          videos: [],
        });
      }
    } catch (e) {
      console.error('Error adding college:', e);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add college. Please try again.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'courseIds') {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData((prev) => ({
        ...prev,
        courseIds: selectedOptions,
        supportIds: Array(selectedOptions.length).fill(''),
        fees: Array(selectedOptions.length).fill(''),
      }));
    } else if (name.startsWith('supportId')) {
      const index = parseInt(name.split('-')[1]);
      setFormData((prev) => {
        const newSupportIds = [...prev.supportIds];
        newSupportIds[index] = value;
        return { ...prev, supportIds: newSupportIds };
      });
    } else if (name.startsWith('fee')) {
      const index = parseInt(name.split('-')[1]);
      handleFeeChange(index, value);
    } else if (name === 'address') {
      handleAddressChange(value);
    } else if (name === 'mainCity') {
      handleMainCityChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const selectSuggestion = (suggestion, field, setSuggestions) => {
    setFormData((prev) => ({ ...prev, [field]: suggestion }));
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-semibold mb-6">Add New College</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Fields */}
        {['name', 'university', 'mobile', 'address', 'mainCity'].map((field) => (
          <div key={field} className="relative">
            <label className="block text-gray-700 capitalize mb-2">
              {field === 'mainCity' ? 'Center of City (Address)' : field}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              ref={field === 'address' ? addressInputRef : field === 'mainCity' ? mainCityInputRef : null}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {(field === 'address' && addressSuggestions.length > 0) || (field === 'mainCity' && mainCitySuggestions.length > 0) ? (
              <ul className="absolute z-20 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                {(field === 'address' ? addressSuggestions : mainCitySuggestions).map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectSuggestion(suggestion, field, field === 'address' ? setAddressSuggestions : setMainCitySuggestions)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        {/* Description Field */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 capitalize mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            ref={descriptionRef}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none overflow-hidden"
            required
          />
        </div>

        {/* Image Inputs */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 capitalize mb-2">Images</label>
          {formData.images.map((image, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={image}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={`Enter image ${index + 1} URL`}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={(e) => handleRemoveImage(e, index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
          >
            + Add Image
          </button>
        </div>

        {/* Video Inputs */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 capitalize mb-2">Videos</label>
          {formData.videos.map((video, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={video}
                onChange={(e) => handleVideoChange(index, e.target.value)}
                placeholder={`Enter video ${index + 1} URL`}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={(e) => handleRemoveVideo(e, index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddVideo}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
          >
            + Add Video
          </button>
        </div>

        {/* Courses Dropdown */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 capitalize mb-2">Courses</label>
          <select
            name="courseIds"
            value={formData.courseIds}
            onChange={handleChange}
            multiple
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          >
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple courses</p>
        </div>

        {/* Support Staff and Fees */}
        {formData.courseIds.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-2">Course Details</h3>
            {formData.courseIds.map((courseId, index) => (
              <div key={courseId} className="mb-4 border p-4 rounded-md">
                <label className="block text-gray-700 mb-2 font-medium">
                  {courses.find((c) => c._id === courseId)?.title || 'Course'}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Support Staff</label>
                    <select
                      name={`supportId-${index}`}
                      value={formData.supportIds[index] || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select support staff</option>
                      {support.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                          {staff.name} ({staff.mobile})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Fee</label>
                    <input
                      type="number"
                      name={`fee-${index}`}
                      value={formData.fees[index] || ''}
                      onChange={handleChange}
                      placeholder="Enter course fee"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-4">
        <button
            onClick={handleClose}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-slate-800"
          >
            Close
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Submit College
          </button>
         
        </div>
      </form>
    </div>
  );
};

export default AddCollege;