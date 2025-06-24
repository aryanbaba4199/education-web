
import React, { useEffect, useState } from 'react';
import { bncApi, getterFunction, posterFunction } from '../../../Api';
import {
  FaUsers,
  FaUserGraduate,
  FaPhone,
  FaClock,
  FaThumbsUp,
  FaThumbsDown,
  FaPhoneSlash,
  FaStar,
  FaChartPie,
  FaCalendarAlt,
  FaUserTie,
  FaList,
  FaRegWindowRestore,
} from 'react-icons/fa';
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
  Modal,
  Fade,
  Tooltip,
} from '@mui/material';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Link, useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import Analytics from './Analytics';
import Swal from 'sweetalert2';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [activeTab, setActiveTab] = useState(2);
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: 'selection' },
  ]);
  const [employeeDateRange, setEmployeeDateRange] = useState([
    { startDate: null, endDate: null, key: 'selection' },
  ]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  const getDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getterFunction(bncApi.adminDashboard);
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (e) {
      console.error('Error in getting dashboard:', e);
      setError('An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateValidation = async()=>{
    try{
      const res = await getterFunction(bncApi.validateNextDate);
      console.log('Validation response:', res);
      Swal.fire({
        title : 'Success',
        text : res.data.message,
        icon : 'success'
      })
    }catch(e){
      console.error('Error in validation', e)
    }
  }

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
      setError('An error occurred while fetching today’s data');
    } finally {
      setLoading(false);
    }
  };

  const getDateData = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);
      const res = await posterFunction(bncApi.getStatement, {
        fromDate: dayjs(startDate).format('YYYY-MM-DD'),
        toDate: dayjs(endDate).format('YYYY-MM-DD'),
      });
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError('Failed to fetch date range data');
      }
    } catch (e) {
      console.error('Error in getting date range data:', e);
      setError('An error occurred while fetching date range data');
    } finally {
      setLoading(false);
      setShowDate(false);
    }
  };

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      setSelectedEmployeeId('');
      setDashboardData(null);
      const res = await getterFunction(bncApi.getUsers);
      if (res.success) {
        setEmployees(res.data || []);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (e) {
      console.error('Error in getting employees:', e);
      setError('An error occurred while fetching employees');
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeData = async (employeeId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getterFunction(`${bncApi.getuserDashboard}/${employeeId}`);
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError('Failed to fetch employee data');
      }
    } catch (e) {
      console.error('Error in getting employee data:', e);
      setError('An error occurred while fetching employee data');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeDateChange = async () => {
    const { startDate, endDate } = employeeDateRange[0];
    if (!startDate || !endDate || !selectedEmployeeId) {
      setError('Please select an employee and date range');
      return;
    }
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      setError('End date cannot be before start date');
      return;
    }
    try {
      setLoading(true);
      const res = await posterFunction(bncApi.getuserDateDashboard, {
        fromDate: dayjs(startDate).format('YYYY-MM-DD'),
        toDate: dayjs(endDate).format('YYYY-MM-DD'),
        id: selectedEmployeeId,
      });
      if (res.success) {
        setDashboardData(res.data.data);
      } else {
        setError('Failed to fetch employee data for selected date range');
      }
    } catch (e) {
      console.error('Error fetching employee dashboard for selected date range:', e);
      setError('An error occurred while fetching employee data');
    } finally {
      setLoading(false);
      setShowDate(false);
    }
  };

  const handleEmployeeSelect = (event) => {
    setSelectedEmployeeId(event.target.value);
    setShowDate(true);
  };

  const handleDateSubmit = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) {
      setError('Please select a date range');
      return;
    }
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      setError('End date cannot be before start date');
      return;
    }
    getDateData(startDate, endDate);
  };



  const tabButtons = [
    { title: 'All', value: 1, icon: <FaList /> },
    { title: 'Today', value: 2, icon: <FaCalendarAlt /> },
    { title: 'Statement', value: 3, icon: <FaChartPie /> },
    { title: 'Employees', value: 4, icon: <FaUserTie /> },
    { title: 'Analytics', value: 5, icon: <FaChartPie /> },
  ];

  const handleClick = (item) => {
    setActiveTab(item.value);
    setShowDate(false);
    setError(null);
    if (item.value === 1) {
      setEmployees([]);
      setSelectedEmployeeId('');
      getDashboard();
    } else if (item.value === 2) {
      setEmployees([]);
      setSelectedEmployeeId('');
      getTodaysData();
    } else if (item.value === 3) {
      setEmployees([]);
      setSelectedEmployeeId('');
      setDashboardData(null);
      setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
      setShowDate(true);
    } else if (item.value === 4) {
      setDashboardData(null);
      setSelectedEmployeeId('');
      setEmployeeDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
      getUsers();
      setShowDate(true)
    } else if (item.value === 5) {
      setDashboardData(null);
      setEmployees([]);
      setSelectedEmployeeId('');
      setShowAnalytics(true);
    }
  };

  const handleCardClick = (num) => {
    let url = `/admin/bnc/calls?tabIndex=${num}&counts=${JSON.stringify(dashboardData)}`;
    if (activeTab === 2) {
      url += '&tabType=today';
    } else if (activeTab === 3) {
      const { startDate, endDate } = dateRange[0];
      if (!startDate || !endDate) {
        setError('Please select a date range');
        return;
      }
      url += `&tabType=statement&fromDate=${dayjs(startDate).format('YYYY-MM-DD')}&toDate=${dayjs(endDate).format('YYYY-MM-DD')}`;
    } else if (activeTab === 4) {
      const { startDate, endDate } = employeeDateRange[0];
      if (!startDate || !endDate || !selectedEmployeeId) {
        setError('Please select an employee and date range');
        return;
      }
      url += `&tabType=employee&fromDate=${dayjs(startDate).format('YYYY-MM-DD')}&toDate=${dayjs(endDate).format('YYYY-MM-DD')}&employeeId=${selectedEmployeeId}`;
    }
    navigate(url);
  };

  useEffect(() => {
    getTodaysData();
  }, []);

  // Pie chart data
  const pieChartData = {
    labels: ['Interested', 'Not Interested', 'Not Connected', 'Invalid', 'Admissions', 'Call Later', 'Others'],
    datasets: [
      {
        data: [
          dashboardData?.intrested || 0,
          dashboardData?.notIntrested || 0,
          dashboardData?.notConnected || 0,
          dashboardData?.callLater || 0,
          dashboardData?.invalid || 0,
          dashboardData?.others || 0,
          dashboardData?.totalAdmissions || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(154, 162, 235, 0.6)',
          'rgba(354, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(154, 162, 235, 0.6)',
          'rgba(354, 162, 235, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen bg-gray-100">
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-7xl mx-auto">
        <Box className="mb-8 text-center">
          <Typography variant="h3" className="font-bold text-gray-800">
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600 mt-2">
            Comprehensive insights into call activities and performance
          </Typography>
        </Box>

        <Box className="flex flex-wrap gap-2 mb-6 justify-center">
          {tabButtons.map((item, index) => (
            <Button
              key={index}
              onClick={() => handleClick(item)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${activeTab === item.value
                  ? 'bg-gradient-to-r from-red-600 to-blue-400 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {item.icon}
              <span className={`ml-2 ${activeTab === index + 1 && 'text-white'}`}>{item.title}</span>
            </Button>
          ))}
        </Box>

        {error && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                  if (activeTab === 1) getDashboard();
                  else if (activeTab === 2) getTodaysData();
                  else if (activeTab === 3) setShowDate(true);
                  else if (activeTab === 4) getUsers();
                }}
              >
                Retry
              </Button>
            }
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        {activeTab === 3 && (
          <Modal open={showDate} onClose={() => setShowDate(false)}>
            <Fade in={showDate}>
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
                <Typography variant="h6" className="mb-4 font-bold text-gray-800">
                  Select Date Range
                </Typography>
                <DateRange
                  editableDateInputs
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  className="mb-4"
                />
                <Box className="flex gap-2 justify-end">
                  <Button
                    variant="outlined"
                    onClick={() => setShowDate(false)}
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDateSubmit}
                    disabled={!dateRange[0].startDate || !dateRange[0].endDate}
                  >
                    Fetch Data
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>
        )}


        {activeTab === 4 && employees.length > 0 && (
          <Modal open={showDate} onClose={() => setShowDate(false)}>
            <Fade in={showDate}>
              <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
                <Typography variant="h6" className="mb-4 font-bold text-gray-800">
                  Select Employee and Date Range
                </Typography>
                <FormControl fullWidth className="mb-4">
                  <InputLabel>Employee</InputLabel>
                  <Select
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
                <DateRange
                  editableDateInputs
                  onChange={(item) => setEmployeeDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={employeeDateRange}
                  className="mb-4"
                />
                <Box className="flex gap-2 justify-end">
                  <Button
                    variant="outlined"
                    onClick={() => setShowDate(false)}
                    className="text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleEmployeeDateChange}
                    disabled={!selectedEmployeeId || !employeeDateRange[0].startDate || !employeeDateRange[0].endDate}
                  >
                    Fetch Data
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Modal>
        )}

        {(activeTab !== 4 || selectedEmployeeId || employees.length === 0) && activeTab !== 5 && (
          <Grid container spacing={3}>
            {activeTab === 1 && (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Tooltip title="Total registered users in the system">
                  <Card
                    className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                    onClick={() => setActiveTab(4)}
                  >
                    <Box className="p-3 rounded-full bg-blue-200 text-blue-600 mr-4">
                      <FaUsers size={24} />
                    </Box>
                    <CardContent className="p-0">
                      <Typography variant="body2" color="textSecondary">
                        Total Users
                      </Typography>
                      <Typography variant="h5" className="font-bold text-gray-800">
                        <CountUp end={dashboardData?.totalUsers || 0} duration={2} />
                      </Typography>
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title="Total admitted students">
                <Card
                  className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(5)}
                >
                  <Box className="p-3 rounded-full bg-green-200 text-green-600 mr-4">
                    <FaUserGraduate size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Total Admissions
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.totalAdmissions || 0} duration={2} />
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title={`${activeTab === 2 ? "Today's" : activeTab === 3 ? "Selected Period" : activeTab === 4 ? "Employee" : "Total"} call volume`}>
                <Card
                  className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(0)}
                >
                  <Box className="p-3 rounded-full bg-yellow-200 text-yellow-600 mr-4">
                    <FaPhone size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      {activeTab === 2 ? 'Today’s' : activeTab === 3 ? 'Selected Period' : activeTab === 4 ? 'Employee' : 'Total'} Calls
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.totalCalls || 0} duration={2} />
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title="Follow-ups past due date">
                <Card
                  className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(6)}
                >
                  <Box className="p-3 rounded-full bg-red-200 text-red-600 mr-4">
                    <FaClock size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Missed Follow-ups
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.expiredFollowups || 0} duration={2} />
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title="Interested student calls">
                <Card
                  className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(1)}
                >
                  <Box className="p-3 rounded-full bg-teal-200 text-teal-600 mr-4">
                    <FaThumbsUp size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Interested
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.intrested || 0} duration={2} />
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Not interested student calls">
                <Card
                  className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(2)}
                >
                  <Box className="p-3 rounded-full bg-orange-200 text-orange-600 mr-4">
                    <FaThumbsDown size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Not Interested
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.notIntrested || 0} duration={2} />
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title="Calls not connected">
                <Card
                  className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(3)}
                >
                  <Box className="p-3 rounded-full bg-purple-200 text-purple-600 mr-4">
                    <FaPhoneSlash size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Not Connected
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.notConnected || 0} duration={2} />
                    </Typography>
                  </CardContent>


                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title="Calls not connected">
                <Card
                  className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(3)}
                >
                  <Box className="p-3 rounded-full bg-purple-200 text-purple-600 mr-4">
                    <FaPhoneSlash size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Call Later
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.callLater || 0} duration={2} />
                    </Typography>
                  </CardContent>


                </Card>
              </Tooltip>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title="Invalid phone numbers">
                <Card
                  className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(4)}
                >
                  <Box className="p-3 rounded-full bg-pink-200 text-pink-600 mr-4">
                    <FaPhoneSlash size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Invalid Numbers
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.invalid || 0} duration={2} />
                    </Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Tooltip title="Calls not connected">
                <Card
                  className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  sx={{ display: 'flex', alignItems: 'center', p: 2 }}
                  onClick={() => handleCardClick(3)}
                >
                  <Box className="p-3 rounded-full bg-purple-200 text-red-600 mr-4">
                    <FaRegWindowRestore size={24} />
                  </Box>
                  <CardContent className="p-0">
                    <Typography variant="body2" color="textSecondary">
                      Others
                    </Typography>
                    <Typography variant="h5" className="font-bold text-gray-800">
                      <CountUp end={dashboardData?.others || 0} duration={2} />
                    </Typography>
                  </CardContent>


                </Card>
              </Tooltip>
            </Grid>
            {activeTab === 1 && (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  sx={{ p: 2 }}
                >
                  <CardContent className="p-0">
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box className="p-3 rounded-full bg-indigo-200 text-indigo-600 mr-4">
                        <FaStar size={24} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Best Employee
                        </Typography>
                        <Typography variant="h6" className="font-semibold text-gray-800">
                          {dashboardData?.eod ? dashboardData.eod.name : 'None'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Box className="p-3 rounded-full bg-gray-200 text-gray-600 mr-4">
                        <FaStar size={24} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Worst Employee
                        </Typography>
                        <Typography variant="h6" className="font-semibold text-gray-800">
                          {dashboardData?.weod ? dashboardData.weod.name : 'None'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
            <Grid item xs={12} md={6} width='100%' display='flex' justifyContent='center' alignItems='center'>
              <Card className="bg-white rounded-xl shadow-lg w-full">
                <CardContent>
                  <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                    Call Distribution
                  </Typography>
                  <Box className="h-64">
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Call Status Distribution' },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 5 && <Analytics />}

        <Box className="mt-8">
          <Typography variant="h5" className="text-center font-bold text-white bg-gradient-to-r from-red-600 to-yellow-600 py-2 rounded-lg">
            Basic Actions
          </Typography>
          <Box className="flex gap-4 mt-4 flex-wrap justify-center">
            <Link
              className="px-6 py-2 text-lg text-white bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              to="/admin/bnc/calls"
            >
              View Calls
            </Link>
            <Link
              className="px-6 py-2 text-lg text-white bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              to="/admin/bnc/employees"
            >
              Employee Management
            </Link>
            <button
              className="px-6 py-2 text-lg text-white bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              onClick={()=>handleDateValidation()}
            >
              Validated next Date
            </button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;