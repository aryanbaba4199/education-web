import React, { useState, useEffect } from 'react';
import { FaSearch, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import DatePicker from 'react-date-picker';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { getterFunction, userApi } from '../../../Api'; // Adjust path as needed

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDateRange, setShowDateRange] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRangeUsers, setDateRangeUsers] = useState([]);
  const pageSize = 50;

  // Fetch users for the current page
  const getUsers = async (pageNum) => {
    try {
      const res = await getterFunction(`${userApi.getAllUsers}/${pageNum}`);
      if (res.success) {
        setUsers(res.data.users || []);
        setFilteredUsers(res.data.users || []);
        setTotalPages(Math.ceil(res.data.total / pageSize) || 1);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  };

  // Fetch users by mobile number from backend
  const searchUsersByMobile = async () => {
    try {
      const res = await getterFunction(`${userApi.getUserByMobile}/${searchQuery}`);
      if (res.success && res.data) {
        setFilteredUsers([res.data]); // Show single user if found
      } else {
        setFilteredUsers([]);
        alert('No user found with this mobile number.');
      }
    } catch (e) {
      console.error('Error searching user by mobile:', e);
      alert('Error searching for user.');
    }
  };

  // Fetch users by date range
  const fetchUsersByDateRange = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    try {
      const res = await getterFunction(
        `${userApi.getUsersByDateRange}?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      if (res.success) {
        setDateRangeUsers(res.data || []);
      } else {
        alert('No users found in this date range.');
      }
    } catch (e) {
      console.error('Error fetching users by date range:', e);
      alert('Error fetching users.');
    }
  };

  useEffect(() => {
    getUsers(page);
  }, [page]);

  // Filter users client-side based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter((user) =>
        user.mobile.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  // Table columns
  const columns = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Mobile',
      selector: (row) => row.mobile,
      sortable: true,
    },
    {
      name: 'Registered On',
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  // Download functions
  const downloadExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const downloadPDF = (data, filename) => {
    const doc = new jsPDF();
    doc.text('Users Report', 20, 10);
    let y = 20;
    data.forEach((user, index) => {
      doc.text(
        `${index + 1}. ${user.name} - ${user.mobile} - ${new Date(user.createdAt).toLocaleDateString()}`,
        20,
        y
      );
      y += 10;
    });
    doc.save(`${filename}.pdf`);
  };

  const handleDownloadUsers = () => {
    setShowDateRange(true);
  };

  const handleExport = (format) => {
    const filename = `users_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
    if (format === 'excel') {
      downloadExcel(dateRangeUsers, filename);
    } else if (format === 'pdf') {
      downloadPDF(dateRangeUsers, filename);
    }
  };

  // Custom styles for react-data-table-component
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#e5e7eb', // bg-gray-200
        color: '#374151', // text-gray-700
        fontWeight: '600',
        padding: '16px',
      },
    },
    cells: {
      style: {
        padding: '16px',
        color: '#4b5563', // text-gray-600
      },
    },
    rows: {
      style: {
        '&:hover': {
          backgroundColor: '#f9fafb', // hover:bg-gray-50
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users Management</h1>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by mobile number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <button
          onClick={searchUsersByMobile}
          className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 flex items-center"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
        <button
          onClick={handleDownloadUsers}
          className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 flex items-center"
        >
          <FaDownload className="mr-2" />
          Download Users
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredUsers}
          customStyles={customStyles}
          noHeader
          highlightOnHover
          striped
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 disabled:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Date Range Modal */}
      {showDateRange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Date Range</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-teal-600" />
                <DatePicker
                  onChange={setStartDate}
                  value={startDate}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-teal-600" />
                <DatePicker
                  onChange={setEndDate}
                  value={endDate}
                  className="border border-gray-300 rounded-md p-2"
                />
              </div>
              <button
                onClick={fetchUsersByDateRange}
                className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700"
              >
                Fetch Users
              </button>
            </div>
            {dateRangeUsers.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Users: {dateRangeUsers.length}
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleExport('excel')}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 flex-1"
                  >
                    Download Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 flex-1"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowDateRange(false)}
              className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;