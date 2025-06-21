import React, { useState } from "react";
import { collegeApi, posterFunction } from "../../../Api";
import Swal from "sweetalert2";

const SupportForm = ({handleClose}) => {
  const [formData, setFormData] = useState({ name: "", mobile: "" });

  const handleSubmit = async() => {
    
    try{
        const res = await posterFunction(collegeApi.createSupport, formData)
        if(res.success){
            Swal.fire('Support added successfully!', '', 'success');
            setFormData({ name: "", mobile: "" }); // Reset form after successful submission
        }
        handleClose();
    }catch(e){
        console.error("Error while submitting form", e);
        // Show error message to the user
  
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <p>Create Support </p>
      {["name", "mobile"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-gray-700 capitalize mb-2">{field}</label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required={field !== "description"}
            minLength={field === "description" ? 0 : 3}
          />
        </div>
      ))}
      <div onClick={handleClose} className="flex justify-between items-center">
        <button className="bg-slate-900 px-4 py-1 rounded-sm text-white hover:cursor-pointer hover:bg-slate-700">Close</button>
        <button onClick={()=>handleSubmit()} className="bg-slate-900 px-4 py-1 rounded-sm text-white hover:cursor-pointer hover:bg-slate-700">Submit</button>
      </div>
    </div>
  );
};

export default SupportForm;
