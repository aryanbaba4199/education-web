import React, { useEffect, useState } from "react";
import { bncApi, getterFunction } from "../../../Api";
import {
  FaPhone,
  FaUser,
  FaClock,
  FaThumbsUp,
  FaArrowLeft,
  FaUniversity,
  FaBook,
  FaUsers,
} from "react-icons/fa";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/Action";

const BncCallDetails = ({ callId, setCallId }) => {
  console.log(callId);
  const [callData, setCallData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.userState);

  useEffect(() => {
    if (callId) {
      getaCall(callId);
      dispatch(fetchUsers());
    }
  }, [callId]);

  const getaCall = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getterFunction(`${bncApi.getacall}/${id}`);
      if (res.success) {
        setCallData(res.data);
      } else {
        setError("Failed to fetch call details");
      }
    } catch (e) {
      console.error("Error fetching call details:", e);
      setError("An error occurred while fetching call details");
    } finally {
      setLoading(false);
    }
  };

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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!callData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f5f5"
      >
        <Typography variant="h6" className="text-gray-600">
          No call selected
        </Typography>
      </Box>
    );
  }

  const renderConnectionState = (id) => {
    switch (id) {
      case 1:
        return <span className="text-green-600">Interested</span>;
      case 2:
        return <span className="text-red-600">Not Interested</span>;
      case 3:
        return <span className="text-yellow-600">Not Connected</span>;
      case 4:
        return <span className="text-red-600">Invalid Number</span>;
    }
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <Box
          justifyContent="space-between"
          display="flex"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" className="font-bold text-gray-800">
            Call Details
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={() => setCallId(null)}
            className="mr-4"
            sx={{ borderColor: "#4ab749", color: "#4ab749" }}
          >
            Back to Calls
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Main Call Info Card */}
        <Card className="bg-white rounded-xl shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
          <CardContent>
            <Grid container spacing={8}>
              {/* Name */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <FaUser className="text-blue-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Name
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {callData.name || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Mobile */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <FaPhone className="text-green-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Mobile
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {callData.mobile}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Admitted */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <FaThumbsUp className="text-teal-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Admitted
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {callData.isadmitted ? "Yes" : "No"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Created At */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <FaClock className="text-purple-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Created At
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {new Date(callData.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Updated At */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <FaClock className="text-orange-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Updated At
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {new Date(callData.updatedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* College ID */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <FaUniversity className="text-indigo-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      College ID
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {callData.collegeId || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Course ID */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <FaBook className="text-red-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Course ID
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {callData.courseId || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Transfer */}
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <FaUsers className="text-yellow-600 mr-2" size={20} />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Transferred To
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {callData.transfer.length > 0
                        ? callData.transfer.join(", ")
                        : "None"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Call Data Table */}
        <Typography variant="h5" className="font-bold text-gray-800 mb-4">
          Call Interactions
        </Typography>
        <TableContainer component={Paper} className="shadow-lg rounded-xl">
          <Table>
            <TableHead>
              <TableRow className="bg-green-100">
                <TableCell className="font-bold text-gray-800">
                  Start Time
                </TableCell>
                <TableCell className="font-bold text-gray-800">
                  End Time
                </TableCell>
                <TableCell className="font-bold text-gray-800">
                  Duration (s)
                </TableCell>
                <TableCell className="font-bold text-gray-800">
                  Feedback
                </TableCell>
                <TableCell className="font-bold text-gray-800">
                  Connection State
                </TableCell>
                <TableCell className="font-bold text-gray-800">
                  Interest Level
                </TableCell>
                <TableCell className="font-bold text-gray-800">
                  Initiated By
                </TableCell>
                <TableCell className="font-bold text-gray-800">
                  Next Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {callData.callData.map((interaction, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>{interaction.startTime || "N/A"}</TableCell>
                  <TableCell>{interaction.endTime || "N/A"}</TableCell>
                  <TableCell>{interaction.duration || "N/A"}</TableCell>
                  <TableCell>{interaction.feedback || "N/A"}</TableCell>
                  <TableCell>
                    {renderConnectionState(interaction.connectionState) ||
                      "N/A"}
                  </TableCell>
                  <TableCell>{interaction.intrestLevel || "N/A"}</TableCell>
                  <TableCell>
                    {users.find((user) => user._id === interaction.initBy)
                      ?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {interaction.nextDate
                      ? new Date(interaction.nextDate).toLocaleString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {callData.callData.length === 0 && (
          <Typography className="text-center text-gray-600 mt-4">
            No call interactions found
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BncCallDetails;
