import React, { useEffect, useState, useRef } from "react";
import { bncApi, getterFunction } from "../../../Api";
import { FaSearch, FaDownload, FaPhone, FaEye } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  InputAdornment,
  Dialog,
} from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { data } from "react-router-dom";
import BncCallDetails from "./BncCallDetails";
import Intrested from "./filters/Intrested";
import NotIntrested from "./filters/NotIntrested";
import NotConnected from "./filters/NotConnected";
import InvalidNumber from "./filters/InvalidNumber";
import Admitted from "./filters/Admitted";
import Missed from "./filters/Missed";

const Calls = () => {
  const [calls, setCalls] = useState([]);
  const [filteredCalls, setFilteredCalls] = useState([]);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const observer = useRef();
  const fetchInProgress = useRef(false);

  const handleFilter = (item) => {
    setActiveFilter(item.value);
  };

  const fetchCalls = async (pageNum) => {
    if (loading || !hasNextPage || fetchInProgress.current) return;
    fetchInProgress.current = true;
    setLoading(true);
    try {
      const res = await getterFunction(`${bncApi.calllogs}/${pageNum ?? 1}`);

      if (res.success) {
        const newCalls = res.data.data;
        // Filter out duplicates based on _id
        setCalls((prev) => {
          const existingIds = new Set(prev.map((call) => call._id));
          const uniqueNewCalls = newCalls.filter(
            (call) => !existingIds.has(call._id)
          );
          return [...prev, ...uniqueNewCalls];
        });
        setFilteredCalls((prev) => {
          const existingIds = new Set(prev.map((call) => call._id));
          const uniqueNewCalls = newCalls.filter(
            (call) => !existingIds.has(call._id)
          );
          return [...prev, ...uniqueNewCalls];
        });
        setHasNextPage(res.data.pagination.hasNextPage);
        setPage(pageNum + 1);
      } else {
        setError("Failed to fetch calls");
      }
    } catch (e) {
      console.error("Error fetching calls:", e);
      setError("An error occurred while fetching calls");
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  // Search calls locally or via API
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredCalls(calls);
      return;
    }

    // Local search
    const localResults = calls.filter((call) =>
      call.mobile.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (localResults.length > 0) {
      setFilteredCalls(localResults);
    } else {
      // API search
      setSearchLoading(true);
      try {
        const res = await getterFunction(
          `${bncApi.searchCalls}?mobile=${searchQuery}`
        );
        console.log("Search API Response:", res); // Debug log
        if (res.success) {
          // Handle different response structures
          const searchResults = Array.isArray(res.data)
            ? res.data
            : res.data.data || [];
          setFilteredCalls(searchResults);
        } else {
          setError("No calls found for this mobile number");
          setFilteredCalls([]);
        }
      } catch (e) {
        console.error("Error searching calls:", e);
        setError("An error occurred while searching");
        setFilteredCalls([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };
  const filterButtons = [
    { title: "All", value: 0, color: "green" },
    { title: "Intrested", value: 1, color: "green" },
    { title: "Not Intrested", value: 2, color: "red" },
    { title: "Not Connected", value: 3, color: "yellow" },
    { title: "Invalid Number", value: 4, color: "red" },
    { title: "Admitted", value: 5, color: "green" },
    { title: "Missed Follow up", value: 6, color: "red" },
  ];

  // Infinite scroll observer
  const lastCallElementRef = useRef();
  useEffect(() => {
    if (loading || !hasNextPage || fetchInProgress.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCalls(page);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the last row is visible
    );

    if (lastCallElementRef.current) {
      observer.current.observe(lastCallElementRef.current);
    }

    return () => {
      if (lastCallElementRef.current && observer.current) {
        observer.current.unobserve(lastCallElementRef.current);
      }
    };
  }, [loading, hasNextPage, page]);

  // Initial fetch
  useEffect(() => {
    // Reset state on initial load
    setCalls([]);
    setFilteredCalls([]);
    setPage(1);
    setHasNextPage(true);
    fetchCalls(1);
  }, []);

  // Handle search input change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, calls]);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filteredCalls.map((call) => ({
      Name: call.name || "N/A",
      Mobile: call.mobile,
      Admitted: call.isadmitted ? "Yes" : "No",
      Feedback: call.callData[0]?.feedback || "N/A",
      ConnectionState: call.callData[0]?.connectionState || "N/A",
      InterestLevel: call.callData[0]?.intrestLevel || "N/A",
      CreatedAt: new Date(call.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Calls");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "calls.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Calls Report", 20, 10);

    doc.autoTable({
      head: [
        [
          "Name",
          "Mobile",
          "Admitted",
          "Feedback",
          "Connection State",
          "Interest Level",
          "Created At",
        ],
      ],
      body: filteredCalls.map((call) => [
        call.name || "N/A",
        call.mobile,
        call.isadmitted ? "Yes" : "No",
        call.callData[0]?.feedback || "N/A",
        call.callData[0]?.connectionState || "N/A",
        call.callData[0]?.intrestLevel || "N/A",
        new Date(call.createdAt).toLocaleString(),
      ]),
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [74, 183, 73] }, // Match #4ab749
    });

    doc.save("calls.pdf");
  };
  const renderFeedback = (cs) => {
    if (cs === 1) return "Intrested";
    else if (cs === 2) return "Not Intrested";
    else if (cs === 3) return "Not Connected";
    else if (cs === 4) return "Invalid Number";
    else if (cs === 5) return "Admitted";
    else if (cs === 6) return "Missed Follow up";
    else return "No Feedback";
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-7xl mx-auto">
        <Typography variant="h4" className="font-bold text-gray-800 mb-4">
          Calls Management
        </Typography>

        {/* Search and Download Buttons */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={2}
          mb={4}
        >
          <TextField
            label="Search by Mobile"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch className="text-gray-500" />
                </InputAdornment>
              ),
              endAdornment: searchLoading ? (
                <CircularProgress size={20} />
              ) : null,
            }}
            className="bg-white rounded-lg"
            sx={{ flex: 1 }}
          />
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<FaDownload />}
              onClick={exportToExcel}
              className="bg-green-500 hover:bg-green-600"
            >
              Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<FaDownload />}
              onClick={exportToPDF}
              className="bg-green-500 hover:bg-green-600"
            >
              PDF
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Table */}
        <div>
          <Typography>Filter</Typography>
          <div className="flex flex-wrap gap-8 mb-8">
            {filterButtons.map((item, index) => (
              <button
                onClick={() => handleFilter(item)}
                className={`px-4 ${
                  activeFilter === item.value ? "bg-cyan-600" : "bg-slate-800"
                } hover:bg-slate-700 text-white rounded-md py-1`}
                key={item.value}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
        {activeFilter === 0 && (
          <div>
            <div className="flex justify-center items-center mb-8">
              <Typography fontSize={18} fontWeight="700">
                All Calls
              </Typography>
            </div>
            <TableContainer component={Paper} className="shadow-lg rounded-xl">
              <Table>
                <TableHead>
                  <TableRow className="bg-green-100">
                    <TableCell className="font-bold text-gray-800">
                      SN
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Name
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Mobile
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Admitted
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Feedback
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Last Update
                    </TableCell>
                    <TableCell className="font-bold text-gray-800">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCalls.map((call, index) => (
                    <TableRow
                      key={call._id}
                      ref={
                        index === filteredCalls.length - 1
                          ? lastCallElementRef
                          : null
                      }
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{call.name || "Unknown"}</TableCell>
                      <TableCell>{call.mobile}</TableCell>
                      <TableCell>{call.isadmitted ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {renderFeedback(call?.lastCallData?.connectionState)}
                      </TableCell>

                      <TableCell>
                        {new Date(call.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell
                        className="hover:cursor-pointer hover:bg-gray-300"
                        onClick={() => setSelectedCall(call._id)}
                      >
                        <FaEye className="text-green-600" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        {activeFilter === 1 && <Intrested />}
        {activeFilter === 2 && <NotIntrested />}
        {activeFilter === 3 && <NotConnected />}
        {activeFilter === 4 && <InvalidNumber />}
        {activeFilter === 5 && <Admitted />}
        {activeFilter === 6 && <Missed />}

        {/* Loading Indicator */}
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress size={40} />
          </Box>
        )}

        {!hasNextPage && filteredCalls.length > 0 && (
          <Typography className="text-center text-gray-600 mt-4">
            No more calls to load
          </Typography>
        )}

        {filteredCalls.length === 0 && !loading && (
          <Typography className="text-center text-gray-600 mt-4">
            No calls found
          </Typography>
        )}
      </Box>
      <Dialog
        maxWidth
        open={selectedCall}
        onClose={() => setSelectedCall(null)}
      >
        <BncCallDetails callId={selectedCall} setCallId={setSelectedCall} />
      </Dialog>
    </Box>
  );
};

export default Calls;
