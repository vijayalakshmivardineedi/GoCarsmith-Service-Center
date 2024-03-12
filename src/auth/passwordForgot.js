import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HttpsIcon from "@mui/icons-material/Https";
import { Link } from "react-router-dom";


function PasswordForgott() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [invalidEmailError, setInvalidEmailError] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailRequiredError(false);
    setInvalidEmailError(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleButtonClick  = async () => {
    console.log("Button clicked");
  
    if (!email) {
      console.log("Email is required");
      setEmailRequiredError(true);
      setOpenSnackbar(true);
    } else if (!isValidEmail(email)) {
      console.log("Invalid email format");
      setInvalidEmailError(true);
      setOpenSnackbar(true);
    } else {
      try {
        const response = await axios.post(
          "https://gocarsmithbackend.onrender.com/api/serviceCenter/forgotPassword",
          { email }
        );
  
        console.log("Response:", response);
  
        if (response) {
          // Store email in localStorage
          localStorage.setItem("verifiedEmail", email);
  
          
          navigate("/ChangePassword");
        } else {
          console.log("Handle other cases, show an error message, etc.");
        }
      } catch (error) {
        console.error("Error sending password reset request:", error);
        // Handle the error, show an error message, etc.
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <br />
      <br />
      <br />
      <br />
      <div style={{ textAlign: "center" }}>
        <HttpsIcon style={{ fontSize: 120, color: "green" }} />
        <Typography variant="h4">Forgot your password?</Typography>
        <p style={{ color: "gray" }}>
          Please enter the email address associated with your account, and we
          will email you a link to reset your password.
        </p>
        <form>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={handleEmailChange}
          />
          {emailRequiredError && (
            <p style={{ color: "red", textAlign: "left", marginTop: "-2px" }}>
              Email is required
            </p>
          )}
          {invalidEmailError && (
            <p style={{ color: "red", textAlign: "left" , marginTop:"-2px"}}>
              Invalid email format
            </p>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            sx={{
              backgroundColor: "black",
              color: "white",
              fontSize: "16px",
              marginTop: "10px"
            }}
          >
            Send Request
          </Button>
          <Link to="/login">
            <p className="center-text" sx={{color: "black"}}>Return to sign in</p>
          </Link>
        </form>
      </div>

      {/* Dialog to show a confirmation message
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Password Reset Email Sent</DialogTitle>
        <DialogContent>
          We have sent a password reset link to your email address. Please check
          your email.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            color="primary"
            variant="contained"
            style={{ backgroundColor: "black", color: "white" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Snackbar for showing an error message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error">
          {emailRequiredError
            ? "Please enter a valid email address."
            : "Invalid email format."}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PasswordForgott;

