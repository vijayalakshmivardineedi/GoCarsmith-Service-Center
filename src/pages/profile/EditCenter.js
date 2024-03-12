import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Paper } from "@mui/material";
import { Form } from "react-router-dom";
import { Button, Typography } from "@mui/material";
const EditCenter = ({onSaveChanges}) => {
  const token = localStorage.getItem('token');
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    secondName: "",
    email: "",
    contactNumber: "",
    profilePicture: "",
    registrationDate: "",
    serviceCenterName: "",
    ServiceCenterActualName: "",
    CenterCity: "",
    CenterState: "",
    CenterCountry: "",
    postalCode: null,
    contactPersonName: "",
  });

  const [loading, setLoading] = useState(true);

  const serviceCenterId = localStorage.getItem("_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/serviceCenter/getServiceCenterDetailsBy/${serviceCenterId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service center data:", error);
      }
    };

    fetchData();
  }, [serviceCenterId]);

  if (!userDetails) {
    return <p>Loading...</p>;
  }
  const handleFileChange = (e) => {
    // Handle file input separately
    const file = e.target.files[0];
    handleChange("profilePicture", file);
  };
  const onSubmitChanges = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append the profilePicture to the FormData if it exists
    if (userDetails.profilePicture) {
      formData.append("profilePicture", userDetails.profilePicture);
    }

    // Append other fields to the FormData
    formData.append("firstName", userDetails.firstName);
    formData.append("secondName", userDetails.secondName);
    formData.append("email", userDetails.email);
    formData.append("contactNumber", userDetails.contactNumber);
    formData.append("registrationDate", userDetails.registrationDate);
    formData.append("serviceCenterName", userDetails.serviceCenterName);
    formData.append(
      "ServiceCenterActualName",
      userDetails.ServiceCenterActualName
    );
    formData.append("CenterCity", userDetails.CenterCity);
    formData.append("CenterState", userDetails.CenterState);
    formData.append("CenterCountry", userDetails.CenterCountry);
    formData.append("postalCode", userDetails.postalCode);
    formData.append("contactPersonName", userDetails.contactPersonName);

    try {
      const response = await axios.put(
        `https://gocarsmithbackend.onrender.com/api/serviceCenter/updateProfileDetailsBy/${serviceCenterId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        onSaveChanges()
        
      }

      // Fetch user details again to update the state
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (field, value) => {
    setUserDetails({ ...userDetails, [field]: value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "auto",
      }}
    >
    

      <div>
        <form onSubmit={onSubmitChanges} action="">
          {/* <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ width: "500px", marginLeft: "250px", marginBottom: "20px" }}
                        /> */}

          <TextField
            value={userDetails.firstName}
            label="First Name"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("firstName", e.target.value)}
          />

          <TextField
            value={userDetails.secondName}
            label="Last Name"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("secondName", e.target.value)}
          />

          <TextField
            value={userDetails.serviceCenterName} // Update to holderName
            label="WorkShop Name"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("serviceCenterName", e.target.value)} // Update to holderName
          />

          <TextField
            value={userDetails.ServiceCenterActualName} // Update to actualName
            label="Branch Name"
            variant="outlined"
            margin="normal"
            onChange={(e) =>
              handleChange("ServiceCenterActualName", e.target.value)
            } // Update to actualName
          />

          <TextField
            value={userDetails.email}
            label="Email"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("email", e.target.value)}
            disabled
          />

          <TextField
            value={userDetails.CenterCity} // Update to address
            label="Center City"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("CenterCity", e.target.value)} // Update to address
          />

          <TextField
            value={userDetails.CenterState} // Update to address
            label="Center State"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("CenterState", e.target.value)} // Update to address
          />

          <TextField
            value={userDetails.CenterCountry} // Update to address
            label="Center Country"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("CenterCountry", e.target.value)} // Update to address
          />

          <TextField
            value={userDetails.postalCode} // Update to address
            label="postal Code"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("postalCode", e.target.value)} // Update to address
          />

          <TextField
            value={userDetails.contactPersonName} // Update to contactPerson
            label="Contact Person"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("contactPersonName", e.target.value)} // Update to contactPerson
          />

          <TextField
            value={userDetails.contactNumber}
            label="Contact Number"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("contactNumber", e.target.value)}
          />

          <TextField
            value={userDetails.registrationDate} // Update to registrationDate
            label="Registration Date"
            variant="outlined"
            margin="normal"
            onChange={(e) => handleChange("registrationDate", e.target.value)} // Update to registrationDate
          />

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              // onClick={updateProfile}
              variant="contained"
              style={{
                marginTop: "8px",
                border: "2px solid",
                borderColor: "#e74d5a",
                backgroundColor: "#ffeee6",
                borderRadius: "5px",
                color: "#e74d5a",
                fontSize: "13px",
                padding: "8px",
              }}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCenter;
