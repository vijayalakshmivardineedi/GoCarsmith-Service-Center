import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";

const CreateEmployeeForm = ({ onClose },props) => {
  const Data = JSON.parse(localStorage.getItem("ServiceCenter"));
  const serviceCenterId = Data._id;
  const {setShowCreateForm}=props

  console.log(Data);
  console.log(serviceCenterId);
  const [formData, setFormData] = useState({
    serviceCenterId: serviceCenterId || "",
    firstName: "",
    secondName: "",
    email: "",
    contactNumber: "",
    password: "",
    Address: "",
    role: ""
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://gocarsmithbackend.onrender.com/api/ServiceCenter/employee/signup",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Signup successful:", response.data);
      setSnackbarMessage("Employee created successfully!");
      setSnackbarOpen(true);
      onClose(); // Close the signup form after successful signup
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle error - show error message or alert
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  
  useEffect(() => {
    if (snackbarOpen) {
      const snackbarCloseTimeout = setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000); // Adjust the timeout as needed (in milliseconds)
      return () => clearTimeout(snackbarCloseTimeout);
    }
  }, [snackbarOpen]);

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Center ID"
              name="serviceCenterId"
              variant="outlined"
              value={formData.serviceCenterId}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
              disabled // Disable editing of Service Center ID field
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" style={{ marginBottom: "20px" }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={handleChange}
                label="Role"
                name="role"
              >
                <MenuItem value={"Mechanic"}>Mechanic</MenuItem>
                <MenuItem value={"Manager"}>Manager</MenuItem>
                <MenuItem value={"Incharge"}>Incharge</MenuItem>
                <MenuItem value={"Accountant"}>Accountant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              variant="outlined"
              value={formData.firstName}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Second Name"
              name="secondName"
              variant="outlined"
              value={formData.secondName}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              variant="outlined"
              value={formData.contactNumber}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Address"
              name="Address"
              variant="outlined"
              value={formData.Address}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: "20px", marginRight: "10px" }}
        >
          Sign Up
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateEmployeeForm;;
