import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaCheckCircle, FaQuestionCircle, FaEnvelope } from 'react-icons/fa';

const TermsAndCondition = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 sm:py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaFileContract className="text-6xl sm:text-7xl mx-auto mb-6 text-orange-500 animate-bounce" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
            Terms and Conditions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            By using Stand Alone App, you agree to our terms and conditions. Learn more about your responsibilities and our policies below.
          </p>
          <Link
            to="/contact-us"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-full transition duration-300 transform hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* Terms and Conditions Details */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold text-center mb-12">
            Our Terms of Use
          </h2>
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaCheckCircle className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  1. Use of Platform
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Stand Alone App is designed for personal use to explore colleges, plan travel routes, and receive admission guidance. Unauthorized commercial use, including reselling our services or data, is strictly prohibited and may result in account termination.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaCheckCircle className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  2. Accuracy of Information
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We strive to provide accurate and up-to-date information on colleges, courses, fees, and travel options. However, we are not responsible for errors, omissions, or changes made by third parties, such as colleges or transportation providers.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaCheckCircle className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  3. User Responsibilities
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Users must provide accurate information when using our platform and adhere to responsible usage practices. Misuse, such as submitting false data, attempting to harm the platform, or violating laws, may lead to account suspension or legal action.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaCheckCircle className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  4. Limitation of Liability
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Stand Alone App is not liable for any issues, losses, or damages arising from the use of our platform or reliance on the provided information. Users assume responsibility for decisions made based on our services.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaCheckCircle className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  5. Intellectual Property
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  All content, logos, and materials on Stand Alone App are protected by intellectual property laws. Users may not reproduce, distribute, or modify our content without prior written consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold text-center mb-12">
            Terms FAQs
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <FaQuestionCircle className="text-2xl sm:text-3xl text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                    Can I share my account with others?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Accounts are for individual use only. Sharing account credentials violates our terms and may result in suspension.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <FaQuestionCircle className="text-2xl sm:text-3xl text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                    What happens if I violate the terms?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Violations may lead to account suspension, termination, or legal action, depending on the severity of the breach.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <FaQuestionCircle className="text-2xl sm:text-3xl text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                    Can the terms change?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We may update our terms periodically. Users will be notified of significant changes via email or on the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold mb-6">
            Questions About Our Terms?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Our team is ready to clarify any questions you have about our terms and conditions.
          </p>
          <div className="flex justify-center">
            <Link
              to="/contact-us"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-full transition duration-300 transform hover:scale-105"
            >
              <FaEnvelope className="inline-block mr-2" /> Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Start Your Journey with Stand Alone App
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Explore colleges, plan travel, and secure admissions confidently, backed by our clear terms.
          </p>
          <Link
            to="/get-started"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-full transition duration-300 transform hover:scale-105"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default TermsAndCondition;