
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography, IconButton } from '@mui/material';
import BiArrowBack from '@mui/icons-material/ArrowBack';
const EditInventory = ({ items = {}, onFormSubmit }) => {
    const navigate = useNavigate();
    console.log('Inventory in EditInventory:', items);
    const [formData, setFormData] = useState({
        itemName: '',
        serviceCenterID: '',
        categoryID: '',
        purchaseDate: '',
        ExpiryDate: '',
        quantityInStock: '',
        minimumStockLevel: '',
        maximumStockLevel: '',
        locationInServiceCenter: '',
        status: '',
    });

    useEffect(() => {
        // Set the form data when the component mounts
        setFormData({
            serviceCenterID: items.serviceCenterID,
            categoryID: items.categoryID,
            itemName: items.itemName,
            purchaseDate: items.purchaseDate,
            ExpiryDate: items.ExpiryDate,
            quantityInStock: items.quantityInStock,
            minimumStockLevel: items.minimumStockLevel,
            maximumStockLevel: items.maximumStockLevel,
            locationInServiceCenter: items.locationInServiceCenter,
            status: items.status,
        });
    }, [items]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const token = localStorage.getItem("token");
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a PUT request to update the inventory item
            await axios.put(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/updateInventory/${items._id}`, formData,{
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

            // Close the edit form after successful submission
            onFormSubmit();
        } catch (error) {
            console.error('Error updating inventory item:', error);
        }
    };
    const handleBack = () => {
        // Check if onFormSubmit is a function before calling it
        if (typeof onFormSubmit === 'function') {
            // Call the onFormSubmit function to close the edit form
            onFormSubmit();
        } else {
            console.error('onFormSubmit is not a function');
        }
    };


    return (
        <form onSubmit={handleEditSubmit}>

            
            <Grid container spacing={2} sx={{marginTop:"5px"}}>
                
                <Grid item xs={12} md={6} sx={{paddingTop:"15px"}}>
                    <TextField
                        label="Item Name"
                        variant="outlined"
                        name="itemName"
                        value={formData.itemName}

                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6} sx={{paddingTop:"15px"}}>
                    <TextField
                        label="ServiceCenterID"
                        variant="outlined"
                        name="serviceCenterID"
                        value={formData.serviceCenterID}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="CategoryID"
                        variant="outlined"
                        name="categoryID"
                        value={formData.categoryID}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="PurchaseDate"
                        variant="outlined"
                        name="purchaseDate"
                        value={new Date(formData.purchaseDate).toLocaleDateString()}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="QuantityInStock"
                        variant="outlined"
                        name="quantityInStock"
                        value={formData.quantityInStock}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="MinimumStockLevel"
                        variant="outlined"
                        name="minimumStockLevel"
                        value={formData.minimumStockLevel}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="MaximumStockLevel"
                        variant="outlined"
                        name="maximumStockLevel"
                        value={formData.maximumStockLevel}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="LocationInServiceCenter"
                        variant="outlined"
                        name="locationInServiceCenter"
                        value={formData.locationInServiceCenter}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Status"
                        variant="outlined"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>

            </Grid>

            <Button type="submit" variant="contained" color="primary" style={{
                marginTop: '8px',
                marginBottom: '14px',
                border: '2px solid',
                borderColor: '#e74d5a',
                backgroundColor: '#ffeee6',
                borderRadius: '5px',
                color: '#e74d5a',
                fontSize: '12px',
                padding:"10px",
            }}>
                Save
            </Button>
        </form>

    );
};

export default EditInventory;