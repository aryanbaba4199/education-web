
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaUsers, FaUniversity, FaBook } from 'react-icons/fa';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Alert, Box, Container } from '@mui/material';
import { getterFunction, bncApi } from '../../../Api';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalytics();
  }, []);

  const getAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getterFunction(bncApi.analytics);
      if (res.success) {
        setData(res.data.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (e) {
      console.error('Error in getting analytics', e);
      setError('An error occurred while fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  // Chart data for colleges
  const collegeChartData = {
    labels: data?.college_wise_counts ? Object.keys(data.college_wise_counts) : [],
    datasets: [
      {
        label: 'Interested/Admitted Calls',
        data: data?.college_wise_counts ? Object.values(data.college_wise_counts) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for courses
  const courseChartData = {
    labels: data?.course_wise_counts ? Object.keys(data.course_wise_counts) : [],
    datasets: [
      {
        label: 'Interested/Admitted Calls',
        data: data?.course_wise_counts ? Object.values(data.course_wise_counts) : [],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Calls' } },
      x: { title: { display: true, text: 'Colleges/Courses' } },
    },
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8 text-center">
        <Typography variant="h3" className="font-bold text-gray-800">
          Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600 mt-2">
          Insights into student engagement, colleges, and courses
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} variant="rectangular" height={120} className="rounded-lg" />
          ))}
        </Box>
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-lg">
            <CardContent className="flex items-center">
              <FaUsers className="text-4xl text-blue-500 mr-4" />
              <Box>
                <Typography variant="h6" className="text-gray-600">
                  Total Students
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {data?.total_students?.toLocaleString() || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="flex items-center">
              <FaUniversity className="text-4xl text-green-500 mr-4" />
              <Box>
                <Typography variant="h6" className="text-gray-600">
                  Involved Colleges
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {data?.most_selected_colleges?.length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="flex items-center">
              <FaBook className="text-4xl text-purple-500 mr-4" />
              <Box>
                <Typography variant="h6" className="text-gray-600">
                  Involved Courses
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-800">
                  {data?.most_selected_courses?.length || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold text-gray-800">
              College-wise Engagement
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Bar
                data={collegeChartData}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'College Engagement' } } }}
              />
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold text-gray-800">
              Course-wise Engagement
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : (
              <Bar
                data={courseChartData}
                options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Course Engagement' } } }}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold text-gray-800">
              Top 5 Colleges
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">College</TableCell>
                      <TableCell className="font-bold">Calls</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.most_selected_colleges?.map((college, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{college.name}</TableCell>
                        <TableCell>{college.count}</TableCell>
                      </TableRow>
                    )) || <TableRow><TableCell colSpan={2}>No data available</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardContent>
            <Typography variant="h5" className="mb-4 font-bold text-gray-800">
              Top 5 Courses
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" height={200} />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold">Course</TableCell>
                      <TableCell className="font-bold">Calls</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data?.most_selected_courses?.map((course, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{course.name}</TableCell>
                        <TableCell>{course.count}</TableCell>
                      </TableRow>
                    )) || <TableRow><TableCell colSpan={2}>No data available</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Analytics;
