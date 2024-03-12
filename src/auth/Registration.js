import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const Registration = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [serviceCenterData, setServiceCenterData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const getEmailFromLocalStorage = () => {
    return localStorage.getItem('verifiedEmail') || '';
  };

  const getServiceCenterByEmail = async (email) => {
    try {
      const response = await fetch(`https://gocarsmithbackend.onrender.com/api/admin/serviceCenter/getservicecenterbyemail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setServiceCenterData(data.adminCreation);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getLocations = async () => {
    try {
      const response = await fetch('https://gocarsmithbackend.onrender.com/api/admin/getLocations');
      const data = await response.json();

      if (response.ok) {
        setLocations(data.locationList);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const emailFromLocalStorage = getEmailFromLocalStorage();

    if (emailFromLocalStorage) {
      getServiceCenterByEmail(emailFromLocalStorage);
    }

    getLocations();
  }, []);

  const handleFormSubmit = async (formData) => {
    const updatedFormData = { ...formData, locations: selectedLocation };

    console.log('Request Payload:', JSON.stringify(updatedFormData));

    if (typeof onSubmit === 'function') {
      onSubmit(updatedFormData);
    }

    try {
      const response = await fetch('https://gocarsmithbackend.onrender.com/api/serviceCenter/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      const data = await response.json();

      console.log('Response from Backend:', data);

      if (response.ok) {
        console.log('Signup successful:', data.message);
      } else {
        console.error('Signup error:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>


        <TextField
          {...register('serviceCenterId', { required: 'Service Center Id is required' })}
          label="Service Center Id"
          variant="outlined"
          fullWidth
          margin="normal"
          value={serviceCenterData && serviceCenterData.serviceCenterId ? serviceCenterData.serviceCenterId : ''}
          error={!!errors.serviceCenterId}
          helperText={errors.serviceCenterId && errors.serviceCenterId.message}
        />



        <TextField
          {...register('firstName', { required: 'First Name is required' })}
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.firstName}
          helperText={errors.firstName && errors.firstName.message}
        />
        <TextField
          {...register('secondName', { required: 'Second Name is required' })}
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.secondName}
          helperText={errors.secondName && errors.secondName.message}
        />
        <TextField
          {...register('serviceCenterName', { required: 'Your Service Center Name is required' })}
          label="Your Service Center Name"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.serviceCenterName}
          helperText={errors.serviceCenterName && errors.serviceCenterName.message}
        />


        <TextField
          {...register('ServiceCenterActualName', { required: 'Company Name is required' })}
          label="Company Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={serviceCenterData && serviceCenterData.ServiceCenterActualName ? serviceCenterData.ServiceCenterActualName : ''}
          error={!!errors.ServiceCenterActualName}
          helperText={errors.ServiceCenterActualName && errors.ServiceCenterActualName.message}
        />

        <TextField
          {...register('email', { required: 'Email is required' })}
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={serviceCenterData && serviceCenterData.email ? serviceCenterData.email : ''}
          error={!!errors.email}
          helperText={errors.email && errors.email.message}
        />


        <TextField
          {...register('CenterCity', { required: 'City is required' })}
          label="City"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.CenterCity}
          helperText={errors.CenterCity && errors.CenterCity.message}
        />
        <TextField
          {...register('CenterState', { required: 'State is required' })}
          label="State"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.CenterState}
          helperText={errors.CenterState && errors.CenterState.message}
        />
        <TextField
          {...register('CenterCountry', { required: 'Country is required' })}
          label="Country"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.CenterCountry}
          helperText={errors.CenterCountry && errors.CenterCountry.message}
        />

        <TextField
          {...register('postalCode', { required: 'Postal Code is required' })}
          label="Postal Code"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.postalCode}
          helperText={errors.postalCode && errors.postalCode.message}
        />


        <TextField
          {...register('contactPersonName', { required: 'Center Incharge is required' })}
          label="Center Incharge"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.contactPersonName}
          helperText={errors.contactPersonName && errors.contactPersonName.message}
        />

        <TextField
          {...register('contactNumber', { required: 'Contact Number is required' })}
          label="Contact Number"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.contactNumber}
          helperText={errors.contactNumber && errors.contactNumber.message}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            {...register('location', { required: 'Location is required' })}
            labelId="location-label"
            label="Location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            error={!!errors.location}
          >
            {locations && locations.map((location) => (
              <MenuItem key={location._id} value={location._id}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <TextField
          {...register('password', { required: 'Password is required' })}
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password && errors.password.message}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default Registration;