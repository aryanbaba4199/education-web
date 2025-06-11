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
  FaUniversity,
  FaBook,
  FaUserTie,
  FaFileAlt,
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

const Admitted = ({ tabType }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const observer = useRef();
  const [searchParams] = useSearchParams();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const getAdmitted = async (pageNum, tabType, fetchAll = false) => {
    console.log("Fetching admitted calls...", tabType);
    try {
      setLoading(true);
      setError(null);

      const uri =
        tabType === "today"
          ? `${bncApi.filterCalls}/${5}?page=${pageNum}&tabType=${tabType}`
          : tabType === "statement"
          ? `${bncApi.statementCalls}`
          : `${bncApi.filterCalls}/${5}?page=${pageNum}`;
      let res;

      if (tabType === "statement") {
        res = await posterFunction(uri, {
          page: pageNum,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          tabId: 5,
        });
      } else {
        res = await getterFunction(uri);
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
        setError(res.message || "Failed to fetch admitted calls");
      }
    } catch (e) {
      console.error("Error fetching admitted calls:", e);
      setError("An error occurred while fetching admitted calls");
    } finally {
      if (!fetchAll) {
        setLoading(false);
      }
    }
    return { data: [], hasMore: false };
  };

  useEffect(() => {
    if (tabType) {
      getAdmitted(1, tabType);
    } else {
      getAdmitted(1);
    }
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
      getAdmitted(page, tabType);
    }
  }, [page, tabType]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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
        const result = await getAdmitted(currentPage, tabType, true);
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
      SN: index + 1,
      Name: item.name,
      Mobile: item.mobile,

      College: item.collegeId ?? "Not Provided",
      Course: item.courseId ?? "Not Provided",
      "Closed By": item.closedBy ?? "Not Provided",
      "Closing Summary": item.closingSummary ?? "Not Provided",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admitted");
    XLSX.writeFile(workbook, "admitted_calls.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Admitted Calls", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [
        [
          "S.N",
          "Name",
          "Mobile",
          "Updated At",
          "College",
          "Course",
          "Closed By",
          "Closing Summary",
        ],
      ],
      body: data.map((item, index) => [
        index + 1,
        item.name,
        item.mobile,
        formatDate(item.updatedAt),
        item.collegeId ?? "N/A",
        item.courseId ?? "N/A",
        item.closedBy ?? "N/A",
        item.closingSummary ?? "N/A",
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [66, 165, 245] },
    });
    doc.save("admitted_calls.pdf");
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-7xl mx-auto">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 mb-6 text-center"
        >
          Admitted Calls{" "}
          <span className="text-lg">
            {tabType &&
              `( ${tabType} ${
                fromDate && toDate && ` - From ${fromDate} to ${toDate}`
              } )`}
          </span>
        </Typography>

        <Box className="flex justify-end mb-4 space-x-4">
          <Button
            variant="contained"
            color="success"
            startIcon={<FaFileExcel />}
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            Download Excel
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
                onClick={() => {
                  setPage(1);
                  getAdmitted(1, tabType);
                }}
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
            No admitted calls found.
          </Alert>
        )}

        {data.length > 0 && (
          <TableContainer
            component={Paper}
            className="shadow-lg rounded-xl overflow-auto"
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
                      <FaUniversity className="mr-2 text-blue-600" />
                      College
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaBook className="mr-2 text-blue-600" />
                      Course
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaUserTie className="mr-2 text-blue-600" />
                      Closed By
                    </Box>
                  </TableCell>
                  <TableCell className="bg-blue-100 font-semibold">
                    <Box className="flex items-center">
                      <FaFileAlt className="mr-2 text-blue-600" />
                      Closing Summary
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

                    <TableCell>
                      <span className={!item.collegeId && "text-red-600"}>
                        {item.collegeId ?? "Not Provided"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={!item.courseId && "text-red-600"}>
                        {item.courseId ?? "Not Provided"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={!item.closedBy && "text-red-600"}>
                        {item.closedBy ?? "Not Provided"}
                      </span>
                    </TableCell>
                    <TableCell>{item.closingSummary ?? "N/A"}</TableCell>
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

export default Admitted;
