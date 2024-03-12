import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function PasswordChange() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpRequiredError, setOtpRequiredError] = useState(false);
  const [invalidOtpError, setInvalidOtpError] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true); // New state variable
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();
  const handleOtpChange = (e) => {
    const otpValue = e.target.value;
    setOtp(otpValue);
    setOtpRequiredError(false);
    setInvalidOtpError(false);
    if (otpValue.length === 6) {
      setInvalidOtpError(false);
    } else {
      setInvalidOtpError(true);
    }
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Check if passwords match
    setPasswordMatch(e.target.value === confirmPassword);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Check if passwords match
    setPasswordMatch(e.target.value === password);
  };
  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://gocarsmithbackend.onrender.com/api/serviceCenter/verifyCodeAndResetPassword",
        {
          email: localStorage.getItem("verifiedEmail"),
          code: otp,
          newPassword: password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response) {
        // Password reset successful
        setOpenSnackbar(true);
        setSnackbarMessage("Password reset successful");
        navigate("/");
      } else {
        // Handle other cases, show an error message, etc.
      }
    } catch (error) {
      console.error("Error verifying OTP or updating password:", error);
      setSnackbarMessage("Otp is incorrect");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="xs" style={{ marginTop: "80px" }}>
      <Grid container justifyContent="center">
        <LockOpenIcon style={{ fontSize: 80, color: "green" }} />
      </Grid>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4">Password Reset?</Typography>
        <form>
          <TextField
            fullWidth
            label="OTP"
            variant="outlined"
            margin="normal"
            value={otp}
            onChange={handleOtpChange}
          />
          {otpRequiredError && (
            <p style={{ color: "red", textAlign: "left" }}>OTP is required</p>
          )}
          {invalidOtpError && !otpVerified && (
            <p style={{ color: "red", textAlign: "left" }}>
              OTP should be exactly 6 characters
            </p>
          )}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            // Set label color based on password matching status
            error={!passwordMatch}
            helperText={!passwordMatch && "Passwords do not match"}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
            style={{
              backgroundColor: "black",
            }}
          >
            Submit
          </Button>
          <p
            className="center-text"
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer" }}
          >
            Return to sign in
          </p>
        </form>
      </div>
      {/* Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
export default PasswordChange;