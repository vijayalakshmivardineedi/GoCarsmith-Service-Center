import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';

const AddInventoryItemForm = ({onClose}) => {
    const [categories, setCategories] = useState([]);
    const [serviceCenterID, setServiceCenterId] = useState([]);
    const [categoryID, setCategoryID] = useState("");
    const [serviceCenter, setServiceCenters] = useState([]);
    const [selectedServiceCenterIds, setSelectedServiceCenterIds] = useState([]);
    const _id = localStorage.getItem("_id");
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        categoryID: '',
        serviceCenterID: _id,
        itemName: '',
        purchaseDate: '',
        ExpiryDate: '',
        quantityInStock: '',
        minimumStockLevel: '',
        maximumStockLevel: '',
        locationInServiceCenter: '',
        status: '',
    });

    // Handler for form input changes
    const handleInputChange = (e) => {
        if (e.target.name === 'serviceCenterID') {
            setServiceCenterId(e.target.value);
        }
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Make a POST request to the backend endpoint to add an inventory item
            await axios.post(
                `https://gocarsmithbackend.onrender.com/api/ServiceCenter/addInventoryItem`,
                {
                  ...formData,
                  serviceCenterID: _id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            

            // Reset the form after successful submission
            setFormData({
                categoryID: '',
                serviceCenterID: _id,
                itemName: '',
                purchaseDate: '',
                ExpiryDate: '',
                quantityInStock: '',
                minimumStockLevel: '',
                maximumStockLevel: '',
                locationInServiceCenter: '',
                status: '',
            });
            onClose()
            console.log('Inventory item added successfully');
            
        } catch (error) {
            console.error('Error adding inventory item:', error);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("https://gocarsmithbackend.onrender.com/api/serviceCenter/getcategories/get", {
                      method: 'GET',
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                });
                if (response.ok) {
                    const data = await response.json(); // Parse the response
                    setCategories(data);
                    console.log(data); // Log the data received from the API
                } else {
                    console.error("Failed to fetch categories");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        // Call the fetchCategories function when the component mounts
        fetchCategories();
    }, []);

    const handleCategoryChange = (e) => {
        const selectedCategoryID = e.target.value;

        // Update both categoryID state and formData.categoryID
        setCategoryID(selectedCategoryID);
        setFormData({
            ...formData,
            categoryID: selectedCategoryID,
        });

        console.log('Selected category ID:', selectedCategoryID);
        console.log('Form data:', formData); // Log the entire formData
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ marginTop:"5px"}}>
                <TextField
                    label="Item Name"
                    variant="outlined"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    fullWidth
                    size="medium"
                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                />
                <TextField
                    fullWidth
                    label="CategoryID"
                    name="categoryID"
                    variant="outlined"
                    select
                    size="medium"
                    value={categoryID}

                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                    onChange={handleCategoryChange}
                >
                    {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>
              
                <TextField
                    label="PurchaseDate"
                    variant="outlined"
                    type='date'
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    fullWidth
                    size="medium"
                    InputLabelProps={{ shrink: true }} // Add this line
                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                />
                <TextField
                    label="QuantityInStock"
                    variant="outlined"
                    name="quantityInStock"
                    value={formData.quantityInStock}
                    onChange={handleInputChange}
                    fullWidth
                    size="medium"
                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                />
                <TextField
                    label="Expiry Date"
                    variant="outlined"
                    name="ExpiryDate"
                    type='date'
                    value={formData.ExpiryDate}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }} // Add this line
                    size="medium"
                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                />
                <TextField
                    label="MinimumStockLevel"
                    variant="outlined"
                    name="minimumStockLevel"
                    value={formData.minimumStockLevel}
                    onChange={handleInputChange}
                    fullWidth
                    size="medium"
                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                />
                <TextField
                    label="MaximumStockLevel"
                    variant="outlined"
                    name="maximumStockLevel"
                    value={formData.maximumStockLevel}
                    onChange={handleInputChange}
                    fullWidth
                    size="medium"
                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                />
                <TextField
                    label="LocationInServiceCenter"
                    variant="outlined"
                    name="locationInServiceCenter"
                    value={formData.locationInServiceCenter}
                    onChange={handleInputChange}
                    fullWidth
                    size="medium"
                    sx={{ marginBottom: 2, marginRight: 2, width: '40%' }}
                />
                <TextField
                    label="Status"
                    variant="outlined"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    fullWidth
                    size="medium"
                    sx={{ marginBottom: 1, width: '40%' }}
                />
            </Box>



            <Button type="submit" variant="contained" style={{
                  border: '2px solid',
                    borderColor: '#e74d5a',
                    backgroundColor: '#ffeee6',
                    borderRadius: '5px',
                    color: '#e74d5a',
                    fontSize: "11px",
                    padding: "8px",
                  }}>
                Add Inventory Item
            </Button>
        </form>
    );
};
export default AddInventoryItemForm;