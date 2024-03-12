import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardHeader, Avatar, Rating, Pagination, Box } from '@mui/material';
const Reviews = () => {
  const reviewsPerPage = 5;
  const serviceCenterId = localStorage.getItem("_id");
  const token = localStorage.getItem("token");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    // Fetch reviews when the component mounts
    fetch(`https://gocarsmithbackend.onrender.com/api/ServiceCenter/ServiceCenterReviews/${serviceCenterId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => response.json())
      .then(data => {
        // Check if the 'reviews' property exists and is an array
        if (data && Array.isArray(data.reviews)) {
          // Filter reviews where the user value is not equal to null
          const filteredReviews = data.reviews.filter(review => review.user !== null);
          setReviews(filteredReviews);
        } else {
          console.error('Invalid data structure received from the API:', data);
          // Handle the unexpected data structure accordingly
        }
      })
      .catch(error => console.error('Error fetching reviews:', error));
  }, [token]);

  
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3}}>
      <Typography variant="h4" gutterBottom  sx={{fontWeight:"700"}}>
        Reviews
      </Typography>
      {currentReviews.map((review) => (
        <Card key={review._id} style={{ marginBottom: '50px',backgroundColor:"#FFEEE6",borderRadius:"12px",boxShadow: '0 8px 8px rgba(0, 0, 0, 0.1)', }}>
          <CardHeader
            avatar={<Avatar>{review.user.firstName ? review.user.firstName.charAt(0) : '?'}</Avatar>}
            title={
              <Typography variant="body1" fontWeight="bold">
              {review.user.firstName ? review.user.firstName.charAt(0).toUpperCase() + review.user.firstName.slice(1) : 'Unknown User'}
          </Typography>
          
          }
            subheader={new Date(review.createdAt).toLocaleString()}
          />
          <CardContent>
            <Typography variant="body1" paragraph>
              {review.comment}
            </Typography>
            <Rating name="read-only" value={review.rating} readOnly />
          </CardContent>
        </Card>
      ))}
      {/* <Pagination
        count={Math.ceil(reviews.length / reviewsPerPage)}
        page={currentPage}
        onChange={(event, page) => paginate(page)}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}
      /> */}
     </Box>
      </Box>
  );
};
export default Reviews;