import styled from "styled-components";
import { Button } from "react-bootstrap";

// Reusable Styled Button Component
const StyledButton = styled(Button)`
  font-family: "Roboto", sans-serif;
  background-color: #007bff;
  border: none;
  font-size: 1.2rem;
  padding: 12px 30px;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

export default StyledButton;
