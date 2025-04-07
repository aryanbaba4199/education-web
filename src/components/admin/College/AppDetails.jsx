import React, { useState, useEffect } from 'react';
import { collegeApi, getterFunction, posterFunction, updaterFunction } from '../../../Api';
import { FaPhone, FaWhatsapp, FaEnvelope, FaEdit, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AppDetails = ({handleClose}) => {
  const [appDetails, setAppDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    whatsapp: '',
    email: '',
    contactTitle: '',
  });

  useEffect(() => {
    getAppDetails();
  }, []);

  const getAppDetails = async () => {
    try {
      const res = await getterFunction(collegeApi.getAppDetails);
      if (res.success) {
        setAppDetails(res.data);
        setFormData({
          mobile: res.data.mobile || '',
          whatsapp: res.data.whatsapp || '',
          email: res.data.email || '',
          contactTitle: res.data.contactTitle || '',
        });
      }
    } catch (e) {
      console.error('Error fetching app details:', e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (appDetails) {
        // Update existing details
        res = await updaterFunction(`${collegeApi.updateAppDetails}/${appDetails._id}`, formData);
        if (res?.success) {
          Swal.fire({
            title: 'App Details Updated!',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
        }
      } else {
        // Create new details
        res = await posterFunction(collegeApi.createAppDetails, formData);
        if (res?.success) {
          Swal.fire({
            title: 'App Details Created!',
            icon: 'success',
            confirmButtonText: 'Okay',
          });
        }
      }
      setAppDetails(res.data);
      setIsEditing(false);
      getAppDetails(); // Refresh details
    } catch (e) {
      console.error('Error submitting app details:', e);
      Swal.fire({
        title: 'Error',
        text: `Failed to ${appDetails ? 'update' : 'create'} app details.`,
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1 flex items-center">
          <FaPhone className="mr-2 text-blue-600" /> Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1 flex items-center">
          <FaWhatsapp className="mr-2 text-green-600" /> WhatsApp Number
        </label>
        <input
          type="tel"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1 flex items-center">
          <FaEnvelope className="mr-2 text-blue-600" /> Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Contact Title</label>
        <input
          type="text"
          name="contactTitle"
          value={formData.contactTitle}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-blue-700"
        >
          {appDetails ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );

  const renderDetails = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">App Contact Details</h2>
      <p className="flex items-center text-gray-700">
        <FaPhone className="mr-2 text-blue-600" /> <strong>Mobile:</strong> {appDetails.mobile}
      </p>
      {appDetails.whatsapp && (
        <p className="flex items-center text-gray-700">
          <FaWhatsapp className="mr-2 text-green-600" /> <strong>WhatsApp:</strong> {appDetails.whatsapp}
        </p>
      )}
      {appDetails.email && (
        <p className="flex items-center text-gray-700">
          <FaEnvelope className="mr-2 text-blue-600" /> <strong>Email:</strong> {appDetails.email}
        </p>
      )}
      {appDetails.contactTitle && (
        <p className="text-gray-700">
          <strong>Contact Title:</strong> {appDetails.contactTitle}
        </p>
      )}
      <div className='flex justify-between items-center'>
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        <FaEdit className="mr-2" /> Edit Details
      </button>
      <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Close
        </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {isEditing || !appDetails ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaPlus className="mr-2 text-blue-600" /> {appDetails ? 'Edit App Details' : 'Create App Details'}
            </h2>
            {renderForm()}
          </>
        ) : (
          renderDetails()
        )}
      </div>
    </div>
  );
};

export default AppDetails;