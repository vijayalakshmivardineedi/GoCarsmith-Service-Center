import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
// import Sidebar from '../../components/Sidebar/Sidebar';
import Appointment from './Appointment';
import OnsiteAppointment from './OnsiteAppointment';
import CreateAppointment from './CreateAppointment';

function Details() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3}}>
       
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="User Appointment"  style={{ color: "#e74d5a" , fontWeight:"600" ,fontSize:"18px"}}  />
            <Tab label="Onsite Appointment"  style={{ color: "#e74d5a" , fontWeight:"600" ,fontSize:"18px"}} />
          </Tabs>
        <Box sx={{ marginTop: 2 }}>
          {value === 0 && <Appointment />}
          {value === 1 && <OnsiteAppointment />}
        </Box>
      </Box>
    </Box>
  );
}

export default Details;
