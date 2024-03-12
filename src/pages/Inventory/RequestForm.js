import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateRequestForm from "./CreateRequestForm";
import RequestFormEdit from "./RequestFormEdit";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";

const RequestForm = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showCreateRequestForm, setShowCreateRequestForm] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [deletedItem, setDeletedItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showRequestFormEdit, setShowRequestFormEdit] = useState(false);
  const [RequestDataedit, setRequestDataEdit] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [serviceCenterRequests, setServiceCenterRequests] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Add this line

  const _id = localStorage.getItem("_id");
  const token = localStorage.getItem("token");

  const handleCreateRequest = async () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = async () => {
    try {
      setShowCreateForm(false);
      await fetchRequestDetails();
    } catch (error) {
      console.error('Error handling close create form:', error);
    }
  };

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`https://gocarsmithbackend.onrender.com/api/serviceCenter/getInventoryRequest/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRequestEdit = (requestId) => {
    const requestToEdit = requests.find((request) => request._id === requestId);
    if (requestToEdit) {
      setRequestDataEdit(requestToEdit);
      setShowEditForm(true);
    } else {
      console.error(`Request with ID ${requestId} not found.`);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`https://gocarsmithbackend.onrender.com/api/serviceCenter/deleteRequestById/${selectedRequestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response && response.data) {
        const updatedResponse = await axios.get(`https://gocarsmithbackend.onrender.com/api/serviceCenter/getInventoryRequest/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (updatedResponse && updatedResponse.data) {
          setRequests(updatedResponse.data);
          setSnackbarOpen(true);  // Add this line
          setDeleteDialogOpen(false);
        }
      }
    } catch (error) {
      console.error("Error updating or fetching data:", error);
    }
  };


  const handleCancel = () => {
    setSelectedRequestId(null);
    setOpenApproveDialog(false);
    setOpenRejectDialog(false);
  };

  const handleDelete = (id) => {
    setSelectedRequestId(id);
    setDeleteDialogOpen(true);
  };

  const handleUndo = () => {
    if (deletedItem) {
      setRequests((prevRequests) => [...prevRequests, deletedItem]);
      setDeletedItem(null);
      setSnackbarOpen(false);
    }
  };

  useEffect(() => {
    const getInventoryRequestDetails = async () => {
      try {
        const response = await axios.get(`https://gocarsmithbackend.onrender.com/api/serviceCenter/getInventoryRequest/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response && response.data) {
          setRequests(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getInventoryRequestDetails();
  }, [_id, token]);


  useEffect(() => {
    setServiceCenterRequests(requests);
  }, [requests]);

  return (
    <div>
      <Grid container alignItems="center" justifyContent="space-between" marginBottom="20px">
        <Grid item>
          <Typography variant="h4" style={{ fontWeight: "700" }}>
            Inventory Requests
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleCreateRequest}
            style={{
              border: "2px solid",
              borderColor: "#e74d5a",
              backgroundColor: "#ffeee6",
              borderRadius: "5px",
              color: "#e74d5a",
              fontWeight: "600",
            }}
          >
            + Create Request
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#FFEEE6" }}>
              <TableCell> <strong>ID</strong> </TableCell>
              <TableCell> <strong>Name</strong> </TableCell>
              <TableCell> <strong>Quantity</strong> </TableCell>
              <TableCell> <strong>Status</strong> </TableCell>
              <TableCell> <strong>Actions</strong> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request._id}</TableCell>
                <TableCell>
                  {request.items.map((ite) => (
                    <li key={ite._id}>{ite.name}</li>
                  ))}
                </TableCell>
                <TableCell>
                  {request.items.map((ite) => (
                    <li key={ite._id} style={{ listStyleType: "none" }}>
                      {ite.quantity}
                    </li>
                  ))}
                </TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <>
                    <IconButton
                      onClick={() => handleRequestEdit(request._id)}
                      style={{ color: "green" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(request._id);
                      }}
                      style={{ color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showEditForm} onClose={() => setShowEditForm(false)}>
        <DialogTitle style={{ fontWeight: "600", color: "#e74d5a" }}>Edit Request</DialogTitle>
        <DialogContent>
          <RequestFormEdit requests={RequestDataedit} onFormSubmit={() => setShowEditForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateForm} onClose={handleCloseCreateForm}>
        <DialogTitle style={{ fontWeight: "600", color: "#e74d5a" }}>Create Request</DialogTitle>
        <DialogContent>
          <CreateRequestForm onFormSubmit={() => setShowCreateForm(false)} onClose={handleCloseCreateForm} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseCreateForm}
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
  );
};

export default RequestForm;
