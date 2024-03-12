import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, IconButton, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Chip from '@mui/material/Chip';
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Row, Col } from "react-bootstrap";
import { InfoOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import Sidebar from "../../Components/Sidebar";
function Customers() {
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [OnSiteAppointmentsUsers, setOnSiteAppointmentsUsers] = useState([]);
  const ServiceCenterId = localStorage.getItem("_id");

  const [users, setUsers] = useState([]);
  const [listOfServices, setListOfServices] = useState([]);
  const [carModelNames, setCarModelNames] = useState({});
  const token=localStorage.getItem("token");
  useEffect(() => {
    // Function to fetch car model names
    const fetchCarModelNames = async () => {
      const modelNames = {};
      for (const user of OnSiteAppointmentsUsers) {
        for (const service of user.listOfServices) {
          const modelName = await getModelName(user.carModel);
          modelNames[service._id] = modelName;
        }
      }
      setCarModelNames(modelNames);
    };
    // Fetch car model names
    fetchCarModelNames();
  }, [OnSiteAppointmentsUsers]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/getAppointmentByServiceCenterId/${ServiceCenterId}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    
    fetchData();
    const fetchDataOnsiteAppointment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2000/api/ServiceCenter/getTotalOnsiteAppointmentsBy/${ServiceCenterId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOnSiteAppointmentsUsers(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchDataOnsiteAppointment();
  }, []);
  useEffect(() => {
    // Function to fetch car model names
    const fetchCarModelNames = async () => {
      const modelNames = {};
      for (const user of OnSiteAppointmentsUsers) {
        for (const service of user.listOfServices) {
          const modelName = await getModelName(user.carModel);
          modelNames[service._id] = modelName;
        }
      }
      setCarModelNames(modelNames);
    };
    // Fetch car model names
    fetchCarModelNames();
  }, [OnSiteAppointmentsUsers]);
  const getModelName = async (carModel) => {
    try {
      // Replace 'your-api-endpoint' with the actual endpoint of your API
      const response = await axios.get(`http://localhost:2000/api/serviceCenter/CarmodelNameBy/${carModel}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.model; // Assuming the API returns the model name
    } catch (error) {
      console.error(error);
      return 'Unknown Model'; // Default value or error handling
    }
  };
  const handleIconClick = async (_id) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = { [_id]: !prevExpandedRows[_id] };
      // Close all other expanded rows
      Object.keys(prevExpandedRows).forEach((key) => {
        if (key !== _id) {
          newExpandedRows[key] = false;
        }
      });
      return newExpandedRows;
    });
    try {
      const response = await axios.get(
        `http://localhost:2000/api/ServiceCenter/ListOfSevicesBy/${_id}`
      );
      setListOfServices(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  const generateAdditionalContent = (services) => {
    return (
      <TableCell colSpan={6}>
        <Table>
          <TableHead>
            <TableRow    sx={{ backgroundColor: "#FFEEE6"}}>
              <TableCell>
                <strong>Service Title</strong>
              </TableCell>
              <TableCell>
                <strong>Car Model</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Appointment Date</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listOfServices.map((listOf) => (
              listOf.listOfServices.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{listOf.carModel}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{dayjs(listOf.appointmentDate).format('DD-MM-YYYY')}</TableCell>
                  <TableCell> 
                <Chip label={listOf.status} color={listOf.status === 'Completed' ? 'primary' : 'default'} />
              </TableCell>
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableCell>
    );
  };
  const generateAdditionalContentOnsiteUsers = (user) => {
    return (
      <TableCell colSpan={6}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#FFEEE6" }}>
              <TableCell>
                <strong>Service Title</strong>
              </TableCell>
              <TableCell>
                <strong>Car Model</strong>
              </TableCell>
              <TableCell>
                <strong>Price</strong>
              </TableCell>
              <TableCell>
                <strong>Appointment Date</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.listOfServices.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{carModelNames[service._id]}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{dayjs(user.appointmentDate).format('DD-MM-YYYY')}</TableCell>
                <TableCell>
                  <Chip label={user.status} color={user.status === 'Completed' ? 'primary' : 'default'} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCell>
    );
  };
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3}}>
        <Row style={{ marginBottom: "10px" }}>
<Col lg={10}>
        <Typography variant="h4" sx={{fontWeight:"700"}}>Customer Details</Typography>
            </Col>
           </Row>
          <TableContainer component={Paper}>
            <Table>
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
                    <strong>Phone Number</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Details</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <React.Fragment key={user._id}>
                    <TableRow>
                      <TableCell>{user._id}</TableCell>
                      <TableCell>{user.firstName} {user.secondName}</TableCell>
                      <TableCell>{user.contactNumber}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell onClick={() => handleIconClick(user._id)}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography>Info</Typography>
                          <IconButton color="primary">
                        <InfoOutlined />
                      </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows[user._id] &&
                      generateAdditionalContent(user.listOfServices)}
                  </React.Fragment>
                ))}
                {OnSiteAppointmentsUsers.map((user) => (
                  <React.Fragment key={user._id}>
                    <TableRow>
                      <TableCell>{user.userId}</TableCell>
                      <TableCell>{user.customerName}</TableCell>
                      <TableCell>{user.contactNumber}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell onClick={() => handleIconClick(user._id)}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography>Info</Typography>
                          <IconButton color="primary">
                            <InfoOutlined />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows[user._id] &&
                      generateAdditionalContentOnsiteUsers(user)}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </div>
  );
}
export default Customers;