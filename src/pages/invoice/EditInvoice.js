import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    DialogActions,
} from "@mui/material";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from 'react-router-dom';
import { WindowSharp } from '@mui/icons-material';

const EditInvoice = ({ invoiceData, onClose, onUpdate }) => {
const navigate=useNavigate()
    const [editedInvoiceData, setEditedInvoiceData] = useState({ ...invoiceData });

    useEffect(() => {
        setEditedInvoiceData((prevData) => ({
            ...prevData,
            items: prevData.items,
            addedItems: prevData.addedItems || [],
            listOfServices: prevData.listOfServices || [],
        }));
    }, [invoiceData.items, invoiceData.listOfServices]);

    const [expandedRows, setExpandedRows] = useState({});



    // const  ItemsTotalPrice=editedInvoiceData.addedItems.reduce((accumulator, currentValue)=>{
    //     return (accumulator + (parseInt(currentValue.unitPrice)*parseInt(currentValue.quantity))|0);
    //   },0)
    //   const totalOfLstOfItems=editedInvoiceData.ServiceName.reduce((total, item) => {
    //     return total + parseInt(item.price);
    //   }, 0)
    //   const totalTax=parseInt((parseInt(invoiceData.service_Charges)+totalOfLstOfItems+ItemsTotalPrice)*0.15)
    // const [total,setTotal]=
    // useState(parseInt((totalTax+parseInt(editedInvoiceData.service_Charges)+totalOfLstOfItems+ItemsTotalPrice)-parseInt(editedInvoiceData.discounts)))

    const calculateTotal = (addedItems, listOfServices) => {
        const ItemsTotalPrice = addedItems.reduce((total, item) => {
            return total + parseInt(item.unitPrice) * parseInt(item.quantity);
        }, 0);

        const totalOfLstOfItems = listOfServices.reduce((total, item) => {
            return total + parseInt(item.price);
        }, 0);

        const totalTax = editedInvoiceData.tax;

        const total = (parseInt((totalTax + totalOfLstOfItems + ItemsTotalPrice) + parseInt(editedInvoiceData.SafetyFee)) - parseInt(editedInvoiceData.discounts));

        return total;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedInvoiceData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleItemChange = (index, field, value) => {
        setEditedInvoiceData((prevData) => {
            const updatedItems = [...prevData.addedItems];
            updatedItems[index][field] = value;
            const updatedTotal = calculateTotal(updatedItems, prevData.listOfServices);
            return {
                ...prevData,
                addedItems: updatedItems,
                total: updatedTotal
            };
        });
    };

    const handleAddItem = () => {
        setEditedInvoiceData((prevData) => ({
            ...prevData,
            addedItems: [
                ...prevData.addedItems,
                { description: "", quantity: 1, unitPrice: 0 },
            ],
        }));
    };

    const handleRemoveItem = (index) => {
        setEditedInvoiceData((prevData) => {
            const updatedItems = [...prevData.items];
            updatedItems.splice(index, 1);
            return {
                ...prevData,

                items: updatedItems,
            };
        });
    };

    console.log(editedInvoiceData._id)
    const token = localStorage.getItem("token");

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(
                `https://gocarsmithbackend.onrender.com/api/ServiceCenter/updateInvoice/${editedInvoiceData._id}`,
                editedInvoiceData, {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response) {
                onClose(); // Close the modal
                onUpdate(); // Execute the callback to update the invoice list
            }
        } catch (error) {
            console.error("Error updating invoice:", error);
        }
    };
    
    const generateAdditionalContent = (services) => {
        return (
            <TableCell colSpan={6}>
                <Table>
                    <TableHead>
                        <TableRow>
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
    return (
        <Dialog open={true} >
            <DialogTitle style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color:"#e74d5a"
            }}> Edit Invoice
                <IconButton onClick={onClose} sx={{ color: "black" }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <Box>

                        <TextField
                            name="carModel"
                            value={editedInvoiceData.carModel}
                            onChange={handleChange}
                            margin="normal"
                            required
                            
                        />
                        <TextField
                            name="customerName"
                            value={editedInvoiceData.customerName}
                            onChange={handleChange}
                            margin="normal"
                            required
                            style={{marginLeft:"50px"}}
                        />
                        <TextField
                            name="contactNumber"
                            value={editedInvoiceData.contactNumber}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            name="customerEmail"
                            value={editedInvoiceData.customerEmail}
                            onChange={handleChange}
                            margin="normal"
                            required
                            style={{marginLeft:"50px"}}
                        />
                        <TextField
                            name="serviceDate"
                            value={editedInvoiceData.serviceDate}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            name="status"
                            value={editedInvoiceData.status}
                            onChange={handleChange}
                            margin="normal"
                            required
                            style={{marginLeft:"50px"}}
                        />
                        <TextField
                            name="invoiceNumber"
                            value={editedInvoiceData.invoiceNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            name="InvoiceDate"
                            value={editedInvoiceData.invoiceDate}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Tax"
                            name="tax"
                            value={editedInvoiceData.tax}
                            onChange={handleChange}
                            type="number"
                            margin="normal"
                            required
                        />
                        <TextField
                            label="labourCharges"
                            name="labourCharges"
                            value={editedInvoiceData.labourCharges}
                            onChange={handleChange}
                            margin="normal"
                            type="number"
                            required
                            style={{marginLeft:"50px"}}
                        />
                        <TextField
                            label="service Center Location"
                            name="serviceCenterLocation"
                            value={editedInvoiceData.serviceCenterLocation}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />

                        {expandedRows[editedInvoiceData._id] && generateAdditionalContent(invoiceData.listOfServices)}
                        <TextField
                            label="discounts"
                            name="discounts"
                            value={editedInvoiceData.discounts}
                            onChange={handleChange}
                            margin="normal"
                            type="number"
                            required
                            style={{marginLeft:"50px"}}
                        />
                        <TextField
                            label="SafetyFee"
                            name="SafetyFee"
                            value={editedInvoiceData.SafetyFee}
                            onChange={handleChange}
                            margin="normal"
                            type="number"
                            required
                        />
                        <TextField
                            label="customerLocation"
                            name="customerLocation"
                            value={editedInvoiceData.customerLocation}
                            onChange={handleChange}
                            margin="normal"
                            required
                            style={{marginLeft:"50px"}}
                        />
                        {editedInvoiceData.addedItems?.map((item, index) => (
                            <Box key={index} display="flex" alignItems="center">
                                <TextField
                                    label="Description"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(e, "description", e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    name="description"
                                />
                                <TextField
                                    label="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(e, "quantity", e.target.value)}
                                    type="number"
                                    margin="normal"
                                    name="quantity"
                                />
                                <TextField
                                    label="Unit Price"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                    type="number"
                                    margin="normal"
                                    name="unitPrice"
                                />
                                <Button type="button" onClick={() => handleRemoveItem(index)} style={{
                                    border: '2px solid',
                                    borderColor: '#e74d5a',
                                    backgroundColor: '#ffeee6',
                                    borderRadius: '5px',
                                    color: '#e74d5a',
                                    fontSize: "12px",
                                    padding: "6px",
                                    marginLeft:"10px"
                                }}>
                                    Remove
                                </Button>
                            </Box>
                        ))}


                        <TextField
                            label="total"
                            name="total"
                            value={editedInvoiceData.total}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />

                        <Button type="button" onClick={handleAddItem} style={{
                            border: '2px solid',
                            borderColor: '#e74d5a',
                            backgroundColor: '#ffeee6',
                            borderRadius: '5px',
                            color: '#e74d5a',
                            fontSize: "12px",
                            padding: "6px",
                        }}>
                            Add Items
                        </Button>
                        {/* <Typography variant="h6">Total Amount: {editedInvoiceData.total}</Typography> */}
                        {/* <Button type="submit" variant="contained" color="primary">
                            Save Invoice
                        </Button> */}
                    </Box>
                </form>
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={onClose} color="secondary">
                    Cancel
                </Button> */}
                <button type="submit" onClick={handleSubmit} className="create_button" style={{
                    border: '2px solid',
                    borderColor: '#e74d5a',
                    backgroundColor: '#ffeee6',
                    borderRadius: '5px',
                    color: '#e74d5a',
                    fontSize: "12px",
                    padding: "6px",
                }}>
                    Save Invoice
                </button>
            </DialogActions>
        </Dialog>
    );
};
export default EditInvoice;