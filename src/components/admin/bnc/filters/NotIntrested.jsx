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
  FaEdit,
  FaEye,
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
  const [selectedId, setSelectedId] = useState(null);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();
  
  const [searchParams] = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const getInterested = async (pageNum) => {
    try {
      setLoading(true);
      setError(null);
      let res;
      tabType === "statement"
        ? (res = await posterFunction(bncApi.statementCalls, {
            page,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            tabId: 2,
          }))
        : (res = await getterFunction(
            `${bncApi.filterCalls}/${2}?page=${pageNum}&tabType=${tabType}`
          ));
      if (res.success) {
        const newData = res.data.data || [];
        setData((prev) => (pageNum === 1 ? newData : [...prev, ...newData]));
        setHasMore(res.data.hasNext); // Assume there's more if we got a full page
      } else {
        setError(res.message || "Failed to fetch data");
      }
    } catch (e) {
      console.error("Error fetching interested calls:", e);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInterested(1);
  }, []);

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
      getInterested(page);
    }
  }, [page]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const downloadExcel = () => {
    const worksheetData = data.map((item) => ({
      Name: item.name,
      Mobile: item.mobile,
      "Updated At": formatDate(item.updatedAt),
      Admitted: item.isadmitted ? "Yes" : "No",
      "Interest Level": item.intrestLevel ?? "N/A",
      "Next Date": formatDate(item.nextDate),
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Interested");
    XLSX.writeFile(workbook, "interested_calls.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Interested Calls", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [
        [
          "Name",
          "Mobile",
          "Updated At",
          "Admitted",
          "Interest Level",
          "Next Date",
        ],
      ],
      body: data.map((item) => [
        item.name,
        item.mobile,
        formatDate(item.updatedAt),
        item.isadmitted ? "Yes" : "No",
        item.intrestLevel ?? "N/A",
        formatDate(item.nextDate),
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 165, 245] },
    });
    doc.save("interested_calls.pdf");
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-6xl mx-auto">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 mb-6 text-center"
        >
          Not Intrested Calls
        </Typography>

        <Box className="flex justify-end mb-4 space-x-4">
          <Button
            variant="contained"
            color="success"
            startIcon={<FaFileExcel />}
            onClick={downloadExcel}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
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
                onClick={() => getInterested(1)}
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
            No interested calls found.
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
                      SN
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
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.mobile}</TableCell>
                    <TableCell>{formatDate(item.updatedAt)}</TableCell>
                    <TableCell>{item.feedback}</TableCell>
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
