import React, { useState } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AuthService from "../services/authService";

// Styled Components
const DashboardHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f8f9fa;
`;

const DashboardTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`;

const UserImage = styled(Image)`
  width: 40px;
  height: 40px;
  object-fit: cover;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const UserDropdownToggle = styled(Dropdown.Toggle)`
  border: none;
  background: none;
  cursor: pointer;

  &::after {
    display: none; /* Hide default caret */
  }
`;

const DashboardHeader = ({ userName, userImage }) => {
  const [showDropdown, setShowDropdown] = useState(false);
 const navigate = useNavigate();


  const handleLogout = () => {
    // Handle logout functionality here
    AuthService.clearAuth();
    navigate("/");
  };

  const handleProfileClick = () => {
    // Redirect to profile page or open profile modal
    console.log("Profile");
  };

  return (
    <DashboardHeaderContainer className="mb-3">
      <DashboardTitle>Dashboard</DashboardTitle>

      <UserProfile>
        <UserImage
          src={userImage || "https://placehold.co/40x40"} // Placeholder image
          roundedCircle
        />
        <UserName>{userName}</UserName>

        <Dropdown show={showDropdown} onToggle={setShowDropdown}>
          <UserDropdownToggle variant="link">▼</UserDropdownToggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </UserProfile>
    </DashboardHeaderContainer>
  );
};

export default DashboardHeader;
