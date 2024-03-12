import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    TextField,
    TextField as MuiTextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const CreateAppointment = ({onClose}) => {
const token = localStorage.getItem('token');
    const navigate = useNavigate()

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        appointmentDate: '',
        timeSlot: '',
    });

    const [totalAmount, setTotalAmount] = useState(0)
    const gst = parseInt(totalAmount * (18 / 100))
    const SafetyFee = 105
    const MiniTotal = totalAmount + gst + SafetyFee
    const Discount = parseInt(MiniTotal * (7 / 100))

    const subTotal = ((MiniTotal) - Discount)
    const [servicesList, setServicesList] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    console.log(totalAmount, gst, SafetyFee, MiniTotal, subTotal, Discount)
    const [initialFormData, setInitialFormData] = useState({

        customerLocation: {
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            phoneNumber: '',
        },
        customerName: '',
        contactNumber: '',
        carModel: '',
        brand: '',
        fuelType: '',
        listOfServices: [],
        email: '',
        appointmentDate: '',
        timeSlot: '',
        status: '',
        paymentMethod: 'cash',
        // Set the default value to 'cash'
    });
    const handleChange = (event) => {
        const { name, value } = event.target;

        // Check if the field is nested within customerLocation
        if (name.startsWith("customerLocation.")) {
            const locationField = name.split(".")[1];

            setInitialFormData((prevData) => ({
                ...prevData,
                customerLocation: {
                    ...prevData.customerLocation,
                    [locationField]: value,
                },
            }));
        } else {
            // If not nested, update directly
            setInitialFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    const serviceCenterId = localStorage.getItem("_id")

    const validateForm = (data) => {
        const errors = {};
        // Add your validation logic here if needed
        return errors;
    };

    const generateTimeSlots = () => {
        const currentDate = new Date();
        const selectedDate = new Date(formData.appointmentDate);

        const currentHour = currentDate.getHours();
        const selectedHour = selectedDate.getHours();

        const timeSlots = [];

        // If the selected date is the same as the current date, start from the current hour
        const startHour = selectedDate.toDateString() === currentDate.toDateString() ? currentHour : 10;

        for (let hour = startHour; hour < 19; hour++) {
            const startHourLabel = hour % 12 || 12;
            const endHourLabel = (hour + 1) % 12 || 12;

            // Determine AM/PM for start and end hours
            const startPeriod = hour < 12 ? 'am' : 'pm';
            const endPeriod = (hour + 1) < 12 ? 'am' : 'pm';

            const label = `${startHourLabel}${startPeriod} - ${endHourLabel}${endPeriod}`;
            const value = `${startHourLabel}-${endHourLabel}`;

            timeSlots.push({ label, value });
        }

        return timeSlots;
    };

    const handleRemoveService = (index) => {
        setInitialFormData((prevData) => {
            const updatedServices = [...prevData.listOfServices];
            updatedServices.splice(index, 1);
            return {
                ...prevData,
                listOfServices: updatedServices,
            };
        });
    };
    const handleAddService = () => {
        setInitialFormData((prevData) => ({
            ...prevData,
            listOfServices: [
                ...prevData.listOfServices,
                { name: "", price: 0 }, // Default values for the new service
            ],
        }));
    };

    const handleServiceChange = (index, field, value) => {
        setInitialFormData((prevData) => {
            const updatedServices = [...prevData.listOfServices];
            updatedServices[index][field] = value;
            return {
                ...prevData,
                listOfServices: updatedServices,
            };
        });
    };

    const calculateCartAmount = () => {
        let total = 0;

        total = initialFormData.listOfServices.reduce((total, item) => (
            total + parseFloat(item.price) // Assuming price is a string, convert it to a number
        ), 0);


        setTotalAmount(total);
    };

    const [modelOptions, setModelOptions] = useState([])
    const [fuelTypes, setFuelTypes] = useState([])
    const [modelDetaill, setModelDetails] = useState({})
    const brandId = initialFormData.brand
    const modelId = initialFormData.carModel
    console.log(brandId, modelId)
    useEffect(() => {

        calculateCartAmount()
        const fetchBrands = async () => {
            try {
                const response = await axios.get('https://gocarsmithbackend.onrender.com/api/serviceCenter/getBrands',
                {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }); // Replace with your actual endpoint
                if (response.status === 200) {
                    setBrandOptions(response.data); // Assuming response.data is an array of brand names
                } else {
                    console.error("Failed to fetch brands");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchBrands();
        const fetchModel = async () => {
            try {
                const response = await axios.get(`https://gocarsmithbackend.onrender.com/api/serviceCenter/getModel/${brandId}`,
                {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }); // Replace with your actual endpoint
                if (response.status === 200) {
                    setModelOptions(response.data); // Assuming response.data is an array of brand names
                } else {
                    console.error("Failed to fetch brands");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchModel()
        const fetchModelDetails = async () => {
            try {
                const response = await axios.get(`https://gocarsmithbackend.onrender.com/api/serviceCenter/getCarModel/${modelId}`,{
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  }); // Replace with your actual endpoint
                if (response.status === 200) {
                    setModelDetails(response.data); // Assuming response.data is an array of brand names
                } else {
                    console.error("Failed to fetch brands");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchModelDetails()
    }, [initialFormData, brandId])
    useEffect(() => {

        const fetchFuelTypes = async () => {
            try {
                const response = await fetch(
                    `https://gocarsmithbackend.onrender.com/api/serviceCenter/getFuelTypesByBrandAndModel/${brandId}/${modelId}`,
                    {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                      }
                );
                if (response.ok) {
                    const data = await response.json();
                    setFuelTypes(data.fuelTypes);
                    console.log("fuelType", data.fuelTypes)
                } else {
                    console.error("Failed to fetch fuel types");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchFuelTypes();
    }, [brandId, modelId]);
    console.log("model Image",modelDetaill)
    const imagePath = modelDetaill.modelImage
    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalData = {
            customerLocation: initialFormData.customerLocation,
            customerName: initialFormData.customerName,
            contactNumber: initialFormData.contactNumber,
            carModel: initialFormData.carModel,
            Brand: initialFormData.brand,
            imagePath: imagePath,
            fuelType: initialFormData.fuelType,
            listOfServices: initialFormData.listOfServices,
            email: initialFormData.email,
            serviceCenterId: serviceCenterId,
            appointmentDate: initialFormData.appointmentDate,
            timeSlot: initialFormData.timeSlot,
            paymentMethod: 'CASH',
            subTotal: subTotal,
            gst: gst,
            Discount: Discount,
            SafetyFee: SafetyFee
        }
        try {
            const response = await axios.post(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/AddAppointment`, finalData, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            if (response.status === 200) {

                onClose()
                window.location.reload(false) 
            } else {

                console.error("Failed to fetch locations");

            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    {/* Customer Name */}
                    <TextField
                        name="customerName"
                        label="Customer Name"
                        value={initialFormData.customerName}
                        onChange={handleChange}
                        error={!!errors.customerName}
                        helperText={errors.customerName}
                        fullWidth
                        required
                        margin="normal"
                    />
                </Grid>


                <Grid item xs={12} md={6}>
                    {/* Contact Number */}
                    <TextField
                        name="contactNumber"
                        label="Contact Number"
                        value={initialFormData.contactNumber}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    {/* Email */}
                    <TextField
                        name="email"
                        label="Email"
                        value={initialFormData.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Brand */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="brandLabel">Brand</InputLabel>
                        <Select
                            labelId="brandLabel"
                            id="brand"
                            name="brand"
                            value={initialFormData.brand || ''} // Assuming brand is an object with an id property
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select Brand</MenuItem>
                            {brandOptions.map((brand) => (
                                <MenuItem key={brand._id} value={brand._id}>
                                    {brand.brandName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Model */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="carModel">Model</InputLabel>
                        <Select
                            labelId="carModel"
                            id="carModel"
                            name="carModel"
                            value={initialFormData.carModel || ''} // Assuming brand is an object with an id property
                            onChange={handleChange}
                        >
                            <MenuItem value="">Select Model</MenuItem>
                            {modelOptions.map((model) => (
                                <MenuItem key={model._id} value={model._id}>
                                    {model.model}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Brand */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="Fuel Type">Fuel Type</InputLabel>
                        <Select
                            name="fuelType"
                            id="SelectFuelType"
                            label="Fuel Type"
                            value={initialFormData.fuelType}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="Select FuelType">Select FuelType</MenuItem>

                            {fuelTypes.map((fuelType) => (
                                <MenuItem key={fuelType} value={fuelType}>
                                    {fuelType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>


                <Grid item xs={12}>
                    {/* List of Services */}
                    {initialFormData.listOfServices.map((service, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <TextField
                                label="name"
                                value={service.name}
                                onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                                fullWidth
                                style={{ marginRight: "20px" }}
                            />
                            <TextField
                                label="price"
                                value={service.price}
                                onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                                type="number"

                            />
                            <Button
                                type="button"
                                onClick={() => handleRemoveService(index)}
                                style={{
                                    marginTop: "8px", marginBottom: "14px", marginLeft: "20px", border: '2px solid',
                                    borderColor: '#e74d5a',
                                    backgroundColor: '#ffeee6',
                                    borderRadius: '5px',
                                    color: '#e74d5a',
                                    fontSize: "13px",
                                    padding: "8px",

                                }}
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <Button style={{
                        marginTop: "8px", border: '2px solid',
                        borderColor: '#e74d5a',
                        backgroundColor: '#ffeee6',
                        borderRadius: '5px',
                        color: '#e74d5a',
                        fontSize: "13px",
                        padding: "8px",

                    }} type="button" onClick={() => handleAddService()}>
                        Add Services
                    </Button>
                </Grid>

                {/* <Grid item xs={12} md={6}>
                  
                    <TextField
                        name="serviceCenterId"
                        label="Service Center ID"
                        value={initialFormData.serviceCenterId}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid> */}
                <Grid item xs={4} >
                    {/* Appointment Date */}
                    <TextField
                        name="appointmentDate"
                        label="Appointment Date"
                        type="date"
                        value={initialFormData.appointmentDate}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: new Date().toISOString().split('T')[0],
                        }}
                    />
                </Grid>

                <Grid item xs={4} >
                    {/* Time Slot */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="timeSlotLabel">Time Slot</InputLabel>
                        <Select
                            labelId="timeSlotLabel"
                            id="timeSlot"
                            name="timeSlot"
                            value={initialFormData.timeSlot}
                            onChange={handleChange}
                        >
                            {generateTimeSlots().map((slot) => (
                                <MenuItem key={slot.value} value={slot.value}>
                                    {slot.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>


                <Grid item xs={4}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="paymentMethodLabel" InputLabelProps={{
                            shrink: true,
                        }}>Payment Method</InputLabel>
                        <Select
                            labelId="paymentMethodLabel"
                            id="paymentMethod"
                            name="paymentMethod"
                            value={initialFormData.paymentMethod}
                            onChange={handleChange}
                            error={!!errors.paymentMethod}

                        >
                            <MenuItem value="cash">Cash</MenuItem>
                        </Select>
                    </FormControl>
                    {errors.paymentMethod && (
                        <div style={{ color: 'red' }}>{errors.paymentMethod}</div>
                    )}
                </Grid>
                <Grid item xs={12} >
                    {/* Customer Location */}
                    <Typography variant="h6">Customer Location</Typography>
                    <TextField
                        name="customerLocation.firstName"
                        label="First Name"
                        value={initialFormData.customerLocation.firstName}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.lastName"
                        label="Last Name"
                        value={initialFormData.customerLocation.lastName}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.address1"
                        label="Address1"
                        value={initialFormData.customerLocation.address1}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.address2"
                        label="address2"
                        value={initialFormData.customerLocation.address2}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.city"
                        label="City"
                        value={initialFormData.customerLocation.city}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.state"
                        label="State"
                        value={initialFormData.customerLocation.state}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.zip"
                        label="Zip"
                        value={initialFormData.customerLocation.zip}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.country"
                        label="Country"
                        value={initialFormData.customerLocation.country}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                    <TextField
                        name="customerLocation.phoneNumber"
                        label="PhoneNumber"
                        value={initialFormData.customerLocation.phoneNumber}
                        onChange={handleChange}
                        margin="normal"
                        required
                        style={{ marginRight: "15px" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{
                            marginBottom: "20px", border: '2px solid',
                            borderColor: '#e74d5a',
                            backgroundColor: '#ffeee6',
                            borderRadius: '5px',
                            color: '#e74d5a',
                            fontSize: "12px",
                        }}
                    >
                        Submit
                    </Button>
                </Grid>

            </Grid>
        </form>
    );
};

export default CreateAppointment;