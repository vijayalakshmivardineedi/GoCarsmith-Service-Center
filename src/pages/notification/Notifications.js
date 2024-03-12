import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();
  const serviceCenterString = localStorage.getItem("ServiceCenter");
  const serviceCenter = JSON.parse(serviceCenterString);
  const serviceCenterId = serviceCenter?._id;
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/getNotificationsByReceivers/${serviceCenterId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        const notificationsData = data.notifications;
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [serviceCenterId, token]);
  const formatDateTime = (timestamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };
    return new Date(timestamp).toLocaleString(undefined, options);
  };
  const handleNotificationClick = async (notification) => {
    setSelectedNotification(notification);
    // Mark notification as viewed on the server
    if (!notification.viewed) {
      try {
        await axios.put(
          `https://gocarsmithbackend.onrender.com/api/ServiceCenter/markNotificationsAsViewed`,
          {
            serviceCenterId: serviceCenterId,
            messageId: notification._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update the local state to mark the notification as viewed
        setNotifications((prevNotifications) => {
          return prevNotifications.map((prevNotification) =>
            prevNotification._id === notification._id
              ? { ...prevNotification, viewed: true }
              : prevNotification
          );
        });
      } catch (error) {
        console.error("Error marking notification as viewed:", error);
      }
    }
  };
  const handleCloseCard = () => {
    setSelectedNotification(null);
  };
  return (
    <div>
    {notifications.map((notification) => (
      <div key={notification._id}>
        <Card
          style={{
            color: notification.viewed ? "gray" : "black",
            cursor: "pointer",
            marginBottom: 8,
            width: "50vh",
            backgroundColor: "#FFEEE6",
          }}
          onClick={() => handleNotificationClick(notification)}
        >
          <CardContent>
            <Typography variant="h6">{notification.sender}</Typography>
            <Typography variant="body2">
              {formatDateTime(notification.timestamp)}
            </Typography>
          </CardContent>
        </Card>
        {selectedNotification && selectedNotification._id === notification._id && (
          <Card style={{ width: "50vh",marginBottom:"10px" }}>
            <CardContent style={{ backgroundColor: "#FFE7B0" }}>
              <Typography variant="h6">{selectedNotification.sender}</Typography>
              <Typography variant="body2">
                {formatDateTime(selectedNotification.timestamp)}
              </Typography>
              <Typography>{selectedNotification.message}</Typography>
              <div style={{ textAlign: "right" }}>
                <Button
                  onClick={handleCloseCard}
                  style={{
                    border: '2px solid',
                    borderColor: '#E74D5A',
                    backgroundColor: '#FFEEE6',
                    borderRadius: '5px',
                    color: '#E74D5A',
                    fontSize: "10px",
                    marginTop: "5px",
                  }}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    ))}
  </div>
  );
}
export default Notifications;