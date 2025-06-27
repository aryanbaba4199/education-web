import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
  FaUser,
  FaCheck,
} from "react-icons/fa";
import { collegeApi, getterFunction, posterFunction, userApi } from "../../Api"; // Adjust path as needed
import Swal from "sweetalert2";

const HandleUser = () => {

  const location = useLocation();

      const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [slides, setSlides] = useState([]);

  const navigate = useNavigate();

  // Dummy advertiser data
  const advertiser = {
    phone: "+91-7005742790",
    whatsapp: "+917005742790",
    adContent: "Special Offer: 20% Off Today Only!",
  };

  useEffect(() => {
    verifyToken();
    getSlide();
    getAppDetails();
  }, []);


  const getAppDetails = async () => {
    try{
      const res = await getterFunction(collegeApi.getAppDetails);
      if(res.success){
        localStorage.setItem('appDetails', JSON.stringify(res.data));
      }
    }catch(e){
      console.error("Error getting app ", e);
    }
  }

  
  const getSlide = async () => {
    try {
      const res = await getterFunction(collegeApi.getSlide);
      if (res.success) {
        const sortedSlides = res.data.sort((a, b) => a.rank - b.rank);
        setSlides(sortedSlides);
      }
    } catch (e) {
      console.error("Error getting slide", e);
    }
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("eduadmintoken");
    const userToken = localStorage.getItem("edutoken");
    console.log("Verifying", token, userToken);
    if (token) {
      navigate("/admin");
    }else if(userToken){
      navigate("/");
    }
  };



  const handleSubmit = async () => {
    try {
      if (mobile == "727798") {
        const { value: formValues } = await Swal.fire({
          title: "Admin Login",
          html: `
          <input type="text" id="swal-input-id" class="swal2-input" placeholder="Enter ID">
          <input type="password" id="swal-input-password" class="swal2-input" placeholder="Enter Password">
        `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Submit",
          preConfirm: () => {
            return {
              id: document.getElementById("swal-input-id").value,
              password: document.getElementById("swal-input-password").value,
            };
          },
        });

        if (formValues) {
          console.log("ID:", formValues.id);
          console.log("Password:", formValues.password);
          const res = await posterFunction(userApi.adminLogin, formValues);
          if (res.success) {
            Swal.fire({
              title: "Success",
              text: "Admin authenticated successfully!",
              icon: "success",
            });
            localStorage.setItem("eduadmintoken", res.data);
            localStorage.setItem("edutoken", res.data);
            navigate("/admin/dashboard");
          }
          return;
        }
      }

      const formData = { name, mobile };
      const res = await posterFunction(userApi.createUser, formData);
      console.log(res.data);

      if (res.success) {
        setIsSubmitted(true);
  
        localStorage.setItem("edutoken", res.data);
        navigate("/colleges");
      }
    } catch (e) {
      console.error("Failed to submit form", e);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${advertiser.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${advertiser.whatsapp}`, "_blank");
  };

  

  return (
    <div className="min-h-[80vh] bg-gray-100 flex justify-center items-center px-4 py-10">
  <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
    {/* Left: Form / Welcome */}
    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
      {!isSubmitted ? (
        <>
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">
            Get Started
          </h2>
          <div className="relative mb-3">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 py-1.5 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
            />
          </div>
          <div className="relative mb-4">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full pl-10 py-1.5 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 text-sm"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !mobile.trim()}
            className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center text-sm mb-3"
          >
            <FaCheck className="mr-2 text-xs" />
            Submit
          </button>
          {localStorage.getItem("eduadmintoken") && (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-gray-800 hover:bg-gray-700 rounded-sm px-6 py-1 text-white text-sm mx-auto block"
            >
              Admin Panel
            </button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <FaCheckCircle className="text-teal-600 text-5xl" />
          <h2 className="text-2xl font-semibold text-teal-700">Welcome, {name}!</h2>
          <button
            onClick={() => navigate("/colleges")}
            className="bg-teal-600 text-white px-5 py-2 rounded hover:bg-teal-700 text-sm"
          >
            Browse Colleges
          </button>
        </div>
      )}
    </div>

    {/* Right: Contact Advertiser */}
    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Need Help?</h3>
      <p className="text-sm text-gray-600 mb-4">
        Contact our team for any assistance or offers!
      </p>
      <div className="flex items-center gap-2 mb-3">
        <FaPhone className="text-teal-600" />
        <span className="text-gray-700">{advertiser.phone}</span>
      </div>
      <div className="flex gap-3 mb-2">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm"
        >
          <FaPhone />
          Call Now
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md text-sm"
        >
          <FaWhatsapp />
          WhatsApp
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Available on WhatsApp 24/7.
      </p>
    </div>
  </div>
</div>

  )
}

export default HandleUser;
