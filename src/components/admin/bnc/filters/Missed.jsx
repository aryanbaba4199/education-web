import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
  FaCalendar,
  FaComment,
  FaServer,
  FaFileExcel,
  FaFilePdf,
  FaEye,
} from "react-icons/fa";
import { getterFunction, bncApi, posterFunction } from "../../../../Api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import BncCallDetails from "../BncCallDetails";
import { useSearchParams } from "react-router-dom";

const Missed = ({ tabType, users }) => {
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

  const getMissed = useCallback(
    async (pageNum, tabType, fetchAll = false) => {
      try {
        setLoading(true);
        setError(null);
        let res;
        if (tabType === "statement") {
          res = await posterFunction(bncApi.statementCalls, {
            page: pageNum,
            fromDate: new Date(fromDate),
            toDate: new Date(toDate),
            tabId: 6,
          });
        } else {
          res = await getterFunction(
            `${bncApi.filterCalls}/${6}?page=${pageNum}&tabType=${tabType}`
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
          setError(res.message || "Failed to fetch missed follow-up calls");
        }
      } catch (e) {
        console.error("Error fetching missed follow-up calls:", e);
        setError("An error occurred while fetching missed follow-up calls");
      } finally {
        if (!fetchAll) {
          setLoading(false);
        }
      }
      return { data: [], hasMore: false };
    },
    [fromDate, toDate]
  );

  useEffect(() => {
    getMissed(1, tabType);
  }, [getMissed, tabType]);

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
      getMissed(page, tabType);
    }
  }, [page, getMissed, tabType]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const formatName = useCallback((name) => {
    return name && name.trim() ? name : "Unknown";
  }, []);

  const fetchAllCalls = useCallback(async () => {
    let allData = [];
    let currentPage = 1;
    let hasMorePages = true;

    setLoading(true);
    try {
      while (hasMorePages) {
        const result = await getMissed(currentPage, tabType, true);
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
  }, [getMissed, tabType]);

  const downloadExcel = useCallback(async () => {
    try {
      const allCalls = await fetchAllCalls();
      if (allCalls.length === 0) {
        setError("No data available to download");
        return;
      }

      const worksheetData = allCalls.map((item, index) => ({
        "S.N": index + 1,
        Name: formatName(item.name),
        Mobile: item.mobile || "N/A",
        "Next Date": formatDate(item.nextDate),
        Feedback: item.feedback ?? "N/A",
        "Initiated By": users.find(user => user._id === item.initBy)?.name || "N/A",
      }));
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Missed");
      XLSX.writeFile(
        workbook,
        `missed_followup_calls_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting Excel:", error);
      setError("Failed to export Excel file");
    }
  }, [fetchAllCalls, formatName, formatDate, users]);

  const downloadPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      doc.text("Missed Follow-Up Calls", 14, 20);
      doc.autoTable({
        startY: 30,
        head: [["S.N", "Name", "Mobile", "Next Date", "Feedback", "Initiated By"]],
        body: data.map((item, index) => [
          index + 1,
          formatName(item.name),
          item.mobile || "N/A",
          formatDate(item.nextDate),
          item.feedback ?? "N/A",
          users.find(user => user._id === item.initBy)?.name || "N/A",
        ]),
        theme: "striped",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [66, 165, 245] },
      });
      doc.save(
        `missed_followup_calls_${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setError("Failed to export PDF file");
    }
  }, [data, formatName, formatDate, users]);

  const tableHeaders = useMemo(
    () => [
      { label: "S.N", icon: <FaServer className="mr-2 text-blue-600" /> },
      { label: "Name", icon: <FaUser className="mr-2 text-blue-600" /> },
      { label: "Mobile", icon: <FaPhone className="mr-2 text-blue-600" /> },
      {
        label: "Next Date",
        icon: <FaCalendar className="mr-2 text-blue-600" />,
      },
      {
        label: "Initiated By",
        icon: <FaComment className="mr-2 text-blue-600" />,
      },
      { label: "View", icon: <FaEye className="mr-2 text-blue-600" /> },
    ],
    []
  );

  return (
    <Box className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Box className="max-w-6xl mx-auto">
        <Typography
          variant="h4"
          className="font-bold text-gray-800 mb-6 text-center"
        >
          Missed Follow-Up Calls
          <span className="text-lg">
            {tabType &&
              ` (${tabType} ${
                fromDate && toDate && ` - From ${fromDate} to ${toDate}`
              })`}
          </span>
        </Typography>

        <Box className="flex justify-end mb-4 space-x-4">
          <Button
            variant="contained"
            color="success"
            startIcon={<FaFileExcel />}
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700"
            disabled={loading || data.length === 0}
          >
           {loading ? 'Processing...' : "Download Excel"}
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<FaFilePdf />}
            onClick={downloadPDF}
            className="bg-red-600 hover:bg-red-700"
            disabled={data.length === 0}
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
                  getMissed(1, tabType);
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
            No missed follow-up calls found.
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
                  {tableHeaders.map((header) => (
                    <TableCell
                      key={header.label}
                      className="bg-blue-100 font-semibold"
                    >
                      <Box className="flex items-center">
                        {header.icon}
                        {header.label}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className="text-red-600">
                {data.map((item, index) => (
                  <TableRow
                    key={`${item._id}-${index}`}
                    ref={index === data.length - 1 ? lastRowRef : null}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{formatName(item.name)}</TableCell>
                    <TableCell>{item.mobile || "N/A"}</TableCell>
                    <TableCell>{formatDate(item.nextDate)}</TableCell>
                    <TableCell>
                      {item.initBy|| "N/A"}
                    </TableCell>
                    <TableCell className="hover:cursor-pointer hover:bg-gray-300">
                      <FaEye
                        onClick={() => setSelectedId(item._id)}
                        className="text-green-600"
                      />
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

export default Missed;