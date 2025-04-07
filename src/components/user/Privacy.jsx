import React from 'react';
import { FaLock, FaUser, FaPhone, FaWhatsapp, FaEnvelope, FaShieldAlt } from 'react-icons/fa';

const PrivacyPolicy = () => {

    const appDetails = JSON.parse(localStorage.getItem('appDetails'));
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaLock className="mr-3 text-blue-600" /> Privacy Policy
        </h1>
        <p className="text-gray-600 mb-8">
          Last Updated: April 07, 2025
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Introduction</h2>
          <p className="text-gray-600">
            Welcome to [Your App Name]! We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application to explore colleges and contact us for admission inquiries. By using our service, you agree to the terms outlined here.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-600" /> Information We Collect
          </h2>
          <p className="text-gray-600 mb-2">We collect the following information from users:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Personal Information</strong>: Your name and mobile number when you submit an inquiry form or contact us directly.</li>
            <li><strong>Communication Data</strong>: Details from your messages or calls via phone or WhatsApp for admission purposes.</li>
            <li><strong>Usage Data</strong>: Information about how you interact with our app (e.g., pages viewed), collected automatically.</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaPhone className="mr-2 text-blue-600" /> How We Use Your Information
          </h2>
          <p className="text-gray-600 mb-2">We use your information to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Facilitate college admission inquiries by connecting you with our team or college representatives.</li>
            <li>Respond to your requests via phone or WhatsApp.</li>
            <li>Improve our app’s functionality and user experience.</li>
            <li>Comply with legal obligations, if applicable.</li>
          </ul>
        </section>

        {/* How We Share Your Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaWhatsapp className="mr-2 text-blue-600" /> How We Share Your Information
          </h2>
          <p className="text-gray-600 mb-2">We may share your information with:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Colleges</strong>: To process your admission inquiry, we may share your name and mobile number with the relevant college or its representatives.</li>
            <li><strong>Service Providers</strong>: Third-party services (e.g., WhatsApp) used for communication.</li>
            <li><strong>Legal Authorities</strong>: If required by law or to protect our rights.</li>
          </ul>
          <p className="text-gray-600 mt-2">We do not sell your personal information to third parties.</p>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaShieldAlt className="mr-2 text-blue-600" /> Data Security
          </h2>
          <p className="text-gray-600">
            We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Rights</h2>
          <p className="text-gray-600 mb-2">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Request access to the personal information we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Withdraw consent for us to process your data (where applicable).</li>
          </ul>
          <p className="text-gray-600 mt-2">
            To exercise these rights, please contact us at the details provided below.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Third-Party Services</h2>
          <p className="text-gray-600">
            Our app may use third-party services like WhatsApp for communication. These services have their own privacy policies, and we encourage you to review them.
          </p>
        </section>

        {/* Changes to This Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Changes to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. Please check back periodically.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaEnvelope className="mr-2 text-blue-600" /> Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions or concerns about this Privacy Policy, please reach out to us:
          </p>
          <ul className="list-none text-gray-600 mt-2 space-y-2">
            <li className="flex items-center">
              <FaPhone className="mr-2 text-blue-600" /> Phone: {appDetails.mobile}
            </li>
            <li className="flex items-center">
              <FaWhatsapp className="mr-2 text-green-600" /> WhatsApp: {appDetails.whatsapp}
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-2 text-blue-600" /> Email: {appDetails.email}
            </li>
          </ul>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8">
          &copy; 2025 Stand Alone. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;