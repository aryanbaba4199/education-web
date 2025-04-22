import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaLock,
} from 'react-icons/fa';
import { bncApi, posterFunction } from '../../../Api';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'employee',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.mobile && !/^\+?\d{10,15}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Invalid mobile number (10-15 digits)';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setApiError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);
      setSuccessMessage(null);
      const res = await posterFunction(bncApi.createUser, formData);
      if (res.success) {
        setSuccessMessage(res.message || 'User created successfully!');
        setFormData({
          name: '',
          email: '',
          mobile: '',
          designation: 'employee',
          password: '',
        });
      } else {
        setApiError(res.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setApiError('An error occurred while creating the user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Box className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <Typography
          variant="h4"
          className="text-center font-bold text-gray-800 mb-6"
        >
          Create User
        </Typography>

        {apiError && (
          <Alert severity="error" className="mb-4">
            {apiError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <Box className="flex items-center space-x-2">
            <FaUser className="text-gray-600 text-xl" />
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              className="bg-gray-50"
            />
          </Box>

          {/* Email Field */}
          <Box className="flex items-center space-x-2">
            <FaEnvelope className="text-gray-600 text-xl" />
            <TextField
              fullWidth
              label="Email"
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              className="bg-gray-50"
            />
          </Box>

          {/* Mobile Field */}
          <Box className="flex items-center space-x-2">
            <FaPhone className="text-gray-600 text-xl" />
            <TextField
              fullWidth
              label="Mobile (optional)"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              error={!!errors.mobile}
              helperText={errors.mobile}
              variant="outlined"
              className="bg-gray-50"
            />
          </Box>

          {/* Designation Field */}
          <Box className="flex items-center space-x-2">
            <FaBriefcase className="text-gray-600 text-xl" />
            <FormControl fullWidth variant="outlined" className="bg-gray-50">
              <InputLabel id="designation-label">Designation</InputLabel>
              <Select
                labelId="designation-label"
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="freelancer">Freelancer</MenuItem>
              
              </Select>
            </FormControl>
          </Box>

          {/* Password Field */}
          <Box className="flex items-center space-x-2">
            <FaLock className="text-gray-600 text-xl" />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              className="bg-gray-50"
            />
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="py-3 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Create User'
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default CreateUser;