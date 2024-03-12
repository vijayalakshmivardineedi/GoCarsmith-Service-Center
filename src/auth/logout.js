import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignOut = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      // Retrieve authorization token from local storage
      const token = localStorage.getItem("token");
      console.log(token);
      // Make a request to the signout API endpoint with the authorization header
      const response = await axios.post(
        "https://gocarsmithbackend.onrender.com/api/serviceCenter/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Successfully signed out

        // Clear all items from local storage
        localStorage.clear();
        // Redirect to the login page or any other desired page
        navigate("/");
      } else {
        // Failed to sign out
        console.error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleLogOut}>
      LOGOUT
    </button>
  );
};

export default SignOut;