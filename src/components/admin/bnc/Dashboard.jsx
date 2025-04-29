import React, { useEffect, useState } from "react";
import { bncApi, getterFunction, posterFunction } from "../../../Api";
import {
  FaUsers,
  FaUserGraduate,
  FaPhone,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
  FaPhoneSlash,
  FaStar,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(2);
  const [dateRange, setDateRange] = useState([null, null]); // [startDate, endDate]
  const [users, setUsers] = useState([]);
  const [forthedate, setForTheDate] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const navigate = useNavigate();

  const getDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getterFunction(bncApi.adminDashboard);
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError("Failed to fetch dashboard data");
      }
    } catch (e) {
      console.error("Error in getting dashboard:", e);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const getTodaysData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getterFunction(bncApi.gettoadysdata);
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError("Failed to fetch today's data");
      }
    } catch (e) {
      console.error("Error in getting today's data:", e);
      setError("An error occurred while fetching today's data");
    } finally {
      setLoading(false);
    }
  };

  const getDateData = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const res = await posterFunction(bncApi.getStatement, {
        fromDate: startDate.format("YYYY-MM-DD"),
        toDate: endDate.format("YYYY-MM-DD"),
      });
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError("Failed to fetch date range data");
      }
    } catch (e) {
      console.error("Error in getting date range data:", e);
      setError("An error occurred while fetching date range data");
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedEmployeeId("");
      setDashboardData(null);
      const res = await getterFunction(bncApi.getUsers);
      if (res.success) {
        setEmployees(res.data || []);
      } else {
        setError("Failed to fetch employees");
      }
    } catch (e) {
      console.error("Error in getting employees:", e);
      setError("An error occurred while fetching employees");
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeData = async (employeeId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getterFunction(
        `${bncApi.getuserDashboard}/${employeeId}`
      );
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError("Failed to fetch employee data");
      }
    } catch (e) {
      console.error("Error in getting employee data:", e);
      setError("An error occurred while fetching employee data");
    } finally {
      setLoading(false);
    }
  };

  const tabButtons = [
    { title: "All", value: 1 },
    { title: "Today", value: 2 },
    { title: "Statement", value: 3 },
    { title: "Employees", value: 4 },
  ];

  const handleClick = (item) => {
    setActiveTab(item.value);
    if (item.value === 1) {
      setEmployees([]);
      setSelectedEmployeeId("");
      getDashboard();
    } else if (item.value === 2) {
      setEmployees([]);
      setSelectedEmployeeId("");
      getTodaysData();
    } else if (item.value === 3) {
      setEmployees([]);
      setSelectedEmployeeId("");
      setDashboardData(null);
      setDateRange([null, null]); // Reset date range
    } else if (item.value === 4) {
      getUsers();
    }
  };

  const handleEmployeeDateChange = async () => {
    setLoading(true);
    try {
      const date = forthedate.format("YYYY-MM-DD");
      const res = await posterFunction(bncApi.getuserDateDashboard, {
        date,
        id: selectedEmployeeId,
      });
      if (res.success) {
        setDashboardData(res.data.data);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Error fetching employee dashboard for selected date:", e);
    }
  };

  const handleEmployeeSelect = (event) => {
    const employeeId = event.target.value;
    setSelectedEmployeeId(employeeId);
    if (employeeId) {
      getEmployeeData(employeeId);
    } else {
      setDashboardData(null);
    }
  };

  const handleDateSubmit = () => {
    const [startDate, endDate] = dateRange;
    if (startDate && endDate) {
      if (endDate.isBefore(startDate)) {
        setError("End date cannot be before start date");
        return;
      }
      getDateData(startDate, endDate);
    } else {
      setError("Please select a date range");
    }
  };

  useEffect(() => {
    getTodaysData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f5f5"
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  const handleCardClick = (num) => {
    if (activeTab === 1) {
      navigate(`/admin/bnc/calls?tabIndex=${num}`);
    }
    if (activeTab === 2) {
      navigate(`/admin/bnc/calls?tabIndex=${num}&tabType=today`);
    }
    if (activeTab === 3) {
      const [startDate, endDate] = dateRange;
      if (!startDate || !endDate) {
        setError("Please select a date range");
        return;
      }
      navigate(
        `/admin/bnc/calls?tabIndex=${num}&tabType=statement&fromDate=${startDate.format(
          "YYYY-MM-DD"
        )}&toDate=${endDate.format("YYYY-MM-DD")}`
      );
    }
    if (activeTab === 4) {
      navigate(`/admin/bnc/calls?tabIndex=${num}&tabType=employee`);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-7xl mx-auto">
        <div className="flex md:flex-row flex-col mb-8 justify-between items-center">
          <Typography variant="h4" className="font-bold text-gray-800 mb-6">
            Admin Dashboard
          </Typography>
          <div className="flex gap-4">
            <Link
              className="px-4 py-1 rounded-sm bg-gray-600 hover:bg-gray-700 text-white"
              to="/admin/bnc/calls"
            >
              Calls
            </Link>
            <Link
              className="px-4 py-1 rounded-sm bg-gray-600 hover:bg-gray-700 text-white"
              to="/admin/bnc/createuser"
            >
              Create Employee
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabButtons.map((item, index) => (
            <button
              key={index}
              onClick={() => handleClick(item)}
              className={`px-8 py-1 flex-1 ${
                activeTab === item.value ? "bg-slate-600" : "bg-slate-800"
              } text-white hover:bg-slate-700 rounded-md`}
            >
              {item.title}
            </button>
          ))}
        </div>
        {error ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={3}
          >
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => {
                    if (activeTab === 3) {
                      setError(null);
                      return;
                    }
                    window.location.reload();
                  }}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </Box>
        ) : (
          <>
            {activeTab === 3 && (
              <Box className="mb-6 p-4 bg-white rounded-xl shadow-lg">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    <DateRangePicker
                      value={dateRange}
                      onChange={(newValue) => setDateRange(newValue)}
                      renderInput={(startProps, endProps) => (
                        <>
                          <TextField {...startProps} label="Start Date" />
                          <Box sx={{ mx: 2 }}> to </Box>
                          <TextField {...endProps} label="End Date" />
                        </>
                      )}
                    />
                    <Button
                      variant="contained"
                      onClick={handleDateSubmit}
                      disabled={!dateRange[0] || !dateRange[1]}
                    >
                      Fetch Data
                    </Button>
                  </Box>
                </LocalizationProvider>
              </Box>
            )}

            {activeTab === 4 && employees.length > 0 && (
              <Box className="mb-6 p-4 bg-white rounded-xl shadow-lg">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                  Select Employee
                </Typography>
                <div className="flex md:flex-row flex-col justify-between items-center md:px-8 px-2">
                  <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel id="employee-select-label">Employee</InputLabel>
                    <Select
                      labelId="employee-select-label"
                      value={selectedEmployeeId}
                      label="Employee"
                      onChange={handleEmployeeSelect}
                    >
                      <MenuItem value="">
                        <em>Select an employee</em>
                      </MenuItem>
                      {employees.map((employee) => (
                        <MenuItem key={employee._id} value={employee._id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <div className="gap-2">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateRangePicker
                        label="Date"
                        value={forthedate}
                        onChange={(newValue) => setForTheDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <div className="m-2">
                      <Button variant="outlined" onClick={handleEmployeeDateChange}>
                        Fetch Data
                      </Button>
                    </div>
                  </div>
                </div>
              </Box>
            )}

            {(activeTab !== 4 || selectedEmployeeId || employees.length === 0) && (
              <div className="flex flex-wrap md:flex-row flex-col gap-4">
                {/* Total Users */}
                {activeTab === 1 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => setActiveTab(4)}
                    >
                      <Card
                        className="bg-white w-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                        sx={{ display: "flex", alignItems: "center", p: 2 }}
                      >
                        <Box className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                          <FaUsers size={24} />
                        </Box>
                        <CardContent className="p-0">
                          <Typography variant="body2" color="textSecondary">
                            Total Users
                          </Typography>
                          <Typography
                            variant="h5"
                            className="font-bold text-gray-800"
                          >
                            {dashboardData?.totalUsers || 0}
                          </Typography>
                        </CardContent>
                      </Card>
                    </span>
                  </Grid>
                )}

                {/* Total Admissions */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => handleCardClick(5)}
                  >
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ display: "flex", alignItems: "center", p: 2 }}
                    >
                      <Box className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <FaUserGraduate size={24} />
                      </Box>
                      <CardContent className="p-0">
                        <Typography variant="body2" color="textSecondary">
                          Total Admissions
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-800"
                        >
                          {dashboardData?.totalAdmissions ?? 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </span>
                </Grid>

                {/* Total Calls */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => handleCardClick(0)}
                  >
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ display: "flex", alignItems: "center", p: 2 }}
                    >
                      <Box className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                        <FaPhone size={24} />
                      </Box>
                      <CardContent className="p-0">
                        <Typography variant="body2" color="textSecondary">
                          {activeTab === 2
                            ? "Today's"
                            : activeTab === 3
                            ? "Selected Period"
                            : activeTab === 4
                            ? "Employee"
                            : "Total"}{" "}
                          Calls
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-800"
                        >
                          {dashboardData?.totalCalls || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </span>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => handleCardClick(6)}
                  >
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ display: "flex", alignItems: "center", p: 2 }}
                    >
                      <Box className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                        <FaClock size={24} />
                      </Box>
                      <CardContent className="p-0">
                        <Typography variant="body2" color="textSecondary">
                          Missed Follow-ups
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-800"
                        >
                          {dashboardData?.expiredFollowups || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </span>
                </Grid>

                {/* Interested */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => handleCardClick(1)}
                  >
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ display: "flex", alignItems: "center", p: 2 }}
                    >
                      <Box className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                        <FaThumbsUp size={24} />
                      </Box>
                      <CardContent className="p-0">
                        <Typography variant="body2" color="textSecondary">
                          Interested
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-800"
                        >
                          {dashboardData?.intrested || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </span>
                </Grid>

                {/* Not Interested */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => handleCardClick(2)}
                  >
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ display: "flex", alignItems: "center", p: 2 }}
                    >
                      <Box className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                        <FaThumbsDown size={24} />
                      </Box>
                      <CardContent className="p-0">
                        <Typography variant="body2" color="textSecondary">
                          Not Interested
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-800"
                        >
                          {dashboardData?.notIntrested || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </span>
                </Grid>

                {/* Not Connected */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => handleCardClick(3)}
                  >
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ display: "flex", alignItems: "center", p: 2 }}
                    >
                      <Box className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <FaPhoneSlash size={24} />
                      </Box>
                      <CardContent className="p-0">
                        <Typography variant="body2" color="textSecondary">
                          Not Connected
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-800"
                        >
                          {dashboardData?.notConnected || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </span>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => handleCardClick(4)}
                  >
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ display: "flex", alignItems: "center", p: 2 }}
                    >
                      <Box className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <FaPhoneSlash size={24} />
                      </Box>
                      <CardContent className="p-0">
                        <Typography variant="body2" color="textSecondary">
                          Invalid Numbers
                        </Typography>
                        <Typography
                          variant="h5"
                          className="font-bold text-gray-800"
                        >
                          {dashboardData?.invalid || 0}
                        </Typography>
                      </CardContent>
                    </Card>
                  </span>
                </Grid>

                {/* Best/Worst User */}
                {activeTab === 1 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                      sx={{ p: 2 }}
                    >
                      <CardContent className="p-0">
                        <Box display="flex" alignItems="center" mb={2}>
                          <Box className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                            <FaStar size={24} />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Best Employee
                            </Typography>
                            <Typography
                              variant="h6"
                              className="font-semibold text-gray-800"
                            >
                              {dashboardData?.eod
                                ? dashboardData?.eod.name
                                : "None"}
                            </Typography>
                          </Box>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Box className="p-3 rounded-full bg-gray-100 text-gray-600 mr-4">
                            <FaStar size={24} />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              Worst Employee
                            </Typography>
                            <Typography
                              variant="h6"
                              className="font-semibold text-gray-800"
                            >
                              {dashboardData?.weod
                                ? dashboardData.weod.name
                                : "None"}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </div>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;