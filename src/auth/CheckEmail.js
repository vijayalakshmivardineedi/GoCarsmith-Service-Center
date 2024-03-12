import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const CheckEmailVerifiedOrNot = () => {
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const checkEmailVerification = async () => {
    try {
      const response = await fetch(`https://gocarsmithbackend.onrender.com/api/serviceCenter/checkEmailVerified`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('verifiedEmail', email);
        setIsEmailVerified(data.isEmailVerified);
        navigate("/Registration")
      } else {
        // Handle error
        setErrorMessage(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An unexpected error occurred');
    }
  };

  return (
    <card>
    <div style={{ maxWidth: '650px', margin: 'auto', padding: '50px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px',marginTop:'200px' }}>
  <div>
    <TextField
      label="Email"
      variant="outlined"
      fullWidth
      margin="normal"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <Button onClick={checkEmailVerification} variant="contained" color="primary"  sx={{
                                    width: "100%",
                                    backgroundColor: "black",
                                    padding: 2,
                                    fontWeight: 700,
                                    marginTop:"10px",
                                    fontSize: 15,
                                }}>
      Check Email Verification
    </Button>
    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
  </div>
</div>
</card>

  );
};

export default CheckEmailVerifiedOrNot;
