import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
  FaUser,
  FaCheck,
} from "react-icons/fa";
import { collegeApi, getterFunction, posterFunction, userApi } from "../../Api"; // Adjust path as needed
import Swal from "sweetalert2";

const Home = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fade, setFade] = useState(true); // Control fade effect
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
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setFade(false); // Start fade out
        setTimeout(() => {
          setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
          setFade(true); // Fade in new image
        }, 500); // Wait for fade out (0.5s) before changing image
      }, 3000); // Total cycle every 3 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [slides]);

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
      navigate("/admin/dashboard");
    }else if(userToken){
      navigate("/colleges");
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Slideshow Card */}
      <div className="h-1/4 bg-white shadow-md border-b border-gray-200">
        <div className="flex justify-center items-center h-full">
          {slides.length > 0 ? (
            <img
              src={slides[currentSlideIndex].image}
              alt="Slide"
              className={`w-full h-[340px] object-cover transition-opacity duration-500 ${
                fade ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <img
              src="https://i.pinimg.com/736x/70/42/f8/7042f811eba5fdd333382d89b9521cca.jpg"
              alt="Default"
              className="w-full h-[340px] object-cover"
            />
          )}
        </div>
      </div>

      {/* Form or Welcome Message */}
      {!isSubmitted ? (
        <div className="flex-1 flex justify-center items-center p-5">
          <div className="w-full max-w-md space-y-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-600" />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !mobile.trim()}
              className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              <FaCheck className="mr-2" />
              Submit
            </button>
            {localStorage.getItem("eduadmintoken") && (
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-gray-800 hover-bg-gray-700 rounded-sm px-8 py-1 self-center text-white"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center gap-5">
          <FaCheckCircle className="text-teal-600 text-5xl" />
          <h2 className="text-3xl font-semibold text-teal-600">
            Welcome, {name}!
          </h2>
          <button
            onClick={() => navigate("/colleges")}
            className="bg-teal-100 text-teal-600 py-2 px-4 rounded-md hover:bg-teal-200"
          >
            Colleges
          </button>
        </div>
      )}

      {/* Advertiser Contact Details */}
      <div className="p-4 bg-white shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Contact Advertiser
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <FaPhone className="text-teal-600" />
          <span className="text-gray-600">{advertiser.phone}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleCall}
            className="flex-1 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 flex items-center justify-center"
          >
            <FaPhone className="mr-2" />
            Call
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 flex items-center justify-center"
          >
            <FaWhatsapp className="mr-2" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
