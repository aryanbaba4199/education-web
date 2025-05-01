import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";

import Home from "./components/user/Home";
import CollegeList from "./components/admin/College/College";
import AddCollege from "./components/admin/College/CollegeForm";
import AddCourse from "./components/admin/College/CourseForm";
import College from "./components/user/Colleges";
import CollegeDetails from "./components/user/CollegeDetails";
import Dashboard from "./components/admin/dashboard/Dashboard";
import BNCDashboard  from "./components/admin/bnc/Dashboard";
import BncCalls from "./components/admin/bnc/Calls";
import Users from "./components/admin/users/Users";
import Slider from "./components/admin/slider/Slider";
import ErrorBoundaryWrapper from "./components/user/ErrorBoundaryWrapper";
import PrivacyPolicy from "./components/user/Privacy";
import AdminCollegeDetails from "./components/admin/College/AdminCollegeDetails";
import Prompts from "./components/admin/dashboard/Prompts";
import Admin from "./components/admin/Admin";
import {Provider} from 'react-redux'
import Employees from "./components/admin/employee/Employees";
import store from "./redux/Store";


const ProtectedRoute = ({children})=>{
  const isAdmin = ()=>{
    try {
      const token = localStorage.getItem('eduadmintoken');
      return !!token;
    } catch (err) {
      console.error('Admin token check failed', err);
      return false;
    }
  }
  return isAdmin() ? children : <Navigate to="/" replace />;
}

const App = () => {
  const isAdmin = ()=>{
    try{
      const admin = localStorage.getItem('eduadmintoken');
      if(admin) return true;
    }catch(e){
      console.error('Error in admin check', e)
      return false;
    }
  }


  return (
    <Provider store={store}>
    <BrowserRouter>
    <ErrorBoundaryWrapper>
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/college-details" element={<CollegeDetails />} />
        <Route path="/colleges" element={<College />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
        <Route path="/admin/college" element={<ProtectedRoute><CollegeList /></ProtectedRoute>} />
        <Route path="/admin/collegeDetails/:collegeId" element={<ProtectedRoute><AdminCollegeDetails/></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/admin/slider" element={<ProtectedRoute><Slider /></ProtectedRoute>} />
        <Route path="/admin/prompts" element={<ProtectedRoute><Prompts /></ProtectedRoute>} />


        <Route path="/admin/bnc/dashboard" element={<ProtectedRoute><BNCDashboard/></ProtectedRoute>}/>
        <Route path="/admin/bnc/calls" element={<ProtectedRoute><BncCalls/></ProtectedRoute>}/>
        <Route path="/admin/bnc/employees" element={<ProtectedRoute><Employees/> </ProtectedRoute>}/>
      </Routes>
      </ErrorBoundaryWrapper>
    </BrowserRouter>
    </Provider>
  );
};

export default App;
