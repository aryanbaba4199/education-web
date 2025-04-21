import React, { useEffect, useState } from "react";
import { bncApi, getterFunction } from "../../../Api";
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
} from "@mui/material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    getDashboard();
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

  if (error) {
    return (
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
            <Button color="inherit" size="small" onClick={getDashboard}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Admin Dashboard
        </Typography>
        <div className="flex gap-4">
            <Link className="px-4 py-1 rounded-sm bg-gray-600 hover:bg-gray-700 text-white" to='/admin/bnc/calls'>Calls</Link>
        </div>
        </div>
        <Grid container spacing={3}>
          {/* Today's Total Users */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <Box className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaUsers size={24} />
              </Box>
              <CardContent className="p-0">
                <Typography variant="body2" color="textSecondary">
                  Today's Total Users
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {dashboardData?.Users || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Total Admissions */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <Box className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaUserGraduate size={24} />
              </Box>
              <CardContent className="p-0">
                <Typography variant="body2" color="textSecondary">
                  Today's Total Admissions
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {dashboardData?.totalAdmissions || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Total Calls */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <Box className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FaPhone size={24} />
              </Box>
              <CardContent className="p-0">
                <Typography variant="body2" color="textSecondary">
                  Today's Total Calls
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {dashboardData?.totalCalls || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Expired Follow-ups */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <Box className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <FaClock size={24} />
              </Box>
              <CardContent className="p-0">
                <Typography variant="body2" color="textSecondary">
                  Expired Follow-ups
                </Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {dashboardData?.expiredFollowups || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Interested */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              sx={{ display: "flex", alignItems: "center", p: 2 }}
            >
              <Box className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                <FaThumbsUp size={24} />
              </Box>
              <CardContent className="p-0">
                <Typography>Interested</Typography>
                <Typography variant="h5" className="font-bold text-gray-800">
                  {dashboardData?.interested || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Not Interested */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                <Typography variant="h5" className="font-bold text-gray-800">
                  {dashboardData?.notInterested || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Not Connected */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                <Typography variant="h5" className="font-bold text-gray-800">
                  {dashboardData?.notConnected || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Best/Worst User */}
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
                      {dashboardData?.bestUser
                        ? dashboardData.bestUser.name
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
                      {dashboardData?.worstUser
                        ? dashboardData.worstUser.name
                        : "None"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
