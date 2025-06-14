import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaShieldAlt, FaQuestionCircle, FaEnvelope } from 'react-icons/fa';

const PrivacyAndPolicy = () => {
  return (
    <div className="bg-gray-100 w-full min-h-screen font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 sm:py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaLock className="text-6xl sm:text-7xl mx-auto mb-6 text-orange-500 animate-bounce" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            At Stand Alone App, your privacy is our priority. Learn how we collect, use, and protect your data.
          </p>
          
        </div>
      </section>

      {/* Privacy Policy Details */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-blue-900 font-bold text-center mb-12">
            Our Commitment to Your Privacy
          </h2>
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaShieldAlt className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  1. Information We Collect
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We collect personal information such as your name, email, and location to provide personalized college recommendations, travel guidance, and admission support. This includes data you voluntarily provide and information collected automatically (e.g., IP address, device type) to enhance your experience.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaShieldAlt className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  2. How We Use Your Information
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your data is used to deliver tailored services, including college details, real-time travel routes, and admission assistance. We may also use it to improve our platform, send relevant updates, or respond to your inquiries. We do not share your information with third parties without your explicit consent, except as required by law.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaShieldAlt className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  3. Data Security
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  We implement industry-standard security measures, including encryption and secure servers, to protect your data from unauthorized access, disclosure, or misuse. While we strive to ensure your data’s safety, no online platform can guarantee absolute security.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <FaShieldAlt className="text-3xl sm:text-4xl text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl sm:text-2xl text-blue-900 font-semibold mb-2">
                  4. Your Rights
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  You have the right to access, update, or delete your personal information. You can also opt out of marketing communications or request data portability. To exercise these rights, contact us at <a href="mailto:support@standaloneapp.com" className="text-orange-500 hover:underline">support@standaloneapp.com</a>.
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
            Privacy FAQs
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <FaQuestionCircle className="text-2xl sm:text-3xl text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                    How long do you store my data?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We retain your data only as long as necessary to provide our services or as required by law. You can request deletion at any time.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <FaQuestionCircle className="text-2xl sm:text-3xl text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                    Do you use cookies?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Yes, we use cookies to enhance your experience, such as remembering preferences and analyzing site usage. You can manage cookie settings in your browser.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start space-x-4">
                <FaQuestionCircle className="text-2xl sm:text-3xl text-orange-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl text-blue-900 font-semibold mb-2">
                    Can I opt out of data sharing?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We only share data with your consent or as legally required. You can opt out of optional data sharing via your account settings or by contacting us.
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
            Have Questions About Your Privacy?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Our team is here to help. Reach out to us for any privacy-related inquiries.
          </p>
          <div className="flex justify-center">
            
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Trust Stand Alone App with Your Journey
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Explore colleges, plan travel, and secure admissions with confidence, knowing your data is protected.
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 rounded-full transition duration-300 transform hover:scale-105"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PrivacyAndPolicy;