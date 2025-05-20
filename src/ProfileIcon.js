import React, { useState, useEffect } from "react";
import "./ProfileIcon.css";

const ProfileIcon = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger re-render

  useEffect(() => {
    console.log("User object:", user); // Log the user object to inspect its structure
  }, [user]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (showDropdown) {
      const interval = setInterval(() => {
        setRefreshKey((prevKey) => prevKey + 1); // Increment key to refresh
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount or dropdown close
    }
  }, [showDropdown]);

  const getInitials = () => {
    if (user?.Parent_Name && user.Parent_Name.trim() !== "") {
      return user.Parent_Name
        .split(" ")
        .map((n) => n[0]?.toUpperCase())
        .join("");
    } else if (user?.email) {
      return user.email[0]?.toUpperCase();
    }
    return "?";
  };

  return (
    <div className="profile-icon-container">
      {/* Profile Icon */}
      <div className="circle" onClick={toggleDropdown}>
        {getInitials()}
      </div>

      {/* Dropdown Info */}
      {showDropdown && (
        <div className="dropdown" key={refreshKey}>
          <p><strong>Parent Name:</strong> {user?.Parent_Name}</p> {/* Display Parent_Name */}
          <p><strong>Name:</strong> {user?.name }</p> {/* Display Name */}
          <p><strong>Email:</strong> {user?.email}</p> {/* Display Email */}
          <p><strong>Student ID:</strong> {user?.Student_ID }</p> {/* Display Student ID */}
          <p><strong>Password:</strong> {"*".repeat(user?.password?.length || 0)}</p> {/* Hide Password */}
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
