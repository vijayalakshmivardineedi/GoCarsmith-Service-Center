import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import axios from "axios";


const CreateRequestForm = ({onClose}) => {


  const [items, setItems] = useState([{ name: "", quantity: "" }]);
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState(false);

  const _id = localStorage.getItem("_id");
  const token = localStorage.getItem("token");

  const data = localStorage.getItem("ServiceCenter");
  const ServiceCenter = JSON.parse(data);
  const email =ServiceCenter.email
console.log(ServiceCenter)
console.log(email)


  // const userCars = JSON.parse(userString);
  // const userCars = JSON.parse(userString);
  // const usermodelId = userCars?.[0]?.modelId;
  
  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: "" }]);
  };
  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      serviceCenterId: _id,
      email:email,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      quantity,
      status,
      // You might need to add more fields here based on your requirements
    };
    try {
      const response = await axios.post(
        "https://gocarsmithbackend.onrender.com/api/serviceCenter/sendInventoryRequest",
        requestData,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          
        }
      );
      
      if(response){
        onClose()
      }
     
      // Add any additional logic or state updates after a successful request creation
    } catch (error) {
      console.error("Error creating request:", error);
      
      // Handle errors or display error messages to the user
    }
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <form onSubmit={handleSubmit}>
      
        <Grid>
          
          {items.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Item Name"
                  name="name"
                  variant="outlined"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  style={{ marginBottom: "20px" }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  variant="outlined"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  style={{ marginBottom: "20px" }}
                />
              </Grid>

              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleRemoveItem(index)}
                  style={{
                    marginTop: "8px",
                    marginBottom: "14px",
                    border: "2px solid",
                    borderColor: "#e74d5a",
                    backgroundColor: "#ffeee6",
                    borderRadius: "5px",
                    color: "#e74d5a",
                    fontSize: "11px",
                    padding: "8px",
                  }}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
           

            <Button
              variant="contained"
              onClick={handleAddItem}
              style={{
                marginBottom: "20px",
                border: "2px solid",
                borderColor: "#e74d5a",
                backgroundColor: "#ffeee6",
                borderRadius: "5px",
                color: "#e74d5a",
                fontSize: "11px",
              }}
            >
              Add Item
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Status"
              name="status"
              variant="outlined"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginBottom: "20px" }}
            />
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              style={{
                marginBottom: "20px",
                border: "2px solid",
                borderColor: "#e74d5a",
                backgroundColor: "#ffeee6",
                borderRadius: "5px",
                color: "#e74d5a",
                fontSize: "11px",
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
export default CreateRequestForm;
