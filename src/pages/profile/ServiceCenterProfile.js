import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditCenter from "./EditCenter"

const ServiceCenterProfile = () => {
  const token = localStorage.getItem('token');
  const [serviceCenterData, setServiceCenterData] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const serviceCenterId = localStorage.getItem("_id");
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchData();
  }, [serviceCenterId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://gocarsmithbackend.onrender.com/api/serviceCenter/getServiceCenterDetailsBy/${serviceCenterId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setServiceCenterData(response.data);
    } catch (error) {
      console.error('Error fetching service center data:', error);
    }
  };

  if (!serviceCenterData) {
    return <p>Loading...</p>;
  }

  const openEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
   // Fetch data again after closing the edit dialog
   fetchData()
  };

  const handleCancel = () => {
    closeEditDialog();
  };

  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:"85vh"}}>
         <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', height: 450, backgroundColor: "#ffeee6" }}>
      

      <Typography variant="h4"  mb={2} style={{ color: "#e74d5a", fontWeight: "bold" }}>Service Center Profile</Typography>

      <Box mb={2}>
        <Typography>
          <strong>Service Center Name:</strong> {serviceCenterData.serviceCenterName}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography>
          <strong>Actual Name:</strong> {serviceCenterData.ServiceCenterActualName}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography>
          <strong>Holder Name:</strong> {serviceCenterData.firstName} {serviceCenterData.secondName}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography>
          <strong>Email:</strong> {serviceCenterData.email}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography>
          <strong>Address:</strong> {`${serviceCenterData.CenterCity}, ${serviceCenterData.CenterState}, ${serviceCenterData.CenterCountry}, ${serviceCenterData.postalCode}`}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography>
          <strong>Contact Person:</strong> {serviceCenterData.contactPersonName}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography>
          <strong>Contact Number:</strong> {serviceCenterData.contactNumber}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography>
          <strong>Registration Date:</strong> {new Date(serviceCenterData.registrationDate).toLocaleString()}
        </Typography>
      </Box>
      <div style={{display:"flex" ,justifyContent:"flex-end", }} >
          <Button variant="contained" mb={2} style={{
              border: '2px solid',
              borderColor: '#e74d5a',
              backgroundColor: '#ffeee6',
              borderRadius: '5px',
              color: '#e74d5a',
              fontSize: "13px",
              padding: "8px",
            }}  
            onClick={openEditDialog}>
            Edit
          </Button>
          {/* Edit dialog */}
          <Dialog open={isEditDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
            <DialogTitle style={{ fontWeight: "600", color: "#e74d5a" }}>
              Edit Service Center Details
            </DialogTitle>
            <DialogContent>
              <EditCenter
                userDetails={serviceCenterData}
                onSaveChanges={closeEditDialog}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={closeEditDialog}
                style={{
                  border: "2px solid",
                  borderColor: "#e74d5a",
                  backgroundColor: "#ffeee6",
                  borderRadius: "5px",
                  color: "#e74d5a",
                  fontSize: "12px",
                  padding: "6px",
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Paper>
    </div>
  );
};

export default ServiceCenterProfile;