
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";

const CreateInvoice = ({ appointmentData, onClose }) => {
  const token = localStorage.getItem("token");
  const [invoiceType, setInvoiceType] = useState("");
  const handleInvoiceTypeChange = (event) => {
    setInvoiceType(event.target.value);
  };

  const [isClose, setIsClose] = useState(true);
  const [invoiceData, setInvoiceData] = useState({
    ...appointmentData,
    items: [],
    listOfServices:appointmentData.listOfServices,
    bookingId: appointmentData._id || null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  
  const handleItemChange = (index, field, value) => {
    setInvoiceData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems[index][field] = value;
      return {
        ...prevData,
        items: updatedItems,
      };
    });
  };

  const handleAddItem = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { description: "", quantity: 1, unitPrice: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setInvoiceData((prevData) => {
      const updatedItems = [...prevData.items];
      updatedItems.splice(index, 1);
      return {
        ...prevData,
        items: updatedItems,
      };
    });
  };

  const handleServiceChange = (index, field, value) => {
    setInvoiceData((prevData) => {
      const updatedServices = [...prevData.listOfServices];
      updatedServices[index][field] = value;
      return {
        ...prevData,
        listOfServices: updatedServices,
      };
    });
  };

  const handleAddService = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      listOfServices: [
        ...prevData.listOfServices,
        { name: "", price: 0 }, // Default values for the new service
      ],
    }));
  };

  const handleRemoveService = (index) => {
    setInvoiceData((prevData) => {
      const updatedServices = [...prevData.listOfServices];
      updatedServices.splice(index, 1);
      return {
        ...prevData,
        listOfServices: updatedServices,
      };
    });
  };

  const ItemsTotalPrice = invoiceData.items.reduce((total, item) => {
    return (total+ (parseInt(item.unitPrice) * parseInt(item.quantity))
    );
  }, 0);



  const totalOfLstOfItems = invoiceData.listOfServices.reduce(
    (total, item) => total + parseInt(item.price),
    0
  );
 

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!invoiceData.bookingId) {
      console.error("BookingId is required");
      return;
    } else {
      console.log("bookingId Is there");
    }

    try {
      const invoiceDataToSend = {
        customerName: invoiceData.customerName,
        contactNumber: invoiceData.contactNumber,
        fuelType: invoiceData.fuelType,
        carModel: invoiceData.carModel,
        listOfServices: invoiceData.listOfServices,
        email: invoiceData.email,
        serviceCenterId: invoiceData.serviceCenterId,
        status: invoiceData.status,
        serviceCenterLocation: invoiceData.serviceCenterLocation,
        bookingId: invoiceData.bookingId,
        serviceDate: invoiceData.ServiceDate,
        tax: invoiceData.gst,
        SafetyFee:appointmentData.SafetyFee,
        labourCharges: parseFloat(invoiceData.labourCharges),
        discounts: invoiceData.Discount,
        customerLocation: invoiceData.customerLocation,
        items: invoiceData.items,
        total: (((invoiceData.gst ) +parseInt(invoiceData.labourCharges ) +
        totalOfLstOfItems  +ItemsTotalPrice  )-
        (parseInt(invoiceData.Discount))+appointmentData.SafetyFee ) || 0,
      };
    

      const response = await axios.post(
        "https://gocarsmithbackend.onrender.com/api/ServiceCenter/invoiceGenerate", invoiceDataToSend,{
          headers: { Authorization: `Bearer ${token}` },
        });

      if (response) {
        handleClose();
        console.log(response)
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };


  const handleClose = () => {
    setIsClose(false);
    onClose();
  };

  return (
    <Dialog open={isClose} onClose={handleClose}>
      <DialogTitle sx={{fontWeight:"700" , color:"#e74d5a"}}>Create Invoice</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box>
            <TextField
              name="bookingId"
              value={invoiceData.bookingId}
              onChange={handleChange}
              margin="normal"
              required
               sx={{marginRight:"20px"}}
            />
            <TextField
              name="userId"
              value={invoiceData.userId}
              onChange={handleChange}
              margin="normal"
              required
              
              sx={{marginRight:"20px"}}
            />
            <TextField
              name="customerName"
              value={invoiceData.customerName}
              onChange={handleChange}
              margin="normal"
              required
              sx={{marginRight:"20px"}}
            />
            <TextField
              name="contactNumber"
              value={invoiceData.contactNumber}
              onChange={handleChange}
              margin="normal"
              required
              sx={{marginRight:"20px"}}
            />
            
            <TextField
              name="email"
              value={invoiceData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{marginRight:"20px"}}
            />
            <TextField
              name="carModel"
              value={invoiceData.carModel}
              onChange={handleChange}
              margin="normal"
              required
              sx={{marginRight:"20px"}}
            />

            <TextField
              name="status"
              value={invoiceData.status}
              onChange={handleChange}
              margin="normal"
              required
              sx={{marginRight:"20px"}}
            />

            <TextField
              label="service Center Location"
              name="serviceCenterLocation"
              value={invoiceData.serviceCenterLocation}
              onChange={handleChange}
              type="text"
              margin="normal"
              required
              sx={{marginRight:"20px"}}
            />
            <TextField
              name="ServiceDate"
              value={invoiceData.ServiceDate}
              onChange={handleChange}
              margin="normal"
              required
              type="Date"
            />
            <FormControl fullWidth>
              <InputLabel id="invoiceTypeLabel">Invoice Types:</InputLabel>
              <Select
                labelId="invoiceTypeLabel"
                id="invoiceType"
                value={invoiceType}
                label="Invoice Type"
                onChange={handleInvoiceTypeChange}
              >
                <MenuItem value="booking">Booking Invoice</MenuItem>
                <MenuItem value="onsite">Onsite Invoice</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="labourCharges"
              name="labourCharges"
              value={invoiceData.labourCharges}
              onChange={handleChange}
              margin="normal"
              type="number"
              required
              sx={{marginRight:"20px"}}
              
            />
            <TextField
              label="discounts"
              name="discounts"
              value={invoiceData.Discount}
              onChange={handleChange}
              margin="normal"
              type="number"
              required
              sx={{marginRight:"20px"}}
            />
           
            <TextField
              label="customerLocation"
              name="customerLocation"
              value={invoiceData.customerLocation}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            {invoiceData.items.map((item, index) => (
              <Box key={index} display="flex" alignItems="center">
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  fullWidth
                  sx={{marginRight:"20px"}}
                />
                <TextField
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  type="number"
                  sx={{marginRight:"20px"}}
                />
                <TextField
                  label="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(index, "unitPrice", e.target.value)
                  }
                  type="number"
                  sx={{marginRight:"20px"}}
                />
                <Button type="button" onClick={() => handleRemoveItem(index)} style={{
                       marginTop: "8px", border: '2px solid',
                        marginLeft:1,
                      borderColor: '#e74d5a',
                      backgroundColor: '#ffeee6',
                     borderRadius: '5px',
                    color: '#e74d5a',
                    fontSize: "13px",
                     padding: "6px",

              }}>
            Remove
          </Button>
              </Box>
            ))}
             <Button type="button" onClick={() => handleAddItem()} style={{
                        marginTop: "10px",
                        border: '2px solid',
                        borderColor: '#e74d5a',
                        backgroundColor: '#ffeee6',
                        borderRadius: '5px',
                        color: '#e74d5a',
                        fontSize: "13px",
                        padding: "6px",
marginBottom:"10px"
                    }}>
              Add Items
            </Button>

            {/* Services Section */}
            {invoiceData.listOfServices.map((service, index) => (
              <Box key={index} display="flex" alignItems="center">
                
                <TextField
                  label="name"
                  value={service.name}
                  onChange={(e) =>
                    handleServiceChange(index, "name", e.target.value)
                  }
                  fullWidth
                  sx={{marginRight:"20px"}}
                />
                <TextField
                  label="price"
                  value={service.price}
                  onChange={(e) =>
                    handleServiceChange(index, "price", e.target.value)
                  }
                  type="number"
                  sx={{marginRight:"20px"}}
                />
                       <Button
                  type="button"
                  onClick={() => handleRemoveService(index)}
                  style={{
                    marginTop: "8px",
                    border: '2px solid',
                    borderColor: '#e74d5a',
                    backgroundColor: '#ffeee6',
                    borderRadius: '5px',
                    color: '#e74d5a',
                    fontSize: "13px",
                    padding: "6px",

                }}>
                
                  Remove
                </Button>
              </Box>
            ))}
                   <Button type="button" onClick={() => handleAddService()} style={{
                        marginTop: "8px",
                        border: '2px solid',
                        borderColor: '#e74d5a',
                        backgroundColor: '#ffeee6',
                        borderRadius: '5px',
                        color: '#e74d5a',
                        fontSize: "13px",
                        padding: "6px",

                    }}>
              Add Services
            </Button>
            <Button type="submit" variant="contained" color="primary" style={{
                        marginTop: "8px",
                        border: '2px solid',
                        borderColor: '#e74d5a',
                        backgroundColor: '#ffeee6',
                        borderRadius: '5px',
                        color: '#e74d5a',
                        fontSize: "13px",
                        padding: "6px",
                        marginLeft:"10px",
                    }}>
              Save Invoice
            </Button>
          </Box>
        </form>
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
  );
};

export default CreateInvoice