import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Grid,
  Button,
  TextField,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CreateForm from './CreateForm';
import EditInventory from './EditIventory';

const InventoryList = () => {
  const ServiceCenterId = localStorage.getItem("_id");
  const [items, setItems] = useState([]);
  const [serviceCenterItems, setServiceCenterItems] = useState([]);
  const [showEditInventory, setShowEditInventory] = useState(false);
  const [editInventoryData, setEditInventoryData] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/inventoryByServiceCenter/${ServiceCenterId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { items, totalQuantity } = response.data;
      setItems(items);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      setError('Failed to retrieve inventory items');
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const getStockDetailsStyle = (stockCount) => {
    if (stockCount < 10) {
      return { backgroundColor: 'red', fontWeight: '500', fontSize: '15px', color: "white" };
    } else {
      return { backgroundColor: 'green', fontWeight: '500', fontSize: '15px', color: "white" };
    }
  };

  const getStockDetailsText = (stockCount) => {
    if (stockCount === 0) {
      return 'Out Of Stock';
    } else if (stockCount < 10) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  };

  const handleEditClick = (inventoryId) => {
    const selectedInventory = items.find(item => item._id === inventoryId);
    setEditInventoryData(selectedInventory);
    setShowEditInventory(true);
  };

  const handleDeleteItem = (inventoryId) => {
    axios.delete(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/Itemsdelete/${inventoryId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log(response.data.message);
        fetchInventoryItems(); // Fetch inventory items again after deleting
      })
      .catch(error => {
        console.error('Error deleting inventory item:', error);
      });
  };

  const handleCreateEmployee = () => {
    setShowCreateForm(true);
  };

  const handleCloseCreateForm = async () => {
    try {
      setShowCreateForm(false);
      await fetchInventoryItems(); // Wait for data to be fetched
    } catch (error) {
      console.error('Error handling close create form:', error);
    }
  };

  const handleFormSubmit = () => {
    setShowEditInventory(false);
    fetchInventoryItems(); // Fetch inventory items again after editing
  };

  const handleClearSelectedItem = () => {
    setEditInventoryData(null);
  };

  return (
    <div>
      {showCreateForm && (
        <Dialog open={showCreateForm} onClose={handleCloseCreateForm} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: "600", color: "#e74d5a" }}>
            Create Form
          </DialogTitle>
          <DialogContent>
            <CreateForm onFormSubmit={handleFormSubmit} onClose={handleCloseCreateForm}  />
          </DialogContent>
          <DialogActions padding={3}>
            <Button onClick={handleCloseCreateForm} style={{
              border: '2px solid',
              margin: "10px",
              borderColor: '#e74d5a',
              backgroundColor: '#ffeee6',
              borderRadius: '5px',
              color: '#e74d5a',
              fontSize: "11px",
              padding: "8px",
            }}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <div>
        <Grid container alignItems="center" justifyContent="space-between" marginBottom="20px">
          <Grid item>
            <Typography variant="h4" style={{ fontWeight: "700" }}>
              Inventory List
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleCreateEmployee}
              style={{
                border: '2px solid',
                borderColor: '#e74d5a',
                backgroundColor: '#ffeee6',
                borderRadius: '5px',
                color: '#e74d5a',
                fontWeight: "600"
              }}
            >
              + Create Inventory
            </Button>
          </Grid>
        </Grid>

        <div>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#FFEEE6" }}>
                  <TableCell> <strong>Inventory ID</strong> </TableCell>
                  <TableCell> <strong>Inventory Name</strong> </TableCell>
                  <TableCell> <strong>Last Issued Date</strong> </TableCell>
                  <TableCell> <strong>Expiry Date</strong> </TableCell>
                  <TableCell> <strong>Stock Count</strong> </TableCell>
                  <TableCell> <strong>Stock Details</strong> </TableCell>
                  <TableCell> <strong>Actions</strong> </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item._id}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell>{new Date(item.purchaseDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(item.ExpiryDate).toLocaleDateString()}</TableCell>
                    <TableCell>{item.quantityInStock}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStockDetailsText(item.quantityInStock)}
                        style={getStockDetailsStyle(item.quantityInStock)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditClick(item._id)}
                        style={{ color: "green" }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteItem(item._id)}
                        style={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {showEditInventory && editInventoryData && (
        <Dialog open={showEditInventory} onClose={() => setShowEditInventory(false)} fullWidth maxWidth="sm">
          <DialogTitle style={{ fontWeight: "600", color: "#e74d5a" }}>
            Edit Inventory Item
          </DialogTitle>
          <DialogContent>
            <EditInventory items={editInventoryData} onFormSubmit={handleFormSubmit} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditInventory(false)} color="primary" style={{
              border: '2px solid',
              borderColor: '#e74d5a',
              backgroundColor: '#ffeee6',
              borderRadius: '5px',
              color: '#e74d5a',
              fontSize: '11px',
            }}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default InventoryList;
