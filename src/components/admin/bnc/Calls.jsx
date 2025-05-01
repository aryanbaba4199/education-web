import React, { useEffect, useState, useCallback, useMemo } from "react";
import { bncApi, getterFunction, posterFunction } from "../../../Api";
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
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import debounce from "lodash.debounce";
import { useInView } from "react-intersection-observer";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import BncCallDetails from "./BncCallDetails";
import Intrested from "./filters/Intrested";
import NotIntrested from "./filters/NotIntrested";
import NotConnected from "./filters/NotConnected";
import InvalidNumber from "./filters/InvalidNumber";
import Admitted from "./filters/Admitted";
import Missed from "./filters/Missed";
import {useDispatch, useSelector} from 'react-redux'
import { fetchUsers } from "../../../redux/Action";

// Note: Requires date-fns v2.x for react-date-range
// npm install react-intersection-observer react-date-range date-fns@2.30.0 @types/react-date-range lodash.debounce

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
  const [tabTypeforChild, setTabTypeforChild] = useState(""); // Initialize to avoid null
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { ref: lastCallRef, inView } = useInView({ threshold: 0.1 });

  const tabIndexValue = searchParams.get("tabIndex");
  const tabType = searchParams.get("tabType") || "";
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const employeeId = searchParams.get("employeeId");
  const dispatch  = useDispatch();
  const { users } = useSelector((state) => state.userState);
  const filterButtons = useMemo(
    () => [
      { title: "All", value: 0, color: "green" },
      { title: "Interested", value: 1, color: "green" },
      { title: "Not Interested", value: 2, color: "red" },
      { title: "Not Connected", value: 3, color: "yellow" },
      { title: "Invalid Number", value: 4, color: "red" },
      { title: "Admitted", value: 5, color: "green" },
      { title: "Missed Follow up", value: 6, color: "red" },
    ],
    []
  );

  useEffect(()=>{
    dispatch(fetchUsers())
  }, [])

  // Initialize date range from URL parameters
  useEffect(() => {
    if (fromDate && toDate && tabType === "employee") {
      setDateRange([
        {
          startDate: dayjs(fromDate).toDate(),
          endDate: dayjs(toDate).toDate(),
          key: "selection",
        },
      ]);
    }
  }, [fromDate, toDate, tabType]);

  

  // Handle tab initialization
  useEffect(() => {
    setTabTypeforChild(tabType || "");
    if (tabIndexValue) {
      const tabIndexNum = Number(tabIndexValue);
      if (!isNaN(tabIndexNum) && tabIndexNum >= 0 && tabIndexNum <= 6) {
        setActiveFilter(tabIndexNum);
        if (tabIndexNum === 0) {
          setCalls([]);
          setFilteredCalls([]);
          setPage(1);
          setHasNextPage(true);
          fetchCalls(1);
        }
      }
    }
  }, [tabIndexValue, tabType]);

  // Fetch calls with infinite scroll
  const fetchCalls = useCallback(
    async (pageNum, activeFilter) => {
      if (loading || !hasNextPage) return;

      setLoading(true);
      try {
        console.log(activeFilter, tabType);
        let res;
        if (tabType === "employee" || tabType==='statement') {
          if (!fromDate || !toDate ) {
            setError("Please select a date range and employee");
            return;
          }
          tabType==='statement' ? (
            res = await posterFunction(bncApi.statementCalls, {
              page: pageNum,
              fromDate,
              toDate,
              tabId: 0,
            })
          ) : 
          res = await posterFunction(bncApi.empStatementCalls, {
            page: pageNum,
            fromDate,
            toDate,
            employeeId,
            tabId: 0,
          });
        } else {
          res = await getterFunction(
            `${bncApi.calllogs}/${pageNum}?tabType=${tabType}`
          );
        }

        if (res.success) {
          const newCalls = res.data.data || [];
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
          setHasNextPage(res.data.pagination?.hasNextPage || res.data?.hasNext ||  false);
          setPage(pageNum + 1);
        } else {
          setError("Failed to fetch calls");
        }
      } catch (e) {
        console.error("Error fetching calls:", e);
        setError("An error occurred while fetching calls");
      } finally {
        setLoading(false);
      }
    },
    [loading, hasNextPage, activeFilter, tabType, fromDate, toDate, employeeId]
  );

  // Trigger fetch when last call is in view
  useEffect(() => {
    if (inView && !loading && hasNextPage) {
      fetchCalls(page, 0);
    }
  }, [inView, loading, hasNextPage, page, fetchCalls]);

  // Debounced search
  const handleSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (!query.trim()) {
          setFilteredCalls(calls);
          return;
        }

        const localResults = calls.filter((call) =>
          call.mobile?.toLowerCase().includes(query.toLowerCase())
        );

        if (localResults.length > 0) {
          setFilteredCalls(localResults);
        } else {
          setSearchLoading(true);
          try {
            const res = await getterFunction(
              `${bncApi.searchCalls}?mobile=${query}`
            );
            if (res.success) {
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
      }, 500),
    [calls]
  );

  // useEffect(() => {
  //   filt
  // }, [searchQuery]);

  // console.log("Filtered Calls", searchQuery);

  

  // Handle date range submission
  const handleDateSubmit = useCallback(() => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) {
      setError("Please select a date range");
      return;
    }
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      setError("End date cannot be before start date");
      return;
    }
    if (!employeeId) {
      setError("Employee ID is required");
      return;
    }

    // Update URL with new date range
    navigate(
      `/admin/bnc/calls?tabIndex=${activeFilter}&tabType=employee&fromDate=${dayjs(
        startDate
      ).format("YYYY-MM-DD")}&toDate=${dayjs(endDate).format(
        "YYYY-MM-DD"
      )}&employeeId=${employeeId}`
    );

    // Reset and fetch new data
    setCalls([]);
    setFilteredCalls([]);
    setPage(1);
    setHasNextPage(true);
    fetchCalls(1, 0);
  }, [dateRange, employeeId, activeFilter, navigate, fetchCalls]);

  const exportToExcel = useCallback(() => {
    try {
      const exportData = filteredCalls.map((call) => ({
        Name: call.name || "N/A",
        Mobile: call.mobile || "N/A",
        Admitted: call.isadmitted ? "Yes" : "No",
        Feedback: call.lastCallData?.feedback || "N/A",
        ConnectionState: call.lastCallData?.connectionState || "N/A",
        InterestLevel: call.lastCallData?.intrestLevel || "N/A",
        CreatedAt: call.createdAt
          ? new Date(call.createdAt).toLocaleString()
          : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Calls");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `calls_${new Date().toISOString().split("T")[0]}.xlsx`);
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
          call.mobile || "N/A",
          call.isadmitted ? "Yes" : "No",
          call.lastCallData?.feedback || "N/A",
          call.lastCallData?.connectionState || "N/A",
          call.lastCallData?.intrestLevel || "N/A",
          call.createdAt ? new Date(call.createdAt).toLocaleString() : "N/A",
        ]),
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [74, 183, 73] },
      });

      doc.save(`calls_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      setError("Failed to export PDF file");
    }
  }, [filteredCalls]);



  const renderConnection = (connection)=>{
    switch (connection) {
      case 1:
        return "Intrested";
      case 2:
        return "Not Intrested";
      case 3:
        return "Not Connected";
      case 4:
        return "Invalid Number";
        case 5:
        return "Call Later";
    }
  }

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-7xl mx-auto">
        <Typography variant="h4" className="font-bold text-gray-800 mb-4">
          Calls Management
        </Typography>

        {tabType === "employee" && (
          <Box className="mb-6 p-4 bg-white rounded-xl shadow-lg">
            <Typography
              variant="h6"
              className="font-bold text-gray-800 mb-4"
            >
              Select Date Range
            </Typography>
            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                sx={{
                  "& .rdrCalendarWrapper": {
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  },
                  "& .rdrDayToday .rdrDayNumber span": {
                    color: "#1976d2",
                    fontWeight: "bold",
                  },
                  "& .rdrDayNumber span": {
                    color: "#424242",
                  },
                  "& .rdrSelected, & .rdrInRange, & .rdrStartEdge, & .rdrEndEdge": {
                    backgroundColor: "#1976d2",
                  },
                  "& .rdrMonthAndYearPickers select": {
                    color: "#424242",
                    fontSize: "14px",
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleDateSubmit}
                disabled={!dateRange[0].startDate || !dateRange[0].endDate}
              >
                Apply Date Range
              </Button>
            </Box>
          </Box>
        )}

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
                onClick={() => {
                  setActiveFilter(item.value);
                  if (item.value === 0) {
                    setCalls([]);
                    setFilteredCalls([]);
                    setPage(1);
                    setHasNextPage(true);
                    fetchCalls(1, 0);
                  }
                }}
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
                    <TableCell className="font-bold text-gray-800">Observed</TableCell>
                    <TableCell className="font-bold text-gray-800">Initiate By</TableCell>
                    <TableCell className="font-bold text-gray-800">Last Update</TableCell>
                    <TableCell className="font-bold text-gray-800">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCalls.map((call, index) => (
                    <TableRow
                      key={call._id}
                      ref={index === filteredCalls.length - 1 ? lastCallRef : null}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{call.name || "Unknown"}</TableCell>
                      <TableCell>{call.mobile || "N/A"}</TableCell>
                      <TableCell>{renderConnection(call.connectionState)}</TableCell>
                      <TableCell className="hover:cursor-pointer hover:text-blue-600" >{users.find(item=>item._id===call.lastCallData.initBy)?.name  || "N/A"}</TableCell>
                      
                      <TableCell>
                        {call.updatedAt
                          ? new Date(call.updatedAt).toLocaleString()
                          : "N/A"}
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
        {activeFilter === 1 && <Intrested tabType={tabTypeforChild} users={users}/>}
        {activeFilter === 2 && <NotIntrested tabType={tabTypeforChild} users={users}/>}
        {activeFilter === 3 && <NotConnected tabType={tabTypeforChild} users={users}/>}
        {activeFilter === 4 && <InvalidNumber tabType={tabTypeforChild} users={users}/>}
        {activeFilter === 5 && <Admitted tabType={tabTypeforChild} users={users}/>}
        {activeFilter === 6 && <Missed tabType={tabTypeforChild} users={users}/>}

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

        <Dialog maxWidth open={!!selectedCall} onClose={() => setSelectedCall(null)}>
          <BncCallDetails callId={selectedCall} setCallId={setSelectedCall} />
        </Dialog>
      </Box>
    </Box>
  );
};

export default Calls;