import styled from "styled-components";

// Reusable Section Wrapper
export const Section = styled.div`
  padding: 80px 0;
  text-align: center;
`;

// Reusable Section Header
export const SectionHeader = styled.h2`
  font-family: "Roboto", sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: ${(props) => props.color || "#343a40"};
  margin-bottom: 40px;
`;
