import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { DateCalendar, DateField } from '@mui/x-date-pickers';
import axios from 'axios';


const FeedbackForm = () => {
    const [serviceCenterId, setServiceCenterId] = useState("");
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [name, setName] = useState('');
    const [serviceCenter, setServiceCenters] = useState([]);

    useEffect(() => {
        // Fetch service centers when the component mounts
        axios.get(`https://gocarsmithbackend.onrender.com/api/serviceCenter/getServiceCenters`)
            .then(response => {
                setServiceCenters(response.data.serviceCenterDetails);
            })
            .catch(error => {
                console.error("Error fetching service centers:", error);
            });
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://gocarsmithbackend.onrender.com/api/ServiceCenterReviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serviceCenterId: serviceCenterId, // Assuming your backend expects the serviceCenterId
                    user: "6593ed2b5a39a13dd8ac4cfa",
                    rating: rating,
                    comment: comment,

                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add the review');
            }

            const data = await response.json();
            console.log('Review added successfully:', data);

            // You can update the UI or show a success message as needed
        } catch (error) {
            console.error('Error adding review:', error);
            // Handle the error state or display an error message in the UI
        }
    };


    const handleCancel = () => {
        // Handle cancel button logic here
        console.log('Form cancelled');
    };

    // const handleChange = (event) => {
    //     setServiceCenters(event.target.value);
    // };

    return (
        <Box sx={{ width: '50%', margin: 'auto', marginTop: '50px', border: '1px solid #ccc', borderRadius: '8px', padding: '16px' }}>
            <h2 sx={{ textAlign: 'center' }}>FEEDBACK</h2>
            <form name="feedback_form" id="feedback_form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            required
                            name="name"
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            sx={{ marginBottom: '16px' }}
                        />
                    </Grid>
                    
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Service Center ID"
                                name="serviceCenterId"
                                variant="outlined"
                                select
                                value={serviceCenterId}
                                onChange={(e) => setServiceCenterId(e.target.value)}
                                style={{ marginBottom: "20px" }}
                            >
                                {serviceCenter.map((center) => (
                                    <MenuItem key={center._id} value={center._id}>
                                        {center.serviceCenterName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                multiline
                                rows={4}
                                required
                                name="comment"
                                label="Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: '16px' }}
                            />
                        </Grid>


                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ marginRight: '8px' }}>Rating:</span>
                            <Rating
                                name="rating"
                                value={rating}
                                onChange={(event, newValue) => setRating(newValue)}
                                sx={{ color: '#fdd835', fontSize: '2rem' }}
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sx={{ marginLeft: '400px' }}>
                        <Button type="button" variant="contained" color="error" size="large" onClick={handleCancel} sx={{ marginRight: '8px' }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="success" size="large">
                            Submit
                        </Button>
                    </Grid>
            </form>
        </Box>
    );
};

export default FeedbackForm;
