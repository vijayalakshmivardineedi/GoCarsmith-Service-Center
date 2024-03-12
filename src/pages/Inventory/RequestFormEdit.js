import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const RequestFormEdit = ({ requests, onFormSubmit }) => {
  console.log("requestData", requests);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    serviceCenterId: requests.serviceCenterId,
    items: requests.items, // Assuming items is an array of objects with name and quantity properties
    status: requests.status,
    // Add more fields as needed
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
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
  if (!requests) {
    console.error("Requests object is undefined.");
    return null; // or handle this case appropriately
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: '' }],
    });
  };
  const handleItemsChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://gocarsmithbackend.onrender.com/api/serviceCenter/updateRequest/${requests._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {

        setSnackbarMessage("Request data updated successfully!");
        setSnackbarOpen(true);
        // Invoke the callback function to close the dialog box
        onFormSubmit();
    
      })
      .catch((error) => {
        console.error("Error updating Request data:", error);
      });
  };
  
  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };
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
        
        <Grid>


          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ServiceCenterId"
              name="serviceCenterId"
              variant="outlined"
              value={formData.serviceCenterId}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
            />
          </Grid>


          {formData.items.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name={`items[${index}].name`}
                  variant="outlined"
                  value={item.name}
                  onChange={(e) => handleItemsChange(index, "name", e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name={`items[${index}].quantity`}
                  variant="outlined"
                  value={item.quantity}
                  onChange={(e) => handleItemsChange(index, "quantity", e.target.value)}
                  style={{ marginBottom: "20px" }}
                />
              </Grid>
              
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleRemoveItem(index)}
                  style={{
                    marginTop: "8px", marginBottom: "14px", border: '2px solid',
                    borderColor: '#e74d5a',
                    backgroundColor: '#ffeee6',
                    borderRadius: '5px',
                    color: '#e74d5a',
                    fontSize: "11px",
                  }}
                >
                  Remove
                </Button>
              </Grid>
              
            </Grid>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            style={{
              marginBottom: "20px", border: '2px solid',
              borderColor: '#e74d5a',
              backgroundColor: '#ffeee6',
              borderRadius: '5px',
              color: '#e74d5a',
              fontSize: "11px",
            }}
          >
            Add Item
          </Button>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Status"
              name="status"
              variant="outlined"
              value={formData.status}
              onChange={handleChange}
              style={{ marginBottom: "10px" }}
            />
          </Grid>
          {/* Add more fields based on your requirements */}
        </Grid>


        <Grid container style={{ textAlign: 'right' }}>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              style={{
                marginTop: '8px',
                marginBottom: '14px',
                border: '2px solid',
                borderColor: '#e74d5a',
                backgroundColor: '#ffeee6',
                borderRadius: '5px',
                color: '#e74d5a',
                fontSize: '11px',
              }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={onFormSubmit}
              style={{
                marginTop: '8px',
                marginBottom: '14px',
                marginLeft:"10px",
                border: '2px solid',
                borderColor: '#e74d5a',
                backgroundColor: '#ffeee6',
                borderRadius: '5px',
                color: '#e74d5a',
                fontSize: '11px',
              }}
            >
              Close
            </Button>
          </Grid>
        </Grid>


      </form>
    </Box>
  );
};
export default RequestFormEdit;