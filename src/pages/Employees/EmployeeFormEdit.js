import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";
const EmployeeFormEdit = ({ employee, onFormSubmit }) => {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    setFormData(employee);
  }, [employee]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/update/${employee.employeeId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Successfully updated employee data");
        setSnackbarMessage("Employee data updated successfully!");
        setSnackbarOpen(true);
        // Invoke the callback function to close the dialog box
        onFormSubmit();        
      })
      .catch((error) => {
        console.error("Error updating employee data:", error);
      });
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
    <Box sx={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <form onSubmit={handleSubmit}>
        
        <Grid container spacing={2}>
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
              label="Mobile"
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
              label="Address"
              name="Address"
              variant="outlined"
              value={formData.Address}
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
              label="Employee ID"
              name="employeeId"
              variant="outlined"
              value={formData.employeeId}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Role"
              name="role"
              variant="outlined"
              value={formData.role}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
        </Grid>
        <Button type="submit" className="create_button" style={{
          border: '2px solid',
          borderColor: '#E74D5A',
          backgroundColor: '#FFEEE6',
          borderRadius: '5px',
          color: '#E74D5A',
          fontSize: "12px",
          padding: "6px",
        }}>
          Submit
        </Button>
      </form>
    </Box>
  );
};
export default EmployeeFormEdit;