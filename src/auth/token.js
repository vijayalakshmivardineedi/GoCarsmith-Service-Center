import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Token = () => {
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleBeforeUnload = () => {
    // Check if the page is being closed
    if (!navigator.sendBeacon) {
      // Page is being closed, clear local storage
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      localStorage.clear();
    }
  };

  const handleUserActivity = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    let inactiveTime = 0;

    const setUserActive = () => {
      inactiveTime = 0;
    };

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, setUserActive);
    });

    const checkInactive = () => {
      inactiveTime += 100;

      if (inactiveTime >= 300000) {
        // 5 minutes (300,000 milliseconds)
        localStorage.clear();
        setShowModal(true);
      } else {
        setTimeout(checkInactive, 100);
      }
    };

    setTimeout(checkInactive, 100);
  };

  const handleLogout = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    localStorage.clear();
    setShowModal(false);

    navigate('/login');
  };

  const handleClose = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    setShowModal(false);
  };

  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    const handleUserActivityWrapper = () => {
      handleUserActivity();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivityWrapper);
    });

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleBeforeUnload);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivityWrapper);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleBeforeUnload);

      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [logoutTimer]);

  return (
    <div>
      {/* Your route component content */}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Session expired</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Token;