import React, { useState,useEffect } from 'react';
import { FaChevronDown, FaChevronUp, FaLock } from 'react-icons/fa';
import Footer from './Footer'; 

const faqs = [
  {
    question: 'What personal data do you collect?',
    answer: 'We collect your name, email, phone number, location data, and educational preferences to personalize your experience.',
  },
  {
    question: 'Is my data shared with third parties?',
    answer: 'No, we do not share your personal data with third-party vendors without your explicit consent.',
  },
  {
    question: 'How is my data protected?',
    answer: 'We use industry-standard encryption and secure cloud storage to keep your data safe.',
  },
  {
    question: 'Can I delete my account and data?',
    answer: 'Yes, you can request deletion of your account and all associated data by contacting our support team.',
  },
  {
    question: 'Do you track my location?',
    answer: 'Only with your permission, and solely to provide relevant content and nearby college suggestions.',
  },
  {
    question: 'What cookies do you use?',
    answer: 'We use session and analytical cookies to understand usage patterns and enhance performance.',
  },
  {
    question: 'How long is my data retained?',
    answer: 'We retain your data as long as your account is active or for legal compliance—whichever is longer.',
  },
  {
    question: 'Can I access my stored data?',
    answer: 'Yes, you can download a copy of your data anytime from your account settings.',
  },
  {
    question: 'How do you handle data breaches?',
    answer: 'We immediately notify affected users and authorities, and take necessary containment steps within 72 hours.',
  },
  {
    question: 'Are children’s data handled differently?',
    answer: 'Yes, we require parental consent for users under 13 and follow COPPA/GDPR-K regulations.',
  },
  {
    question: 'Do you use biometric data?',
    answer: 'No, we do not collect or store biometric data at this time.',
  },
  {
    question: 'Can I update my privacy settings?',
    answer: 'Absolutely! Visit your profile > privacy settings to control your data visibility and preferences.',
  },
  {
    question: 'Do you collect educational history?',
    answer: "Only if voluntarily provided, and it's used strictly to recommend suitable colleges or programs.",
  },
  {
    question: 'How often is the privacy policy updated?',
    answer: 'We update it periodically. Users are notified of major changes via email or in-app alerts.',
  },
  {
    question: 'Is my data used for AI recommendations?',
    answer: 'Yes, anonymized data is used to personalize college suggestions and content recommendations.',
  },
  {
    question: 'Can I opt out of promotional emails?',
    answer: 'Yes, there is an unsubscribe link at the bottom of every promotional email.',
  },
  {
    question: 'Who has access to my data internally?',
    answer: 'Only authorized personnel under strict confidentiality agreements can access your data.',
  },
  {
    question: 'Is my payment information stored?',
    answer: 'We do not store payment data. Transactions are securely handled by trusted third-party gateways.',
  },
  {
    question: 'What rights do I have under GDPR/Indian IT Act?',
    answer: 'You have the right to access, rectify, delete, and restrict processing of your personal data.',
  },
  {
    question: 'How can I contact the Data Protection Officer?',
    answer: 'Email us at privacy@yourwebsite.com with the subject line: "DPO Request".',
  },
];

const ViewFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

useEffect(() => {
  window.scrollTo(0, 0);
}, []);


  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-8 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaLock className="text-blue-700 text-4xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900">Privacy & Data FAQ</h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Clear answers to your most pressing privacy questions.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md transition duration-300 p-6 hover:shadow-lg"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800">{faq.question}</h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-blue-700" />
                ) : (
                  <FaChevronDown className="text-blue-700" />
                )}
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-700 text-sm sm:text-base">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewFAQ;
