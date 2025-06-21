import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Box,
  Typography,
  Dialog,
} from "@mui/material";
import {
  FaUser,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaCalendar,
  FaFileExcel,
  FaFilePdf,
  FaServer,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { getterFunction, bncApi, posterFunction } from "../../../../Api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import BncCallDetails from "../BncCallDetails";
import { useSearchParams } from "react-router-dom";

const NotIntrested = ({ tabType }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState(null);
  const observer = useRef();

  const [searchParams] = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const getNotInterested = async (pageNum, tabType, fetchAll = false) => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (tabType === "statement") {
        res = await posterFunction(bncApi.statementCalls, {
          page: pageNum,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          tabId: 3,
        });
      } else {
        res = await getterFunction(
          `${bncApi.filterCalls}/${3}?page=${pageNum}&tabType=${tabType}`
        );
      }
      if (res.success) {
        const newData = res.data.data || [];
        if (fetchAll) {
          return { data: newData, hasMore: res.data.hasNext };
        } else {
          setData((prev) => (pageNum === 1 ? newData : [...prev, ...newData]));
          setHasMore(res.data.hasNext);
        }
      } else {
        setError(res.message || "Failed to fetch not interested calls");
      }
    } catch (e) {
      console.error("Error fetching not interested calls:", e);
      setError("An error occurred while fetching not interested calls");
    } finally {
      if (!fetchAll) {
        setLoading(false);
      }
    }
    return { data: [], hasMore: false };
  };

  useEffect(() => {
    getNotInterested(1, tabType);
  }, [tabType]);

  const lastRowRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      getNotInterested(page, tabType);
    }
  }, [page, tabType]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not Provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchAllCalls = async () => {
    let allData = [];
    let currentPage = 1;
    let hasMorePages = true;

    setLoading(true);
    try {
      while (hasMorePages) {
        const result = await getNotInterested(currentPage, tabType, true);
        allData = [...allData, ...result.data];
        hasMorePages = result.hasMore;
        currentPage += 1;
      }
      return allData;
    } catch (e) {
      console.error("Error fetching all calls:", e);
      setError("An error occurred while fetching all calls");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    const allCalls = await fetchAllCalls();
    if (allCalls.length === 0) {
      setError("No data available to download");
      return;
    }

    const worksheetData = allCalls.map((item, index) => ({
      "S.N": index + 1,
      Name: item.name || "Not Provided",
      Mobile: item.mobile || "Not Provided",
      "Updated At": formatDate(item.updatedAt),
      Feedback: item.feedback ?? "Not Provided",
      initBy : item.initBy,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "NotInterested");
    XLSX.writeFile(workbook, "not_connected.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Not Interested Calls", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [["S.N", "Name", "Mobile", "Updated At", "Feedback"]],
      body: data.map((item, index) => [
        index + 1,
        item.name || "Not Provided",
        item.mobile || "Not Provided",
        formatDate(item.updatedAt),
        item.feedback ?? "Not Provided",
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 165, 245] },
    });
    doc.save("not_interested_calls.pdf");
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-6xl mx-auto">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 mb-6 text-center"
        >
          Not Interested Calls
        </Typography>
        <span className="text-lg text-center">
          {tabType &&
            `( ${tabType} ${
              fromDate && toDate && ` - From ${fromDate} to ${toDate}`
            })`}
        </span>

        <Box className="flex justify-end mb-4 space-x-4">
          <Button
            variant="contained"
            color="success"
            startIcon={<FaFileExcel />}
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Processing...' : "Download Excel"}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<FaFilePdf />}
            onClick={downloadPDF}
            className="bg-red-600 hover:bg-red-700"
          >
            Download PDF
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            className="mb-4"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => getNotInterested(1, tabType)}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {data.length === 0 && !loading && !error && (
          <Alert severity="info" className="mb-4">
            No not interested calls found.
          </Alert>
        )}

        {data.length > 0 && (
          <TableContainer
            component={Paper}
            className="shadow-lg rounded-xl overflow-hidden"
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaServer className="mr-2 text-blue-600" />
                      S.N
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaUser className="mr-2 text-blue-600" />
                      Name
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaPhone className="mr-2 text-blue-600" />
                      Mobile
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaClock className="mr-2 text-blue-600" />
                      Updated At
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaCalendar className="mr-2 text-blue-600" />
                      Feedback
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaCalendar className="mr-2 text-blue-600" />
                      Initiate By
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaEdit className="mr-2 text-blue-600" />
                      Action
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={`${item.mobile}-${index}`}
                    ref={index === data.length - 1 ? lastRowRef : null}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name || "Not Provided"}</TableCell>
                    <TableCell>{item.mobile || "Not Provided"}</TableCell>
                    <TableCell>{formatDate(item.updatedAt)}</TableCell>
                    <TableCell>{item.feedback ?? "Not Provided"}</TableCell>
                     <TableCell>{item.initBy ?? "Not Provided"}</TableCell>
                    <TableCell
                      onClick={() => setSelectedId(item._id)}
                      className="hover:cursor-pointer hover:bg-gray-300"
                    >
                      <FaEye className="text-green-600" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {loading && (
          <Box className="flex justify-center mt-4">
            <CircularProgress size={40} color="primary" />
          </Box>
        )}
      </Box>
      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)}>
        <BncCallDetails callId={selectedId} setCallId={setSelectedId} />
      </Dialog>
    
    </Box>
  );
};

export default NotIntrested;