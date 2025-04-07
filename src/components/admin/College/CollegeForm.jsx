import React, { useEffect, useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { collegeApi, getterFunction, posterFunction, updaterFunction } from '../../../Api';
import Swal from 'sweetalert2';

const AddCollege = ({ handleClose, editMode }) => {
  const [courses, setCourses] = useState([]);
  const [support, setSupport] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    university: '',
    address: '',
    mainCity: '',
    campus_Highlight: '',
    category: '',
    mobile: '',
    path: '',
    rank : 0,
    selectedTags: [],
    courseIds: [],
    supportIds: [],
    fees: [],
    images: [],
    videos: [],
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [mainCitySuggestions, setMainCitySuggestions] = useState([]);
  const addressInputRef = useRef(null);
  const mainCityInputRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, supportRes, tagRes, categoryRes] = await Promise.all([
          getterFunction(collegeApi.getCourses),
          getterFunction(collegeApi.getSupport),
          getterFunction(collegeApi.getTag),
          getterFunction(collegeApi.getCategory),
        ]);
        if (courseRes.success) setCourses(courseRes.data);
        if (supportRes.success) setSupport(supportRes.data);
        if (tagRes.success) setTags(tagRes.data);
        if (categoryRes.success) setCategories(categoryRes.data);
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };
    fetchData();
    if (editMode) {
      console.log('Edit mode data:', editMode);
      setFormData({
        ...editMode,
        selectedTags: editMode.selectedTags || [], // Ensure arrays are set
        courseIds: editMode.courseIds || [],
        supportIds: editMode.supportIds || [],
        fees: editMode.fees || [],
        images: editMode.images || [],
        videos: editMode.videos || [],
      });
    }
    adjustTextareaHeight();
  }, [editMode]);

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

  const generateDescription = async () => {
    try {
      const data = { collegeName: formData.name, university: formData.university, address: formData.address };
      const res = await posterFunction(collegeApi.generateDescription, data);
      if (res?.success && typeof res.data === 'string') {
        setFormData((prev) => ({ ...prev, description: res.data.trim() }));
      }
    } catch (e) {
      console.error('Error generating description:', e);
    }
  };

  const fetchSuggestions = async (input, setSuggestions) => {
    if (!input) return setSuggestions([]);
    try {
      const res = await getterFunction(
        `https://education-1064837086369.asia-south1.run.app/college/suggestLocation?input=${encodeURIComponent(input)}&type=geocode`
      );
      const data = res.data || res;
      setSuggestions(data?.predictions?.status === 'OK' ? data.predictions.map((pred) => pred.description) : []);
    } catch (e) {
      console.error('Error fetching suggestions:', e);
      setSuggestions([]);
    }
  };

  const handleToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(id)
        ? prev.selectedTags.filter((tagId) => tagId !== id)
        : [...prev.selectedTags, id],
    }));
  };

  const handleArrayAdd = (e, field) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const handleArrayRemove = (e, field, index) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
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
    } else if (name.startsWith('supportId-')) {
      const index = parseInt(name.split('-')[1]);
      handleArrayChange('supportIds', index, value);
    } else if (name.startsWith('fee-')) {
      const index = parseInt(name.split('-')[1]);
      handleArrayChange('fees', index, value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const selectSuggestion = (suggestion, field, setSuggestions) => {
    setFormData((prev) => ({ ...prev, [field]: suggestion }));
    setSuggestions([]);
  };

  const handleUpdate = async (formData) => {
    try{
      const res = await updaterFunction(`${collegeApi.updateCollege}/${formData._id}`, formData);
      if (res?.success) {
        Swal.fire({
          title: 'College Updated Successfully!',
          icon:'success',
          confirmButtonText: 'Okay',
        });
        // handleClose();
      }
    }catch(e){
      console.error('Error updating college:', e);
      Swal.fire({
        title: 'Error updating college!',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await handleUpdate(formData);
        return;
       
      } else {
        const res = await posterFunction(collegeApi.createCollege, formData);
        if (res?.success) {
          Swal.fire({
            title: 'College Added Successfully!',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
        }
      }
      // Reset form and close
      setFormData({
        name: '',
        description: '',
        university: '',
        address: '',
        mainCity: '',
        campus_Highlight: '',
        category: '',
        mobile: '',
        path: '',
        rank : 0,
        selectedTags: [],
        courseIds: [],
        supportIds: [],
        fees: [],
        images: [],
        videos: [],
      });
      handleClose();
    } catch (e) {
      console.error('Error submitting college:', e);
      Swal.fire({
        title: 'Error',
        text: `Failed to ${editMode ? 'update' : 'add'} college. Please try again.`,
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const renderInput = (field, label, required = true) => (
    <div className="relative">
      <label className="block text-gray-700 capitalize mb-2">{label}</label>
      <input
        type="text"
        name={field}
        value={formData[field]}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required={required}
      />
    </div>
  );

  const renderSearchInput = (field, label, suggestions, setSuggestions) => (
    <div className="relative">
      <label className="block text-gray-700 capitalize mb-2">{label}</label>
      <div className="flex items-center">
        <input
          type="text"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={() => fetchSuggestions(formData[field], setSuggestions)}
          className="ml-2 p-2 text-gray-600 hover:text-blue-600"
        >
          <FaSearch />
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-20 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => selectSuggestion(suggestion, field, setSuggestions)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderArrayInput = (field, label, placeholder) => (
    <div className="md:col-span-2">
      <label className="block text-gray-700 capitalize mb-2">{label}</label>
      {formData[field].map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(field, index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={(e) => handleArrayRemove(e, field, index)}
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
          >
            -
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={(e) => handleArrayAdd(e, field)}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mt-2"
      >
        + Add {label.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-semibold mb-6">{editMode ? 'Edit College' : 'Add New College'}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput('name', 'Name')}
        {renderInput('university', 'University')}
        {renderInput('mobile', 'Mobile')}
        {renderInput('campus_Highlight', 'Campus Highlight')}
        {renderInput('path', 'How to Reach?')}
        {renderInput('rank', 'Rank')}

        <div className="relative">
          <label className="block text-gray-700 capitalize mb-2">Select the Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.title}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 p-4 bg-white rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Select Tags</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <label key={tag._id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.selectedTags.includes(tag._id)}
                  onChange={() => handleToggle(tag._id)}
                  className="accent-blue-600"
                />
                <span className="text-sm">{tag.title}</span>
              </label>
            ))}
          </div>
        </div>

        {renderSearchInput('address', 'Address', addressSuggestions, setAddressSuggestions)}
        {renderSearchInput('mainCity', 'Center of City (Address)', mainCitySuggestions, setMainCitySuggestions)}

        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <label className="block text-gray-700 capitalize mb-2">Description</label>
            <button
              type="button"
              onClick={generateDescription}
              className="mb-2 px-4 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md"
            >
              Generate Description
            </button>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            ref={descriptionRef}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none overflow-hidden"
            required
          />
        </div>

        {renderArrayInput('images', 'Images', 'Enter image URL')}
        {renderArrayInput('videos', 'Videos', 'Enter video URL')}

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
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple courses</p>
        </div>

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

        <div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-slate-800"
          >
            Close
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {editMode ? 'Update College' : 'Submit College'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCollege;