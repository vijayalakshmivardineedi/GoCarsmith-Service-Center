import React, { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { MdCurrencyRupee } from "react-icons/md";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import EditInvoice from "./EditInvoice";
import { Grid, Typography } from "@mui/material";
const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const token = localStorage.getItem("token");

  const _id = localStorage.getItem("_id");
  useEffect(() => {
    // Fetch the list of invoices when the component mounts
    axios
      .get(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/getServiceCenterInvoiceBy/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setInvoices(response.data))
      .catch((error) => console.error("Error fetching invoices:", error));
  }, []); // The empty dependency array ensures that the effect runs only once on mount
  const [deletedInvoices, setDeletedInvoices] = useState([]);
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showUndoSnackbar, setShowUndoSnackbar] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);

  const handleUpdate = () => {
    // Fetch the updated list of invoices
    axios
      .get(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/getServiceCenterInvoiceBy/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setInvoices(response.data))
      .catch((error) => console.error("Error fetching invoices:", error));
  };


  const handleDelete = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditMode(true);
  };
  const handleUndo = () => {
    if (deletedInvoices.length > 0) {
      const lastDeletedInvoice = deletedInvoices[deletedInvoices.length - 1];
      // Create a copy of the invoices array and add the last deleted item
      const updatedInvoices = [...invoices, lastDeletedInvoice];
      // Update the state with the modified array
      setInvoices(updatedInvoices);
      // Remove the last item from the deletedInvoices array
      setDeletedInvoices((prevDeletedInvoices) =>
        prevDeletedInvoices.slice(0, prevDeletedInvoices.length - 1)
      );
      // Hide the Undo button after performing undo
      setShowUndoSnackbar(false);
    }
  };
  const handleLocationFilter = (event) => {
    setFilterLocation(event.target.value);
  };
  const handleStatusFilter = (event) => {
    setFilterStatus(event.target.value);
  };
  const filteredInvoices = invoices.filter((invoice) => {
    if (filterLocation !== "All" && filterStatus !== "All") {
      return (
        invoice.location === filterLocation && invoice.status === filterStatus
      );
    } else if (filterLocation !== "All") {
      return invoice.location === filterLocation;
    } else if (filterStatus !== "All") {
      return invoice.status === filterStatus;
    } else {
      return true;
    }
  });
  const downloadPdf = (invoiceId) => {
    console.log("Download PDF for invoice:", invoiceId);
  };
  const deleteInvoice = (_id) => {
    setDeleteDialogOpen(true);
    setInvoiceId(_id);
    console.log("Delete invoice:", invoiceId);
  };
  const handleConfirmDelete = async () => {
    try {
      // const couponId = coupons[selectedCard]._id;
      const response = await axios.delete(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/deleteInvoice/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        // Check if the response is an array
        axios
          .get(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/getServiceCenterInvoiceBy/${_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(
            (response) => setInvoices(response.data || []),
            setDeleteDialogOpen(false)
          )
          .catch((error) => console.error("Error fetching invoices:", error));
        // Show the undo snackbar
      } else {
        console.error("Invalid response format:", response.data);
      }
      setShowUndoSnackbar(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };
  const handleDownload = async (_id) => {
    try {
      const response = await axios.get(
        `https://gocarsmithbackend.onrender.com/api/ServiceCenter/generatePdf/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 200) {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getInvoiceById/${_id}`,
          { responseType: "blob" }, {
          headers: { Authorization: `Bearer ${token}` },
        } // Set responseType to 'blob' for binary data
        )

        const blob = new Blob([response.data], { type: "application/pdf" });
        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);
        // Create a link element and trigger a click event to start the download
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice_${_id}.pdf`;
        link.click();
        // Release the allocated resources
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Handle the error, e.g., display an error message to the user
    } // Create a Blob from the binary data received in the response
  };
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <div>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="h5" sx={{ fontWeight: "700" }}>
              Invoice List
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <Select
                value={filterStatus}
                onChange={handleStatusFilter}
                variant="outlined"
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <TableContainer responsive component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#FFEEE6" }}>
              <TableCell>
                {" "}
                <strong>Invoice Number</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Customer Name</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Category</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Invoice Date</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Service Date</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Location</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>Actions</strong>
              </TableCell>
              <TableCell>
                {" "}
                <strong>PDF </strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice, index) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>
                  {invoice.listOfServices.length === 1 ? (
                    <span>{invoice.listOfServices[0].name}</span>
                  ) : (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <div className={`chip ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown} style={{ cursor: 'pointer', border: '1px solid #000', padding: '5px', borderRadius: '5px' }}>
                        <b style={{ marginRight: "5px" }}>Multiple</b> {isDropdownOpen ? '▲' : '▼'}
                      </div>
                      {isDropdownOpen && (
                        <ul style={{ paddingLeft: 14 }}>
                          {invoice.listOfServices.map((service, index) => (
                            <li key={index}>{service.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(invoice.invoiceDate), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>
                  {format(new Date(invoice.serviceDate), "yyyy-MM-dd")}
                </TableCell>
                <TableCell>{invoice.serviceCenterLocation}</TableCell>
                <TableCell>
                  <MdCurrencyRupee />
                  {invoice.total}
                </TableCell>
                <TableCell>
                  <Chip
                    label={invoice.status}
                    color={
                      invoice.status === "Completed"
                        ? "primary"
                        : invoice.status === "Pending"
                          ? "warning"
                          : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "8px",
                    }}
                  >
                    <IconButton
                      onClick={() => handleEditClick(index)}
                      style={{ color: "green" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteInvoice(invoice._id)}
                      style={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDownload(invoice._id)}
                    style={{ color: "steelblue" }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Undo Snackbar */}
      <Snackbar
        open={showUndoSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowUndoSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="info">
          Item deleted
          <Button color="secondary" size="small" onClick={handleUndo}>
            UNDO
          </Button>
        </Alert>
      </Snackbar>
      {editMode ? (
        <EditInvoice
          invoiceData={invoices[editIndex]}
          onClose={() => setEditMode(false)}
          onUpdate={handleUpdate} // Pass the callback to update the invoice list
        />
      ) : null}
    </div>
  );
};
export default InvoiceList;
