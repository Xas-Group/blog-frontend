import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";

// Styled components
const UnauthorizedContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const UnauthorizedCard = styled.div`
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  max-width: 500px;
  width: 100%;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #dc3545;
`;

const ErrorMessage = styled.h3`
  font-size: 1.5rem;
  color: #6c757d;
  margin-bottom: 20px;
`;

const ErrorDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
`;

function Unauthorized() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/"); // Redirect to the login or home page
  };

  return (
    <UnauthorizedContainer>
      <UnauthorizedCard>
        <Row>
          <Col>
            <ErrorCode>403</ErrorCode>
            <ErrorMessage>Unauthorized Access</ErrorMessage>
            <ErrorDescription>
              You do not have permission to view this page.
            </ErrorDescription>
            <Button variant="primary" onClick={handleBackToHome}>
              Back to Home
            </Button>
          </Col>
        </Row>
      </UnauthorizedCard>
    </UnauthorizedContainer>
  );
}

export default Unauthorized;
