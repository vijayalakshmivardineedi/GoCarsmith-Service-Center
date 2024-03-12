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
function Appointments({ onAppointmentCreated }) {
  const [appointments, setAppointments] = useState([]);

  const token = localStorage.getItem("token");
  const [expandedRows, setExpandedRows] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
 // New state for selected date
  const serviceCenterId = localStorage.getItem("_id");
  const [appointmentid, setAppointmentId] = useState("");





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/appointments/${serviceCenterId}`,{
            headers: { Authorization: `Bearer ${token}` },
          });
  
        // Sort appointments by appointmentDate in descending order
        const sortedAppointments = response.data.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
  
        setAppointments(sortedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        // Add error handling, e.g., display an error message to the user
      }
    };
    fetchData();
  }, [serviceCenterId]);
 



const [filteredAppointments, setFilteredAppointments] = useState([]);
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
  const handleEditClick1 = (_id) => {
    setOpenDialog(true);
    setAppointmentId(_id);
  };



  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleSaveStatus = async () => {
    try {
      const response = await axios.put(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/completedAppointment/${appointmentid}`,
         {editedStatus},{
          headers: { Authorization: `Bearer ${token}` },
        });
    

      // Check if the update was successful
      if (response.status === 200) {
        setOpenDialog(false);
        try {
          const response = await axios.get(
            `https://gocarsmithbackend.onrender.com/api/ServiceCenter/appointments/${serviceCenterId}`,{
              headers: { Authorization: `Bearer ${token}` },
            });
          const sortedAppointments = response.data.sort(
            (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
          );
    
          setAppointments(sortedAppointments);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          // Add error handling, e.g., display an error message to the user
        }
      } else {
        console.error("Status update failed with status:", response.status);
        // Handle the failure, show an error message, etc.
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Add error handling, e.g., display an error message to the user
    }
  };
  const handleNewInvoiceClick = (appointment) => {
    console.log("Clicked New Invoice Button");
    setSelectedAppointment(appointment);
    console.log("Selected Appointment:", appointment); // Log the appointment directly
  };

  useEffect(() => {
    setFilteredAppointments(appointments);
 
  }, [appointments]);

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

  const deleteAppointment = async (_id) => {
    try {
      const response = await axios.delete(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/deleteAppointmnetBy/${_id}`,{
          headers: { Authorization: `Bearer ${token}` },
        });
      if (response) {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/appointments/${serviceCenterId}`,{
            headers: { Authorization: `Bearer ${token}` },
          });
        const sortedAppointments = response.data.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
  
        setAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Add error handling, e.g., display an error message to the user
    }
  };

  //onsiteAppointment

 

  
  

  
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
    const filteredAppointments = appointments.filter(
      (appointment) =>
        newFilterStatus === "All" || appointment.status === newFilterStatus
    );
  
    setFilteredAppointments(filteredAppointments);
  
  
  };
  

  

  return (
    <div >
        <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3}}>
      <Grid
        style={{
         
          marginBottom: 20,
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
          {/* <Button
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
            {" "}
            + ddd
          </Button> */}
        </div>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant="h5" style={{ color: "#e74d5a" }}>
              Create Appointment
            </Typography>
          </DialogTitle>
          <DialogContent>
            <CreateAppointment onSubmit={handleAppointmentCreated} />
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
               
                  {appointments.length === 0 ? (
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
                        {filteredAppointments.map((appointment) => (
                            <React.Fragment key={appointment._id}>
                              <TableRow>
                                <TableCell>{appointment._id}</TableCell>
                                <TableCell>
                                  {appointment.customerName}
                                </TableCell>
                                <TableCell>
                {format(new Date(appointment.appointmentDate), "yyyy-MM-dd")}
              </TableCell>
                                <TableCell
                                  onClick={() =>
                                    handleIconClick(appointment._id)
                                  }
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
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
                                    alginItems: "center",
                                  }}
                                >
                                  <IconButton
                                    onClick={() =>
                                      handleEditClick1(appointment._id)
                                    }
                                    style={{ color: "green" }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    onClick={() =>
                                      deleteAppointment(appointment._id)
                                    }
                                    style={{ color: "red" }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell>
                                  {appointment.status === "Completed" ? (
                                    <Button
                                      className="create_button"
                                      onClick={() =>
                                        handleNewInvoiceClick(appointment)
                                      }
                                      sx={{
                                        color: "#e74d5a",
                                        fontWeight: "700",
                                        border: "2px solid #e74d5a",
                                        borderRadius: "15px",
                                        fontSize: "small", // Adjust the font size as needed
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
                                generateAdditionalContent(
                                  appointment.listOfServices
                                )}
                            </React.Fragment>
                        ))}
                          <Dialog open={openDialog} onClose={handleCloseDialog}>
                            <DialogTitle>Edit Status</DialogTitle>
                            <DialogContent>
                              <InputLabel id="edit">Status</InputLabel>
                              <Select
                                value={editedStatus}
                                onChange={(e) =>
                                  setEditedStatus(e.target.value)
                                }
                                sx={{ width: "150px" }}
                              >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                              </Select>
                            </DialogContent>
                            <DialogActions>
                              <Button
                                onClick={handleCloseDialog}
                                sx={{
                                  backgroundColor: "#FFEEE6",
                                  color: "#E74D5A",
                                  fontWeight: "700",
                                  border: "2px solid #E74D5A",
                                  borderRadius: "10px",
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSaveStatus}
                                sx={{
                                  backgroundColor: "#FFEEE6",
                                  color: "#E74D5A",
                                  fontWeight: "700",
                                  border: "2px solid #E74D5A",
                                  borderRadius: "10px",
                                }}
                              >
                                Save
                              </Button>
                            </DialogActions>
                          </Dialog>
                          {/* onsite Appointments */}
                 
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
export default Appointments;