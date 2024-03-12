import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Chip,
  Select,
  MenuItem,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import InputLabel from "@mui/material/InputLabel";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { format, isToday } from "date-fns";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateInvoice from "./CreateInvoice";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { InfoOutlined } from "@mui/icons-material";
import CreateAppointment from "./CreateAppointment";



function OnsiteAppointment({ onAppointmentCreated }) {
  const token = localStorage.getItem("token");
  const [onsiteAppointments, setOnsiteAppointments] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  const [editedStatus, setEditedStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const serviceCenterId = localStorage.getItem("_id");


 


  const [filteredOnsiteAppointments, setFilteredOnsiteAppointments] = useState([]);

  const handleAppointmentCreated = () => {
    onAppointmentCreated(); // You can handle any logic after appointment creation here
    handleClose();
  };

  const handleIconClick = (bookingId) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = {
        ...prevExpandedRows,
        [bookingId]: !prevExpandedRows[bookingId],
      };
      console.log("New Expanded Rows:", newExpandedRows);
      return newExpandedRows;
    });
  };
 

  const handleCloseDialog = () => {
    setOpenDialogOnsiteAppointment(false);
  };
  
  const handleNewInvoiceClick = (appointment) => {
    console.log("Clicked New Invoice Button");
    setSelectedAppointment(appointment);
    console.log("Selected Appointment:", appointment); // Log the appointment directly
  };

  useEffect(() => {
   
    setFilteredOnsiteAppointments(onsiteAppointments);
  }, [ onsiteAppointments]);

  const generateAdditionalContent = (services) => {
    return (
      <TableCell colSpan={6}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#FFEEE6" }}>
              <TableCell>
                <strong>Service Title</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services?.map((service, index) => (
              <TableRow key={service._id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCell>
    );
  };



  //onsiteAppointment

  const [openDialogOnsiteAppointment, setOpenDialogOnsiteAppointment] =
    useState(false);
  const [onsiteAppointmentId, setOnsiteAppointmentId] = useState(false);
  const handleEditClick1OnsiteAppointment = (_id) => {
    setOpenDialogOnsiteAppointment(true);
    setOnsiteAppointmentId(_id);
  };

  useEffect(() => {
    const fetchOnsiteData = async () => {
      try {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getTotalOnsiteAppointmentsBy/${serviceCenterId}`,{
            headers: { Authorization: `Bearer ${token}` },
          });
  
        // Sort onsiteAppointments by appointmentDate in descending order
        const sortedOnsiteAppointments = response.data.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
  
        setOnsiteAppointments(sortedOnsiteAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        // Add error handling, e.g., display an error message to the user
      }
    };
    fetchOnsiteData();
  }, [serviceCenterId]);
  
  const deleteOnsiteAppointment = async (_id) => {
    try {
      const response = await axios.delete(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/deleteOnsitEAppointmnetBy/${_id}`,{
          headers: { Authorization: `Bearer ${token}` },
        });
      if (response) {
        try {
          const response = await axios.get(
            `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getTotalOnsiteAppointmentsBy/${serviceCenterId}`,{
              headers: { Authorization: `Bearer ${token}` },
            });
          const sortedOnsiteAppointments = response.data.sort(
            (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
          );
    
          setOnsiteAppointments(sortedOnsiteAppointments);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          // Add error handling, e.g., display an error message to the user
        }
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Add error handling, e.g., display an error message to the user
    }
  };

  const handleSaveStatusOnsiteAppointments = async () => {
    try {
      const response = await axios.put(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/completedOnsiteAppointment/${onsiteAppointmentId}`,
        {editedStatus} ,{
          headers: { Authorization: `Bearer ${token}` },
        });

      // Check if the update was successful
      if (response.status === 200) {
        setOpenDialogOnsiteAppointment(false);
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getTotalOnsiteAppointmentsBy/${serviceCenterId}`,{
            headers: { Authorization: `Bearer ${token}` },
          });
        const sortedOnsiteAppointments = response.data.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
  
        setOnsiteAppointments(sortedOnsiteAppointments);
      } else {
        console.error("Status update failed with status:", response.status);
        // Handle the failure, show an error message, etc.
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Add error handling, e.g., display an error message to the user
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [filterStatus, setFilterStatus] = useState("All");
  const handleStatusFilterChange = (event) => {
    const newFilterStatus = event.target.value;
    setFilterStatus(newFilterStatus);
  
    // Fetch filtered appointments
   
  
    
  
    // Fetch filtered onsite appointments
    const filteredOnsiteAppointments = onsiteAppointments.filter(
      (appointment) =>
        newFilterStatus === "All" || appointment.status === newFilterStatus
    );
  
    setFilteredOnsiteAppointments(filteredOnsiteAppointments);
  };
  

  const renderOnsiteAppointmentsData = () => {
    if (!onsiteAppointments ) {
      return <span> Loading onsite appointments...</span>; // Handle the case where onsiteAppointments is null
    }

    if (onsiteAppointments.length === 0 ) {
      return <span> No onsite appointments available.</span>; // Handle the case where onsiteAppointments is an empty array
    }

    return (
      <>
      {filteredOnsiteAppointments.map((appointment) => (
        
          <React.Fragment key={appointment._id}>
            {console.log(appointment)}
            <TableRow>
              <TableCell>{appointment._id}</TableCell>
              <TableCell>{appointment.customerName}</TableCell>
              <TableCell>
                {format(new Date(appointment.appointmentDate), "yyyy-MM-dd")}
              </TableCell>
              <TableCell onClick={() => handleIconClick(appointment._id)}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography>Info</Typography>
                  <IconButton color="primary">
                    <InfoOutlined />
                  </IconButton>
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  label={appointment.status}
                  color={
                    appointment.status === "Pending"
                      ? "default"
                      : appointment.status === "Completed"
                      ? "success"
                      : "error"
                  }
                />
              </TableCell>
              <TableCell
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  onClick={() =>
                    handleEditClick1OnsiteAppointment(appointment._id)
                  }
                  style={{ color: "green" }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => deleteOnsiteAppointment(appointment._id)}
                  style={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                {appointment.status === "Completed" ? (
                  <Button
                    className="create_button"
                    onClick={() => handleNewInvoiceClick(appointment)}
                    sx={{
                      color: "#e74d5a",
                      fontWeight: "700",
                      border: "2px solid #e74d5a",
                      borderRadius: "15px",
                      fontSize: "small",
                      whiteSpace: "nowrap",
                    }}
                  >
                    + New Invoice
                  </Button>
                ) : (
                  <span>No Invoice</span>
                )}
              </TableCell>
            </TableRow>
            {expandedRows[appointment._id] &&
              generateAdditionalContent(appointment.listOfServices)}
          </React.Fragment>
        ))}
        <Dialog open={openDialogOnsiteAppointment} onClose={handleCloseDialog}>
          <DialogTitle>Edit Status</DialogTitle>
          <DialogContent>
            <InputLabel id="edit">Status</InputLabel>
            <Select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value)}
              sx={{ width: "150px" }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSaveStatusOnsiteAppointments}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <div >
        <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3}}>
      <Grid
        style={{
         
          marginBottom:20,
          display: "flex",
          justifyContent: "space-between",
          alginItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "700" }}>
          Appointments
        </Typography>
        <div   style={{display: "flex",
          justifyContent: "center",
          alginItems: "center",}}>
        <Grid item >
          
          <Select
            value={filterStatus}
            onChange={handleStatusFilterChange}
            sx={{ width: "150px", marginLeft: "10px",marginRight:"20px" }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </Grid>
          <Button
            onClick={handleClickOpen}
            sx={{
              marginRight: " 30px",
              backgroundColor: "#ffeee6",
              color: "#e74d5a",
              fontWeight: "700",
              border: "2px solid #e74d5a",
              borderRadius: "25px",
            }}
          >
            
            + Create
          </Button>
        </div>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant="h5" style={{ color: "#e74d5a" }}>
              Create Appointment
            </Typography>
          </DialogTitle>
          <DialogContent>
            <CreateAppointment onSubmit={handleAppointmentCreated} onClose={handleClose}  />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
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
      </Grid>
      <Grid container >
               
                  {
                  onsiteAppointments.length === 0 ? (
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{ flexGrow: 1, p: 3, ml: 20, mt: 10 }}
                    >
                      There are no appointments for the selected date.
                    </Typography>
                  ) : (
                    <TableContainer responsive component={Paper}>
                      <Table style={{width:"100%"}}>
                        <TableHead>
                          <TableRow
                            style={{
                              backgroundColor: "#FFEEE6",
                              fontWeight: "600",
                            }}
                          >
                            <TableCell>
                              <strong>Booking Id</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Customer Name</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Appointment Date</strong>
                            </TableCell>

                            <TableCell>
                              <strong>Details</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Status</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Actions</strong>
                            </TableCell>
                            <TableCell>
                              <strong>Generate Invoice</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                      
                          
                          {/* onsite Appointments */}
                          {renderOnsiteAppointmentsData()}
                        </TableBody>
                      </Table>
                      </TableContainer>
                  )}
                  {selectedAppointment && (
                    <CreateInvoice
                      appointmentData={selectedAppointment}
                      onClose={() => setSelectedAppointment(null)}
                    />
                  )}
             
      </Grid>
      </Box>
      </Box>
    </div>
  );
}
export default OnsiteAppointment;