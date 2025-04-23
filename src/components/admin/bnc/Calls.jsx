import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { bncApi, getterFunction } from "../../../Api";
import { FaSearch, FaDownload, FaEye } from "react-icons/fa";
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
  const lastCallElementRef = useRef();

  const filterButtons = useMemo(() => [
    { title: "All", value: 0, color: "green" },
    { title: "Interested", value: 1, color: "green" },
    { title: "Not Interested", value: 2, color: "red" },
    { title: "Not Connected", value: 3, color: "yellow" },
    { title: "Invalid Number", value: 4, color: "red" },
    { title: "Admitted", value: 5, color: "green" },
    { title: "Missed Follow up", value: 6, color: "red" },
  ], []);

  const fetchCalls = useCallback(async (pageNum) => {
    if (loading || !hasNextPage || fetchInProgress.current) return;
    
    fetchInProgress.current = true;
    setLoading(true);
    
    try {
      const res = await getterFunction(`${bncApi.calllogs}/${pageNum ?? 1}`);
      
      if (res.success) {
        const newCalls = res.data.data;
        setCalls((prev) => {
          const existingIds = new Set(prev.map((call) => call._id));
          const uniqueNewCalls = newCalls.filter((call) => !existingIds.has(call._id));
          return [...prev, ...uniqueNewCalls];
        });
        setFilteredCalls((prev) => {
          const existingIds = new Set(prev.map((call) => call._id));
          const uniqueNewCalls = newCalls.filter((call) => !existingIds.has(call._id));
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
  }, [loading, hasNextPage]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setFilteredCalls(calls);
      return;
    }

    const localResults = calls.filter((call) =>
      call.mobile.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (localResults.length > 0) {
      setFilteredCalls(localResults);
    } else {
      setSearchLoading(true);
      try {
        const res = await getterFunction(`${bncApi.searchCalls}?mobile=${searchQuery}`);
        if (res.success) {
          const searchResults = Array.isArray(res.data) ? res.data : res.data.data || [];
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
  }, [searchQuery, calls]);

  const exportToExcel = useCallback(() => {
    try {
      const exportData = filteredCalls.map((call) => ({
        Name: call.name || "N/A",
        Mobile: call.mobile || "N/A",
        Admitted: call.isadmitted ? "Yes" : "No",
        Feedback: call.callData?.[0]?.feedback || "N/A",
        ConnectionState: call.callData?.[0]?.connectionState || "N/A",
        InterestLevel: call.callData?.[0]?.intrestLevel || "N/A",
        CreatedAt: call.createdAt ? new Date(call.createdAt).toLocaleString() : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Calls");

      // Generate buffer and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      saveAs(blob, `calls_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      setError("Failed to export Excel file");
    }
  }, [filteredCalls]);

  const exportToPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      doc.text("Calls Report", 20, 10);

      doc.autoTable({
        head: [["Name", "Mobile", "Admitted", "Feedback", "Connection State", "Interest Level", "Created At"]],
        body: filteredCalls.map((call) => [
          call.name || "N/A",
          call.mobile || "N/A",
          call.isadmitted ? "Yes" : "No",
          call.callData?.[0]?.feedback || "N/A",
          call.callData?.[0]?.connectionState || "N/A",
          call.callData?.[0]?.intrestLevel || "N/A",
          call.createdAt ? new Date(call.createdAt).toLocaleString() : "N/A",
        ]),
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [74, 183, 73] },
      });

      doc.save(`calls_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      setError("Failed to export PDF file");
    }
  }, [filteredCalls]);

  const renderFeedback = useCallback((cs) => {
    const feedbackMap = {
      1: "Interested",
      2: "Not Interested",
      3: "Not Connected",
      4: "Invalid Number",
      5: "Admitted",
      6: "Missed Follow up",
    };
    return feedbackMap[cs] || "No Feedback";
  }, []);

  useEffect(() => {
    setCalls([]);
    setFilteredCalls([]);
    setPage(1);
    setHasNextPage(true);
    fetchCalls(1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    if (loading || !hasNextPage || fetchInProgress.current) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCalls(page);
        }
      },
      { threshold: 0.1 }
    );

    if (lastCallElementRef.current) {
      observer.current.observe(lastCallElementRef.current);
    }

    return () => {
      if (lastCallElementRef.current && observer.current) {
        observer.current.unobserve(lastCallElementRef.current);
      }
    };
  }, [loading, hasNextPage, page, fetchCalls]);

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-7xl mx-auto">
        <Typography variant="h4" className="font-bold text-gray-800 mb-4">
          Calls Management
        </Typography>

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} mb={4}>
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
              endAdornment: searchLoading ? <CircularProgress size={20} /> : null,
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
              disabled={filteredCalls.length === 0}
            >
              Excel
            </Button>
            <Button
              variant="contained"
              startIcon={<FaDownload />}
              onClick={exportToPDF}
              className="bg-green-500 hover:bg-green-600"
              disabled={filteredCalls.length === 0}
            >
              PDF
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div>
          <Typography>Filter</Typography>
          <div className="flex flex-wrap gap-2 mb-8">
            {filterButtons.map((item) => (
              <button
                key={item.value}
                onClick={() => setActiveFilter(item.value)}
                className={`px-4 flex-1 ${
                  activeFilter === item.value ? "bg-cyan-600" : "bg-slate-800"
                } hover:bg-slate-700 text-white rounded-md py-1`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {activeFilter === 0 && (
          <div>
            <Typography fontSize={18} fontWeight="700" align="center" mb={4}>
              All Calls
            </Typography>
            <TableContainer component={Paper} className="shadow-lg rounded-xl">
              <Table>
                <TableHead>
                  <TableRow className="bg-green-100">
                    <TableCell className="font-bold text-gray-800">SN</TableCell>
                    <TableCell className="font-bold text-gray-800">Name</TableCell>
                    <TableCell className="font-bold text-gray-800">Mobile</TableCell>
                    <TableCell className="font-bold text-gray-800">Admitted</TableCell>
                    <TableCell className="font-bold text-gray-800">Feedback</TableCell>
                    <TableCell className="font-bold text-gray-800">Last Update</TableCell>
                    <TableCell className="font-bold text-gray-800">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCalls.map((call, index) => (
                    <TableRow
                      key={call._id}
                      ref={index === filteredCalls.length - 1 ? lastCallElementRef : null}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{call.name || "Unknown"}</TableCell>
                      <TableCell>{call.mobile || "N/A"}</TableCell>
                      <TableCell>{call.isadmitted ? "Yes" : "No"}</TableCell>
                      <TableCell>{renderFeedback(call?.lastCallData?.connectionState)}</TableCell>
                      <TableCell>
                        {call.updatedAt ? new Date(call.updatedAt).toLocaleString() : "N/A"}
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
      
      <Dialog maxWidth open={!!selectedCall} onClose={() => setSelectedCall(null)}>
        <BncCallDetails callId={selectedCall} setCallId={setSelectedCall} />
      </Dialog>
    </Box>
  );
};

export default Calls;