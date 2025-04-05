// src/pages/AddCourse.jsx
import React, { useState } from 'react';
import { collegeApi, getterFunction, posterFunction } from '../../../Api';
import Swal from 'sweetalert2';

const AddCourse = ({handleClose}) => {
  const [formData, setFormData] = useState({
    title: '',
    fee: '',
    Eligibility: '',
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await posterFunction(collegeApi.createCourse, formData)
        if(res.success){
            Swal.fire('Course added successfully!', '', 'success');
            setFormData({title: '', fee: '', Eligibility: ''});
            handleClose();
        }
    }catch(e){
        console.error('Error in submitting form:', e);
        Swal.fire({
            title: 'Error',
            text: e?.response?.data?.message || "Error in submitting form",
            icon: 'error',
            confirmButtonText: 'Okay'
        })
    }

  };

  return (
    <div className=" bg-gray-100 flex flex-col items-center justify-center p-4 ">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Add New Course</h2>

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
          <label className="block text-gray-700 mb-2">Fee</label>
          <input
            type="number"
            value={formData.fee}
            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Submit Course
        </button>
      </form>
      <div className='flex justify-center items-center mb-16 mt-4'>
    <button onClick={handleClose} className='bg-black text-center self-center px-4 py-1 rounded-sm hover:bg-slate-800 text-white'>Close</button>
    </div>
    </div>
  );
};

export default AddCourse;