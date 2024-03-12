import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  Container,
  Stack,
  Avatar,
  SvgIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { RiBookmarkFill } from "react-icons/ri";
import { TbMoneybag } from "react-icons/tb";
import { MdInventory } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { BiRupee } from "react-icons/bi"; // Import all icons at once
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarRadiusAxis,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";
// import Sidebar from '../components/Sidebar/Sidebar';

const data2 = [
  { label: 'Jan', Income: 21 },
  { label: 'Feb', Income: 35 },
  { label: 'Mar', Income: 75 },
  { label: 'Apr', Income: 51 },
  { label: 'May', Income: 41 },
  { label: 'Jun', Income: 47 },
  { label: 'Jul', Income: 75 },
  { label: 'Aug', Income: 51 },
  { label: 'Sep', Income: 41 },
  { label: 'Oct', Income: 47 },
  { label: 'Nov', Income: 41 },
  { label: 'Dec', Income: 47 }
];

const data1 = [
  { label: 'Jan', Completed: 21, Pending: 41 },
  { label: 'Feb', Completed: 35, Pending: 79 },
  { label: 'Mar', Completed: 75, Pending: 57 },
  { label: 'Apr', Completed: 51, Pending: 47 },
  { label: 'May', Completed: 41, Pending: 63 },
  { label: 'Jun', Completed: 47, Pending: 71 },
  { label: 'Jul', Completed: 75, Pending: 57 },
  { label: 'Aug', Completed: 51, Pending: 47 },
  { label: 'Sep', Completed: 41, Pending: 63 },
  { label: 'Oct', Completed: 47, Pending: 71 },
  { label: 'Nov', Completed: 47, Pending: 71 },
  { label: 'Dec', Completed: 47, Pending: 71 }
];

const colors = ["#2E96FF", "#B800D8", "#60009B", "#2731C8", "#9C27B0"];

export default function Dash() {
  const [InventoryCount, setInventoryCount] = useState([]);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  // const [items, setItems] = useState([])
  const [tableType, setTableType] = useState(null);
  const [invoices, setInvoices] = React.useState([]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [OnSiteAppointmentsUsers, setOnSiteAppointmentsUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalAppointments, setTotalAppointmnets] = useState([]);
  const [totalOnsiteAppointmnets, setTotalOnsiteAppointmnets] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const totaluser = users.length + OnSiteAppointmentsUsers.length;

  const [itemsCount, setItemsCount] = useState(0);
  const ServiceCenterId = localStorage.getItem("_id");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchInventoryCount = async () => {
      try {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/get/getInventoryCount`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setInventoryCount(data);
        console.log("InventoryCount:", data); // Add this line to check the state
      } catch (error) {
        console.error(error);
        setError("Failed to fetch inventory counts");
      }
    };

    fetchInventoryCount();
  }, []);
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        // Make a GET request to your backend API endpoint for fetching inventory items
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/inventoryByServiceCenter/${ServiceCenterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ); // Adjust the endpoint accordingly

        const { items, totalQuantity } = response.data;

                setItems(items);
                setItemsCount(items.length);
                setTotalQuantity(totalQuantity);

            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to retrieve data');
            }
        };

        fetchInventoryItems();
    }, []);
    useEffect(() => {
    const getTotalAppointms = async () => {
      try {
        // Make a GET request to your backend API endpoint for fetching inventory items
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getTotalAppointmentsBy/${ServiceCenterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalAppointmnets(response.data);
        // Assuming you have a state variable named itemsCount
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        // Set an error state if there's an issue
        setError("Failed to retrieve inventory items");
      }
    };
    getTotalAppointms();
    const getTotalOnsuiteAppointms = async () => {
      try {
        // Make a GET request to your backend API endpoint for fetching inventory items
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getTotalOnsiteAppointmentsBy/${ServiceCenterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalOnsiteAppointmnets(response.data);
        // Assuming you have a state variable named itemsCount
      } catch (error) {
        console.error("Error fetching inventory items:", error);
        // Set an error state if there's an issue
        setError("Failed to retrieve inventory items");
      }
    };
    getTotalOnsuiteAppointms();
    const getTotalInvoice = () => {
      axios
        .get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getServiceCenterInvoiceBy/${ServiceCenterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => setInvoices(response.data || []))
        .catch((error) => console.error("Error fetching invoices:", error));
    };
    getTotalInvoice();

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getAppointmentByServiceCenterId/${ServiceCenterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getTotalOnsiteAppointmentsBy/${ServiceCenterId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOnSiteAppointmentsUsers(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchDataOnsiteAppointment();
  }, [ServiceCenterId]);

  // Fetch the list of invoices when the component mounts
  const sumOfIncome = () => {
    // Ensure that invoices is not null or undefined
    if (!invoices || !invoices.length) {
      return 0;
    }
    // Calculate the total income using reduce
    const totalIncome = invoices.reduce((total, invoice) => {
      // Parse the total amount to a floating-point number
      const invoiceAmount = parseFloat(invoice.total) || 0;
      return total + invoiceAmount;
    }, 0);

    // Log the total income (optional)

    return totalIncome;
  };

  const AllAppointments =
    totalAppointments.length + totalOnsiteAppointmnets.length;
  const allAppointments = [...totalAppointments, ...totalOnsiteAppointmnets]
  const AllUsers = [...OnSiteAppointmentsUsers, ...users]
    const generateExcelTable = () => {
      return (
        <div>
        {allAppointments.length > 0 ? (
       <>
        <table  class="table table-hover" id="bookingTable" style={{ width: "100%", borderCollapse: "collapse", marginTop: '15px', border: '1px solid #ddd' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF'}}>ID</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Customer Name</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Contact Number</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Car Model</th>
              <th style={{ textAlign: 'center', border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Brand</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Fuel Type</th>
              <th style={{ textAlign: 'center', border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Email</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Service Center ID</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Appointment Date</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Time</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Status</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Payment Method</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Subtotal</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>GST</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Discount</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#DDE1FF' }}>Safety Fee</th>
            </tr>
          </thead>
          <tbody>
            {allAppointments.map((appointment) => (
              <tr key={appointment._id} style={{ border: '1px solid #ddd' }}>
                <td style={{ border: '1px solid #ddd' }}>{appointment._id}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.customerName}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.contactNumber}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.carModel}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{appointment.Brand}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.fuelType}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{appointment.email}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.serviceCenterId}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.appointmentDate}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.time}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.status}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.paymentMethod}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.subTotal}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.gst}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.Discount}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{appointment.SafetyFee}</td>
              </tr>
            ))}
          </tbody>
        </table>


        <ReactHTMLTableToExcel
          id="downloadTableButton"
          className="download-table-xls-button"
          table="bookingTable"
          filename="appointments"
          sheet="sheet1"
          buttonText="Download as XLS"
        />
      </>) : (
            <p>No data for Appointments</p>
          )}
        </div>
      );
    };
    const generateIventoryTable = () => {
      return (
        <div>
        {items.length > 0 ? (
       <>
          <table id="bookingTable" style={{ width: "100%",  marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E8F5E9' }}>ID</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E8F5E9' }}>Name</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E8F5E9' }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{item._id}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{item.itemName}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{item.quantityInStock}</td>
              </tr>
            ))}
          </tbody>
        </table>

          <ReactHTMLTableToExcel
            id="downloadTableButton"
            className="download-table-xls-button"
            table="bookingTable"
            filename="Inventory"
            sheet="sheet1"
            buttonText="Download as XLS"
          /></>) : (
            <p>No data for Inventory</p>
          )}
        </div>
      );
    };
    const generateInvoiceTable = () => {
      return (
        <div>
        {invoices.length > 0 ? (
       <>
       <table id="bookingTable" style={{ width: "100%",  marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>ID</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>serviceCenterId</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Customer Name</th> 
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Customer Email</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Contact Number</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>CarModel</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Invoice Number</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Invoice Date</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Service Date</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Safety Fee</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>ServiceCenter Location</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Tax</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Labour Charges</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Discounts</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Total</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E6F7F7' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id}>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{invoice._id}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{invoice.serviceCenterId}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{invoice.customerName}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.customerEmail}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{invoice.contactNumber}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.carModel}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{invoice.invoiceNumber}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.invoiceDate}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{invoice.serviceDate}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{invoice.SafetyFee}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.serviceCenterLocation}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.tax}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.labourCharges}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.discounts}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.total}</td>
                <td style={{ textAlign: 'center', border: '1px solid #ddd' }}>{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
          <ReactHTMLTableToExcel
            id="downloadTableButton"
            className="download-table-xls-button"
            table="bookingTable"
            filename="Invoice"
            sheet="sheet1"
            buttonText="Download as XLS"
          /></>
          ) : (
            <p>No data for invoices</p>
          )}
        </div>
      );
    };
    const generateCustomerTable = () => {
      return (
        <div>
        {AllUsers.length > 0 ? (
       <>
          
          <table id="bookingTable" style={{ width: "100%",  marginTop: '15px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E1BEE7' }}>UserId</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E1BEE7' }}>Customer Name</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E1BEE7' }}>Email</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E1BEE7' }}>Contact Number</th>
              <th style={{ border: '1px solid #ddd',backgroundColor: '#E1BEE7' }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {AllUsers.map((use) => (
              <tr key={use._id}>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{use.userId}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{use.customerName}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{use.email}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>{use.contactNumber}</td>
                <td style={{ textAlign: 'left', border: '1px solid #ddd' }}>
          {use.customerLocation ? use.customerLocation.address1 : 'N/A'}
        </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactHTMLTableToExcel
            id="downloadTableButton"
            className="download-table-xls-button"
            table="bookingTable"
            filename="Users"
            sheet="sheet1"
            buttonText="Download as XLS"
          />
        </>
          ) : (
            <p>No data for Customers</p>
          )}
        </div>
      );
    };
   
    const handleGenerateTableClick = () => {
      setTableType('appointments');
    };
  
    const handleGenerateInventoryTableClick = () => {
      setTableType('inventory');
    };
    const handleGenerateInvoiceTableClick = () => {
      setTableType('invoice');
    };
    const handleGenerateCustomerTableClick = () => {
      setTableType('customer');
    };
    
    const handleCloseTable = () => {
      setTableType(null);
    };
  
    const generateTable = () => {
      if (tableType === 'appointments') {
        return generateExcelTable();
      } else if (tableType === 'inventory') {
        return generateIventoryTable();
      } else if (tableType === 'invoice') {
        return generateInvoiceTable();
      } else if (tableType === 'customer') {
        return generateCustomerTable();
      }
      return null;
    };

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginBottom: "45px" }}>
        <Container maxWidth="xl">
          <Grid container spacing={1}>
            <Grid
              container
              spacing={2}
              style={{ marginTop: "25px", marginRight: "30px" }}
            >
              <Grid item xs={3}>
                <Card style={{ backgroundColor: "#DDE1FF", cursor: 'pointer' }} onClick={handleGenerateTableClick} >
                  <CardHeader title="Total Booking" />
                  <CardContent>
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="h4">{AllAppointments}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h4">
                          <Avatar
                            className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-17l0mt6"
                            style={{ backgroundColor: "#AAB3FF" }}
                          >
                            <SvgIcon
                              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              data-testid="AccessTimeOutlinedIcon"
                              tabIndex="-1"
                              title="AccessTimeOutlined"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67"></path>
                              </svg>
                            </SvgIcon>
                          </Avatar>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card style={{ backgroundColor: "#E8F5E9", cursor: 'pointer' }}  onClick={handleGenerateInventoryTableClick} >
                  <CardHeader title="Total Inventory" />
                  <CardContent>
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="h4">
                          {totalQuantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h4">
                          <Avatar
                            className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-17l0mt6"
                            style={{ backgroundColor: "#81C784" }}
                          >
                            <SvgIcon
                              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              data-testid="HomeRepairServiceRoundedIcon"
                              tabindex="-1"
                              title="HomeRepairServiceRounded"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M17 16c-.55 0-1-.45-1-1H8c0 .55-.45 1-1 1s-1-.45-1-1H2v3c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-3h-4c0 .55-.45 1-1 1zm3-8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v4h4v-1c0-.55.45-1 1-1s1 .45 1 1v1h8v-1c0-.55.45-1 1-1s1 .45 1 1v1h4v-4c0-1.1-.9-2-2-2zm-5 0H9V6h6v2z"></path>
                              </svg>
                            </SvgIcon>
                          </Avatar>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} >
                <Typography variant="h4" align="center" gutterBottom>
                  <b>Appointment Analytics</b>
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={data1}
                    margin={{ top: 15, right: 0, bottom: 15, left: 0 }}
                  >
                    <Tooltip />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Legend />
                    <Line type="monotone" dataKey="Completed" stroke="blue" />
                    <Line type="monotone" dataKey="Pending" stroke="deeppink" />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ marginTop: "-170px", marginRight: "30px" }}
            >
              <Grid item xs={3}>
                <Card style={{ backgroundColor: "#E6F7F7", cursor: 'pointer' }}  onClick={handleGenerateInvoiceTableClick} >
                  <CardHeader title="Total Income" />
                  <CardContent>
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="h4">
                          <BiRupee />
                          {sumOfIncome()}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="h4">
                          <Avatar
                            className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-17l0mt6"
                            style={{ backgroundColor: "#66CCCC" }}
                          >
                            <SvgIcon
                              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z"></path>
                                <path
                                  fill-rule="evenodd"
                                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </SvgIcon>
                          </Avatar>
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card style={{ backgroundColor: "  #E1BEE7", cursor: 'pointer' }}  onClick={handleGenerateCustomerTableClick} >
                  <CardHeader title="Total Customers" />
                  <CardContent>
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="h4">{totaluser}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Avatar
                          className="MuiAvatar-root MuiAvatar-circular MuiAvatar-colorDefault css-1a3tckz"
                          style={{ backgroundColor: "#8E47AD" }}
                        >
                          <SvgIcon
                            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                            focusable="false"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z"></path>
                            </svg>
                          </SvgIcon>
                        </Avatar>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} style={{ marginTop: "60px" }}>
              <Typography variant="h4" align="center" gutterBottom>
                <b>Income</b>
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data2} margin={{ right: 0, left: 0 }}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" />
                  <PolarRadiusAxis angle={30} />
                  <Radar dataKey="Income" stroke="purple" fill="purple" />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </Grid>
           
            <Grid item xs={6} style={{ marginTop: "90px" }}>
              <Typography variant="h4" align="center" gutterBottom>
                <b>Inventory Count</b>
              </Typography>
              <ResponsiveContainer width="100%" height={300} >
              <PieChart>
                <Pie
                  data={InventoryCount.map((entry) => ({
                    name: entry.categoryName,
                    value: entry.itemCount,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  
                >
                  {InventoryCount.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [`${name}: ${value}`,""]}
                />
                <Legend

                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  iconSize={30}
                  formatter={(value, entry, index) => (
                    <span style={{ color: colors[index % colors.length] }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Dialog
        open={tableType !== null}
        onClose={handleCloseTable}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Table Details</DialogTitle>
        <DialogContent>
          {generateTable()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTable} color="primary" style={{border:"1px solid #0a568c",}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}