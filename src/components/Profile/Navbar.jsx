import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaGraduationCap } from 'react-icons/fa';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo and Brand Name */}
                    <Link to="/" className="flex items-center ">
                        <img
                            src="/logo.png"
                            alt="Stand Alone App Logo"

                            className="h-10 mr-4 w-10 object-contain rounded-full"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/40?text=Logo')}
                        />
                        <span className="text-xl sm:text-2xl font-bold tracking-tight">
                            Stand Alone App
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-base font-medium hover:text-orange-500 transition duration-300"
                        >
                            Home
                        </Link>
                        <Link
                            to="/about-us"
                            className="text-base font-medium hover:text-orange-500 transition duration-300"
                        >
                            About Us
                        </Link>

                        <Link
                            to="/privacy-policy"
                            className="text-base font-medium hover:text-orange-500 transition duration-300"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/terms-and-conditions"
                            className="text-base font-medium hover:text-orange-500 transition duration-300"
                        >
                            Terms & Condition
                        </Link>
                        <Link
                            to="/"
                            className="bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-4 py-2 rounded-full transition duration-300 transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white focus:outline-none"
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMobileMenuOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden bg-blue-900 text-white transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
            >
                <div className="flex flex-col items-center space-y-4 py-4">



                    <Link
                        to="/about-us"
                        className="text-base font-medium hover:text-orange-500 transition duration-300"
                        onClick={toggleMobileMenu}
                    >
                        Home
                    </Link>

                    <Link
                        to="/about-us"
                        className="text-base font-medium hover:text-orange-500 transition duration-300"
                        onClick={toggleMobileMenu}
                    >
                        About Us
                    </Link>



                    <Link
                        to="/privacy-policy"
                        className="text-base font-medium hover:text-orange-500 transition duration-300"
                        onClick={toggleMobileMenu}
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="/terms-and-condition"
                        className="text-base font-medium hover:text-orange-500 transition duration-300"
                        onClick={toggleMobileMenu}
                    >
                        Terms
                    </Link>
                    <Link
                        to="/"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-4 py-2 rounded-full transition duration-300"
                        onClick={toggleMobileMenu}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;