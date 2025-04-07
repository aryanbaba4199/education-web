import React, { useEffect, useState } from 'react';
import {
  FaUsers,
  FaSchool,
  FaUserTie,
  FaBook,
  FaImages,
  FaChartLine,
  FaDollarSign,
} from 'react-icons/fa';
import { collegeApi, getterFunction } from '../../../Api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  // Dummy data (replace with API calls later)
  const [dashData, setDashData] = useState(null);
  const navigate = useNavigate();
  const dashboardData = {
    userCount: 1250,
    collegeCount: 45,
    supportCount: 120,
    courseCount: 320,
    slideCount: 15,
    totalRevenue: 10, // In dollars
    activeUsers: 1,
  };

  useEffect(()=>{
    getDashboard();
  }, [])

  const getDashboard = async()=>{
    try{
        const res = await getterFunction(collegeApi.dashboard)
      if(res.success){
        setDashData(res.data)
      }
    }catch(e){
        console.error('Error getting dashboard:', e);
  
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className='flex justify-between items-center mb-6'>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className='flex gap-4 px-4'>
      <button onClick={()=>navigate('/colleges')} className='bg-gray-800 hover:bg-slate-700 px-2 py-1 rounded-md text-white'>Switch Account</button>
      <button onClick={()=>{
        localStorage.removeItem('eduadmintoken');
        localStorage.removeItem('eduutoken');
        navigate('/');
      }} className='bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md text-white'>Log out</button>
      </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Card */}
        <div onClick={()=>navigate('/admin/users')} className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <FaUsers className="text-4xl text-teal-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
            <p className="text-2xl font-bold text-gray-800">{dashData?.users}</p>
            <p className="text-sm text-gray-500">Registered users</p>
          </div>
        </div>

        {/* Colleges Card */}
        <div onClick={()=>navigate('/admin/college')} className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <FaSchool className="text-4xl text-teal-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Colleges</h2>
            <p className="text-2xl font-bold text-gray-800">{dashData?.colleges}</p>
            <p className="text-sm text-gray-500">Listed colleges</p>
          </div>
        </div>

        {/* Support Staff Card */}
        <div onClick={()=>navigate('/admin/college')} className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <FaUserTie className="text-4xl text-teal-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Support Staff</h2>
            <p className="text-2xl font-bold text-gray-800">{dashData?.supports}</p>
            <p className="text-sm text-gray-500">Active support members</p>
          </div>
        </div>

        {/* Courses Card */}
        <div onClick={()=>navigate('/admin/college')} className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <FaBook className="text-4xl text-teal-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Courses</h2>
            <p className="text-2xl font-bold text-gray-800">{dashData?.courses}</p>
            <p className="text-sm text-gray-500">Offered across colleges</p>
          </div>
        </div>

        {/* Slides Card */}
        <div onClick={()=>navigate('/admin/slider')} className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <FaImages className="text-4xl text-teal-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Slides</h2>
            <p className="text-2xl font-bold text-gray-800">{dashData?.slides}</p>
            <p className="text-sm text-gray-500">Promotional slides</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <FaDollarSign className="text-4xl text-teal-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-2xl font-bold text-gray-800">${dashboardData.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Generated revenue</p>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <FaChartLine className="text-4xl text-teal-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-700">Active Users</h2>
            <p className="text-2xl font-bold text-gray-800">{dashboardData.activeUsers}</p>
            <p className="text-sm text-gray-500">Currently active</p>
          </div>
        </div>
      </div>

      {/* Additional Sections (Optional) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity (Placeholder) */}
        <div className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            <li className="text-gray-600">User John Doe registered - 2 mins ago</li>
            <li className="text-gray-600">College XYZ added - 1 hour ago</li>
            <li className="text-gray-600">Support staff assigned - 3 hours ago</li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-lg hover:cursor-pointer hover:shadow-black  p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700">
              Add New College
            </button>
            <button className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700">
              Manage Users
            </button>
            <button className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700">
              Update Slides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;