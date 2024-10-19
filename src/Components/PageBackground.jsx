import styled from "styled-components";

// Reusable Background Component
const PageBackground = styled.div`
  background-color: ${(props) => props.color || "#f8f9fa"};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default PageBackground;
