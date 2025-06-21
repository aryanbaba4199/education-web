import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../redux/Action";
import { FaLink, FaTrash, FaBell } from "react-icons/fa";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
} from "@mui/material";
import Swal from "sweetalert2";
import { bncApi, removerFunction, updaterFunction } from "../../../Api";
import CreateUser from "./CreateUser";

const Employees = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.userState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLink = async (firstUserId) => {
    const inputOptions = {};

    users.forEach((u) => {
      if (u._id !== firstUserId) {
        inputOptions[u._id] = `${u.name} (${u.email})`;
      }
    });

    const { value: secondUserId } = await Swal.fire({
      title: "Select User to Link",
      input: "select",
      inputOptions,
      inputPlaceholder: "Select a Employee",
      showCancelButton: true,
      confirmButtonText: `Link`,
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a Employee !";
        }
      },
    });

    if (secondUserId) {
      console.log("First User ID:", firstUserId);
      console.log("Second User ID:", secondUserId);
      handleLinking(firstUserId, secondUserId);
    }
  };

  const handleLinking = async (firstId, secondId) => {
    try {
      const res = await updaterFunction(bncApi.linkEmployee, {
        firstId,
        secondId,
      });
      if (res.success) {
        Swal.fire({
          title: "Success",
          text: res.data.message,
          icon: "success",
        });
      }
    } catch (e) {
      console.error("Error in linking...");
    }
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Ask for passcode
        Swal.fire({
          title: "Enter Passcode",
          input: "password",
          inputLabel: "This action is protected. Enter passcode:",
          inputPlaceholder: "Enter 6-digit passcode",
          inputAttributes: {
            maxlength: 6,
            autocapitalize: "off",
            autocorrect: "off",
          },
          showCancelButton: true,
        }).then((passcodeResult) => {
          if (passcodeResult.isConfirmed) {
            if (passcodeResult.value === "727798") {
              deleteId(userId);
            } else {
              Swal.fire("Incorrect Passcode", "Action denied.", "error");
            }
          }
        });
      }
    });
  };

  const deleteId = async (userId) => {
    try {
      const res = await removerFunction(`${bncApi.deleteEmployee}/${userId}`);
      if (res.success) {
        Swal.fire({
          title: "Success",
          text: res.data.message,
          icon: "success",
        });
      }
    } catch (e) {
      console.error("Error in deleting");
    }
  };

  const handleNotify = (userId) => {
    Swal.fire({
      title: "Not Developed Yet",
      icon: "info",
    });
  };

  return (
    <>
      <Container maxWidth="lg" className="py-8">
        <Typography
          variant="h4"
          className="mb-6 text-center font-bold text-gray-800"
        >
          Employee Management
        </Typography>
        <div className="flex w-full justify-end items-center">
          <Button variant="outlined" onClick={() => setOpen(true)}>
            Create Employee
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center my-8">
            <CircularProgress />
          </div>
        )}

        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        {!loading && !error && users.length === 0 && (
          <Alert severity="info" className="mb-6">
            No employees found
          </Alert>
        )}

        {!loading && users.length > 0 && (
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="bg-white">
                    <Typography
                      variant="h6"
                      className="font-semibold text-gray-800"
                    >
                      {user.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mt-2">
                      <strong>Email:</strong> {user.email}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mt-1">
                      <strong>Mobile:</strong> {user.mobile}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mt-1">
                      <strong>Designation :</strong> {user.designation}
                    </Typography>
                  </CardContent>
                  <CardActions className="bg-gray-50 p-4 flex justify-between">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<FaLink />}
                      onClick={() => handleLink(user._id)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Link
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      startIcon={<FaBell />}
                      onClick={() => handleNotify(user._id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Notify
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      startIcon={<FaTrash />}
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <CreateUser handleClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
};

export default Employees;
