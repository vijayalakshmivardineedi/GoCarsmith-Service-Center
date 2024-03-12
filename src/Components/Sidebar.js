import * as React from "react";
import { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import RoomIcon from '@mui/icons-material/Room';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import Notifications from '../pages/notification/Notifications';
export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const ServiceCenterString = localStorage.getItem('ServiceCenter');
  const ServiceCenter = JSON.parse(ServiceCenterString);
  const ServiceCenterId = ServiceCenter?._id;
  const token = localStorage.getItem('token');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  console.log(unreadNotificationsCount)
  const serviceCenterName = localStorage.getItem("serviceCenterName");
  const CenterCity = localStorage.getItem("CenterCity");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUnreadNotificationsCount = async () => {
      try {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getUnreadNotificationsCount/${ServiceCenterId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUnreadNotificationsCount(response.data.unviewedCount);
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    };
    fetchUnreadNotificationsCount();
  }, [ServiceCenterId, token]); // Add ServiceCenterId and token as dependencies
  const handleLogOut = async () => {
    try {
      // Retrieve authorization token from local storage
      const token = localStorage.getItem("token");
      console.log("Token", token);
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
      console.error("Error in sigout:", error);
    }
  };
  const location = useLocation();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const getActiveTab = () => {
    const { pathname } = location;
    switch (pathname) {
      case "/ServiceCenter/Dashboard":
        return 0;
      case "/ServiceCenter/Employees":
        return 1;
      case "/ServiceCenter/Customers":
        return 2;
      case "/ServiceCenter/Inventory":
        return 3;
      case "/ServiceCenter/Appointment":
        return 4;
      // case "/Onsite":
      //   return 5
      case "/ServiceCenter/Invoice":
        return 6;
      case "/ServiceCenter/Reviews":
        return 7;
      default:
        return 0;
    }
  };
  const [value, setValue] = useState(getActiveTab());
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // You can also navigate to the corresponding page here if needed
  };
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => navigate("/ServiceCenter/profile")}>Profile</MenuItem>
      <MenuItem onClick={handleLogOut}>Logout</MenuItem>
    </Menu>
  );
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const handleIconButtonClick = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const navigateToNotifications = () => {
    navigate('/ServiceCenter/Notifications');
    handleDrawerClose();
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#FFEEE6", color: "#E74D50" }}
      >
        <Toolbar
          sx={{
            justifyContent: "center",
            borderBottom: "none",
          }}
        >
          <div style={{ margin: 5 }}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block", fontWeight: "700" } }}
            >
              {serviceCenterName}
            </Typography>
            <Typography
              variant="body2"
              noWrap
              component="div"
              sx={{ color: "gray" }}
            >
              <RoomIcon color="primary" />{CenterCity.toUpperCase()}
            </Typography>
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            indicatorColor="#FFEEE6"
          >
            <Tab
              label={
                <Typography sx={{ fontWeight: 700 }}>Dashboard</Typography>
              }
              onClick={() => navigate("/ServiceCenter/Dashboard")}
            />
            <Tab
              label={
                <Typography sx={{ fontWeight: 700 }}>Employees</Typography>
              }
              onClick={() => navigate("/ServiceCenter/Employees")}
            />
            <Tab
              label={
                <Typography sx={{ fontWeight: 700 }}>Customers</Typography>
              }
              onClick={() => navigate("/ServiceCenter/Customers")}
            />
            <Tab
              label={
                <Typography sx={{ fontWeight: 700 }}>Inventory</Typography>
              }
              onClick={() => navigate("/ServiceCenter/Inventory")}
            />
            <Tab
              label={
                <Typography sx={{ fontWeight: 700 }}>Appointments</Typography>
              }
              onClick={() => navigate("/ServiceCenter/appointments")}
            />
            {/* <Tab
              label={
                <Typography sx={{ fontWeight: 700 }}>Onsite</Typography>
              }
              onClick={() => navigate("/Onsite")}
            /> */}
            <Tab
              label={<Typography sx={{ fontWeight: 700 }}>Invoice</Typography>}
              onClick={() => navigate("/ServiceCenter/Invoice")}
            />
            <Tab
              label={<Typography sx={{ fontWeight: 700 }}>Reviews</Typography>}
              onClick={() => navigate("/ServiceCenter/Reviews")}
            />
          </Tabs>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show notifications"
              color="inherit"
              onClick={handleIconButtonClick}
            >
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
              <div role="presentation" onKeyDown={handleDrawerClose} style={{ width: 360, padding: "10px" }}>
                {/* Header */}
                <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px', marginTop: "20px", display: "flex", justifyContent: "space-between", alginItems: "center" }}>
                  <Typography variant="h4" sx={{ fontWeight: "700" }}>Notifications</Typography>
                  <IconButton onClick={handleDrawerClose}>
                    <CloseIcon />
                  </IconButton>
                </div>
                {/* NotificationsPage component is rendered when the drawer is open */}
                <Notifications navigateToNotifications={navigateToNotifications} sx={{ margin: "20px" }} />
              </div>
            </Drawer>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          {renderMenu}
        </Toolbar>
      </AppBar>
    </Box>
  );
}