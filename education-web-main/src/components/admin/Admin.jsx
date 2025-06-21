import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

const Admin = () => {
  return (
    <div className="flex w-screen h-screen items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
        {/* Stand Alone Option */}
        <Link
          to="/admin/dashboard"
          className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 px-10 py-12 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center"
        >
          <FaBuilding size={48} className="mb-4" />
          <h2 className="text-2xl font-semibold">Standalone Admin Panel</h2>
          <p className="text-sm mt-2">Manage everything independently from here 🚀</p>
        </Link>

        {/* Bangalore Colleges Option */}
        <Link
          to="/admin/bnc/dashboard"
          className="bg-green-600 hover:bg-green-700 transition-all duration-300 px-10 py-12 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center"
        >
          <FaMapMarkerAlt size={48} className="mb-4" />
          <h2 className="text-2xl font-semibold">Bangalore Nursing Colleges</h2>
          <p className="text-sm mt-2">Explore & manage colleges based in Bangalore 🏥</p>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
