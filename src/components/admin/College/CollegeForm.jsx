import React, { useEffect, useState, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import {
  collegeApi,
  getterFunction,
  posterFunction,
  updaterFunction,
} from "../../../Api";
import Swal from "sweetalert2";
import {
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Dialog,
  CircularProgress,
} from "@mui/material";

const AddCollege = ({ handleClose, editMode }) => {
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(false);
  const [support, setSupport] = useState([]);
  const [tags, setTags] = useState([]);
  const [feeTags, setFeesTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    university: "",
    address: "",
    mainCity: "",
    campus_Highlight: "",
    category: "",
    mobile: "",
    path: "",
    rank: 0,
    selectedTags: [],
    courseIds: [],
    supportIds: [],
    fees: [], // { courseId, unit, duration, amounts: [], total, feeTags: [] }
    images: [],
    videos: [],
  });
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [mainCitySuggestions, setMainCitySuggestions] = useState([]);
  const addressInputRef = useRef(null);
  const mainCityInputRef = useRef(null);
  const descriptionRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, supportRes, tagRes, categoryRes, feesTagres] =
          await Promise.all([
            getterFunction(collegeApi.getCourses),
            getterFunction(collegeApi.getSupport),
            getterFunction(collegeApi.getTag),
            getterFunction(collegeApi.getCategory),
            getterFunction(collegeApi.getFeesTag),
          ]);
        if (courseRes.success) setCourses(courseRes.data);
        if (supportRes.success) setSupport(supportRes.data);
        if (tagRes.success) setTags(tagRes.data);
        if (categoryRes.success) setCategories(categoryRes.data);
        if (feesTagres.success) setFeesTags(feesTagres.data);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    fetchData();

    if (editMode) {
      const mappedFees = editMode.courseIds.map((courseId, index) => {
        const courseFees = editMode.fees
          ? editMode.fees.slice(
              index * Math.ceil(editMode.fees.length / editMode.courseIds.length),
              (index + 1) * Math.ceil(editMode.fees.length / editMode.courseIds.length)
            )
          : [];
        const unit = courseFees.length > 0 && courseFees[0].period
          ? (courseFees[0].period.includes("Year") ? "Year" : "Semester")
          : "Course";
        const duration = unit !== "Course" ? courseFees.length : "";
        const amounts = courseFees.length > 0
          ? unit === "Course"
            ? [courseFees[0].amount]
            : courseFees.map(f => f.amount)
          : [""];
        const total = amounts.reduce((sum, amt) => sum + (parseFloat(amt) || 0), 0).toString();

        return {
          courseId,
          unit,
          duration,
          amounts,
          total,
          feeTags: editMode.feeTags || [],
        };
      });

      setFormData({
        ...editMode,
        selectedTags: editMode.selectedTags || [],
        courseIds: editMode.courseIds || [],
        supportIds: editMode.supportIds || [],
        fees: mappedFees.length > 0 ? mappedFees : editMode.courseIds.map((courseId) => ({
          courseId,
          unit: "Year",
          duration: "",
          amounts: [],
          total: "",
          feeTags: editMode.feeTags || [],
        })),
        images: editMode.images || [],
        videos: editMode.videos || [],
      });
    }
    adjustTextareaHeight();
  }, [editMode]);

  useEffect(() => {
    adjustTextareaHeight();
    adjustPathHeight();
  }, [formData.description, formData.path]);

  const adjustTextareaHeight = () => {
    const textarea = descriptionRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const adjustPathHeight = () => {
    const input = pathRef.current;
    if (input) {
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
    }
  };

  const generateDescription = async () => {
    setLoader("Generating...");
    try {
      const data = {
        collegeName: formData.name,
        university: formData.university,
        address: formData.address,
      };
      const res = await posterFunction(collegeApi.generateDescription, data);
      if (res?.success && typeof res.data === "string") {
        setFormData((prev) => ({ ...prev, description: res.data.trim() }));
      }
    } catch (e) {
      console.error("Error generating description:", e);
    }
    setLoader(null);
  };

  const correctPath = async (words) => {
    setLoader("Correcting...");
    try {
      const data = {
        collegeName: formData.name,
        university: formData.university,
        address: formData.university,
        reach: words,
      };
      const res = await posterFunction(collegeApi.correctPath, data);
      if (res.success && typeof res.data === "string") {
        setFormData((prev) => ({ ...prev, path: res.data.trim() }));
      }
    } catch (e) {
      console.error("Error in correction ", e);
    }
    setLoader(null);
  };

  const fetchSuggestions = async (input, setSuggestions) => {
    if (!input) return setSuggestions([]);
    try {
      const res = await getterFunction(
        `https://education-1064837086369.asia-south1.run.app/college/suggestLocation?input=${encodeURIComponent(
          input
        )}&type=geocode`
      );
      const data = res.data || res;
      setSuggestions(
        data?.predictions?.status === "OK"
          ? data.predictions.map((pred) => pred.description)
          : []
      );
    } catch (e) {
      console.error("Error fetching suggestions:", e);
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
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleArrayRemove = (e, field, index) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleFeeChange = (courseIndex, key, value, feeIndex = null) => {
    setFormData((prev) => {
      const updatedFees = [...prev.fees];
      if (key === "amounts" && feeIndex !== null) {
        updatedFees[courseIndex].amounts[feeIndex] = value;
        const total = updatedFees[courseIndex].amounts.reduce(
          (sum, amt) => sum + (parseFloat(amt) || 0),
          0
        );
        updatedFees[courseIndex].total = total.toString();
      } else if (key === "feeTags") {
        updatedFees[courseIndex].feeTags = value;
      } else if (key === "total") {
        updatedFees[courseIndex].total = value;
      } else {
        updatedFees[courseIndex] = {
          ...updatedFees[courseIndex],
          [key]: value,
        };
        if (key === "duration" && value) {
          const num = parseInt(value) || 0;
          updatedFees[courseIndex].amounts = Array(num).fill("");
          updatedFees[courseIndex].total = "";
        }
        if (key === "unit" && value === "Course") {
          updatedFees[courseIndex].duration = "";
          updatedFees[courseIndex].amounts = [""];
          updatedFees[courseIndex].total = "";
        }
      }
      return { ...prev, fees: updatedFees };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "courseIds") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => {
        const newCourseIds = selectedOptions;
        const existingFeesMap = new Map(prev.fees.map(fee => [fee.courseId, fee]));
        const newFees = newCourseIds.map((courseId) => 
          existingFeesMap.get(courseId) || {
            courseId,
            unit: "Year",
            duration: "",
            amounts: [],
            total: "",
            feeTags: [],
          }
        );
        return {
          ...prev,
          courseIds: newCourseIds,
          supportIds: Array(newCourseIds.length).fill(""),
          fees: newFees,
        };
      });
    } else if (name.startsWith("supportId-")) {
      const index = parseInt(name.split("-")[1]);
      handleArrayChange("supportIds", index, value);
    } else if (name.startsWith("fee-unit-")) {
      const index = parseInt(name.split("-")[2]);
      handleFeeChange(index, "unit", value);
    } else if (name.startsWith("fee-duration-")) {
      const index = parseInt(name.split("-")[2]);
      handleFeeChange(index, "duration", value);
    } else if (name.startsWith("fee-amount-")) {
      const [_, __, courseIndex, feeIndex] = name.split("-");
      handleFeeChange(parseInt(courseIndex), "amounts", value, parseInt(feeIndex));
    } else if (name.startsWith("fee-total-")) {
      const index = parseInt(name.split("-")[2]);
      handleFeeChange(index, "total", value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFeeTagChange = (courseIndex, tagTitle, checked) => {
    setFormData((prev) => {
      const updatedFees = [...prev.fees];
      const currentFeeTags = updatedFees[courseIndex].feeTags || [];
      updatedFees[courseIndex].feeTags = checked
        ? [...currentFeeTags, tagTitle]
        : currentFeeTags.filter((tag) => tag !== tagTitle);
      return { ...prev, fees: updatedFees };
    });
  };

  const selectSuggestion = (suggestion, field, setSuggestions) => {
    setFormData((prev) => ({ ...prev, [field]: suggestion }));
    setSuggestions([]);
  };

  const handleUpdate = async (formData) => {
    setLoader("Updating...");
    console.log("Original fees in handleUpdate:", formData.fees);
    try {
      const feesArray = Array.isArray(formData.fees) ? formData.fees : [];
      let transformedFees;
      let allFeeTags;

      if (feesArray.length > 0 && "period" in feesArray[0]) {
        transformedFees = feesArray;
        allFeeTags = formData.feeTags || [];
      } else {
        allFeeTags = feesArray.map(fee => fee.feeTags || []).flat();
        transformedFees = feesArray
          .map((fee) => {
            if (fee.unit === "Course") {
              return { courseId: fee.courseId, period: "Course", amount: fee.amounts[0] || "0", total: fee.total || "0" };
            }
            return fee.amounts.map((amount, idx) => ({
              courseId: fee.courseId,
              period: `${fee.unit} ${idx + 1}`,
              amount: amount || "0",
              total: fee.total || "0",
            }));
          })
          .flat();
      }

      const payload = {
        ...formData,
        fees: transformedFees,
        feeTags: allFeeTags,
      };

      console.log("Update Payload:", payload);

      const res = await updaterFunction(
        `${collegeApi.updateCollege}/${formData._id}`,
        payload
      );
      if (res?.success) {
        Swal.fire({
          title: "College Updated Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
        handleClose();
      }
    } catch (e) {
      setLoader(null);
      console.error("Error updating college:", e);
      Swal.fire({
        title: "Error updating college!",
        text: e.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
    setLoader(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader("Submitting...");
    try {
      const feesArray = Array.isArray(formData.fees) ? formData.fees : [];
      const allFeeTags = feesArray.map(fee => fee.feeTags || []).flat();
      const transformedFees = feesArray
        .map((fee) => {
          if (fee.unit === "Course") {
            return { courseId: fee.courseId, period: "Course", amount: fee.amounts[0] || "0", total: fee.total || "0" };
          }
          return fee.amounts.map((amount, idx) => ({
            courseId: fee.courseId,
            period: `${fee.unit} ${idx + 1}`,
            amount: amount || "0",
            total: fee.total || "0",
          }));
        })
        .flat();

      const payload = {
        ...formData,
        fees: transformedFees,
        feeTags: allFeeTags,
      };

      console.log("Submit Payload:", payload);

      if (editMode) {
        await handleUpdate(payload);
      } else {
        const res = await posterFunction(collegeApi.createCollege, payload);
        if (res?.success) {
          Swal.fire({
            title: "College Added Successfully!",
            icon: "success",
            confirmButtonText: "Okay",
          });
          setFormData({
            name: "",
            description: "",
            university: "",
            address: "",
            mainCity: "",
            campus_Highlight: "",
            category: "",
            mobile: "",
            path: "",
            rank: 0,
            selectedTags: [],
            courseIds: [],
            supportIds: [],
            fees: [],
            images: [],
            videos: [],
          });
          handleClose();
        }
      }
    } catch (e) {
      console.error("Error submitting college:", e);
      Swal.fire({
        title: "Error",
        text: `Failed to ${editMode ? "update" : "add"} college: ${e.message}`,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
    setLoader(null);
  };

  const renderInput = (field, label, required = true) => (
    <div className="relative">
      <div className="flex gap-4 items-center justify-start">
        <label className="block text-gray-700 capitalize mb-2">{label}</label>
        {field === "path" && (
          <button
            onClick={() => correctPath(formData.path)}
            className="mb-2 bg-slate-800 hover:bg-slate-700 px-4 py-1 rounded-md text-white"
          >
            Correct
          </button>
        )}
      </div>
      {field === "path" ? (
        <textarea
          name={field}
          value={formData[field]}
          onChange={handleChange}
          ref={pathRef}
          maxLength={150}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[50px] resize-none overflow-hidden"
          required={required}
        />
      ) : (
        <input
          type="text"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        />
      )}
      {field === "path" && (
        <p className="text-sm text-gray-500 mt-1">
          {formData.path.length}/150 characters
        </p>
      )}
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
      <h2 className="text-2xl font-semibold mb-6">
        {editMode ? "Edit College" : "Add New College"}
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput("name", "Name")}
        {renderInput("university", "University")}
        {renderInput("mobile", "Mobile")}
        {renderInput("campus_Highlight", "Campus Highlight")}
        {renderInput("path", "How to Reach?")}
        {renderInput("rank", "Rank")}

        <div className="relative">
          <label className="block text-gray-700 capitalize mb-2">
            Select the Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 p-4 bg-white rounded-md shadow-md">
          <h3 className="text-lg font-semibold mb-2">Select Tags</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <label
                key={tag._id}
                className="flex items-center space-x-2 cursor-pointer"
              >
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

        {renderSearchInput(
          "address",
          "Address",
          addressSuggestions,
          setAddressSuggestions
        )}
        {renderSearchInput(
          "mainCity",
          "Center of City (Address)",
          mainCitySuggestions,
          setMainCitySuggestions
        )}

        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <label className="block text-gray-700 capitalize mb-2">
              Description
            </label>
            <button
              disabled={loader}
              type="button"
              onClick={generateDescription}
              className="mb-2 px-4 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md"
            >
              {loader ? "Generating..." : "Generate Description"}
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

        {renderArrayInput("images", "Images", "Enter image URL")}
        {renderArrayInput("videos", "Videos", "Enter video URL")}

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
          <p className="text-sm text-gray-500 mt-1">
            Hold Ctrl/Cmd to select multiple courses
          </p>
        </div>

        {formData.courseIds.length > 0 && (
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-2">Course Details</h3>
            {formData.courseIds.map((courseId, index) => (
              <div key={courseId} className="mb-4 border p-4 rounded-md">
                <label className="block text-gray-700 mb-2 font-medium">
                  {courses.find((c) => c._id === courseId)?.title || "Course"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Support Staff
                    </label>
                    <select
                      name={`supportId-${index}`}
                      value={formData.supportIds[index] || ""}
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
                    <label className="block text-gray-600 text-sm mb-1">
                      Fee Structure
                    </label>
                    <RadioGroup
                      row
                      name={`fee-unit-${index}`}
                      value={formData.fees[index]?.unit || "Year"}
                      onChange={handleChange}
                      className="mt-2"
                    >
                      <FormControlLabel
                        value="Year"
                        control={<Radio />}
                        label="Year"
                      />
                      <FormControlLabel
                        value="Semester"
                        control={<Radio />}
                        label="Semester"
                      />
                      <FormControlLabel
                        value="Course"
                        control={<Radio />}
                        label="Course"
                      />
                    </RadioGroup>
                    {(formData.fees[index]?.unit === "Year" ||
                      formData.fees[index]?.unit === "Semester") && (
                      <TextField
                        type="number"
                        name={`fee-duration-${index}`}
                        value={formData.fees[index]?.duration || ""}
                        onChange={handleChange}
                        label={
                          formData.fees[index]?.unit === "Year"
                            ? "Duration (Years)"
                            : "Number of Semesters"
                        }
                        variant="outlined"
                        size="small"
                        fullWidth
                        inputProps={{ min: 1 }}
                        required
                        className="mt-2"
                      />
                    )}
                    {(formData.fees[index]?.unit === "Year" ||
                      formData.fees[index]?.unit === "Semester") &&
                      formData.fees[index]?.duration && (
                        <div className="mt-2 space-y-2">
                          {Array.from(
                            {
                              length:
                                parseInt(formData.fees[index]?.duration) || 0,
                            },
                            (_, i) => (
                              <TextField
                                key={i}
                                type="number"
                                name={`fee-amount-${index}-${i}`}
                                value={formData.fees[index]?.amounts[i] || ""}
                                onChange={handleChange}
                                label={`${formData.fees[index]?.unit} ${
                                  i + 1
                                } Fee`}
                                variant="outlined"
                                size="small"
                                fullWidth
                                inputProps={{ min: 0 }}
                                required
                              />
                            )
                          )}
                          <TextField
                            type="number"
                            name={`fee-total-${index}`}
                            value={formData.fees[index]?.total || ""}
                            onChange={handleChange}
                            label="Total Fee"
                            variant="outlined"
                            size="small"
                            fullWidth
                            inputProps={{ min: 0 }}
                            className="mt-2"
                          />
                        </div>
                      )}
                    {formData.fees[index]?.unit === "Course" && (
                      <div className="mt-2 space-y-2">
                        <TextField
                          type="number"
                          name={`fee-amount-${index}-0`}
                          value={formData.fees[index]?.amounts[0] || ""}
                          onChange={handleChange}
                          label="Course Fee"
                          variant="outlined"
                          size="small"
                          fullWidth
                          inputProps={{ min: 0 }}
                          required
                        />
                        <TextField
                          type="number"
                          name={`fee-total-${index}`}
                          value={formData.fees[index]?.total || ""}
                          onChange={handleChange}
                          label="Total Fee"
                          variant="outlined"
                          size="small"
                          fullWidth
                          inputProps={{ min: 0 }}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Select Includes
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {feeTags.map((item) => (
                      <div key={item._id} className="flex items-center gap-2">
                        <Checkbox
                          checked={
                            (formData.fees[index]?.feeTags || []).includes(item.title)
                          }
                          onChange={(e) =>
                            handleFeeTagChange(index, item.title, e.target.checked)
                          }
                        />
                        <p>{item.title}</p>
                      </div>
                    ))}
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
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {editMode ? "Update College" : "Submit College"}
          </button>
        </div>
      </div>
      <Dialog fullWidth open={loader}>
        <div className="bg-transparent min-h-screen w-full flex flex-col justify-center items-center">
          <CircularProgress color="#15892e" />
          <h2>{loader ?? "Loading..."}</h2>
        </div>
      </Dialog>
    </div>
  );
};

export default AddCollege;