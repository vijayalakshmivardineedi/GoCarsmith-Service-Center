import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Sidebar from '../../Components/Sidebar';
// import ServicesList from './ServicesList';
// import InventoryList from './InventoryList';
// import ReviewsPage from './ReviewsPage';
// import Request from './Request';
import StaffList from './StaffList';

function Details() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '45px' }}>
       
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Staff Details" style={{ color: "#FF5733" , fontWeight:"600" ,fontSize:"16px"}} />
            {/* <Tab label="Services"  style={{ color: "#FF5733" , fontWeight:"600" ,fontSize:"16px"}} />
            <Tab label="Inventory"  style={{ color: "#FF5733" , fontWeight:"600" ,fontSize:"16px"}}  />
            <Tab label="Review and Ratings"  style={{ color: "#FF5733" , fontWeight:"600" ,fontSize:"16px"}} />
            <Tab label="Requests"  style={{ color: "#FF5733" , fontWeight:"600" ,fontSize:"16px"}} /> */}
          </Tabs>
        <Box sx={{ marginTop: 2 }}>
          {value === 0 && <StaffList />}
          {/* {value === 1 && <ServicesList />}
          {value === 2 && <InventoryList />}
          {value === 3 && <ReviewsPage />}
          {value === 4 && <Request />} */}
        </Box>
      </Box>
    </Box>
  );
}

export default Details;
