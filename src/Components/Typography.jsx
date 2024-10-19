import styled from "styled-components";

// Reusable Heading Components with Roboto font
export const H1 = styled.h1`
  font-family: "Roboto", sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  color: ${(props) => props.color || "#343a40"};
  margin: ${(props) => props.margin || "0 0 20px"};
`;

export const H2 = styled.h2`
  font-family: "Roboto", sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: ${(props) => props.color || "#343a40"};
  margin: ${(props) => props.margin || "0 0 20px"};
`;

export const H3 = styled.h3`
  font-family: "Roboto", sans-serif;
  font-size: 2rem;
  font-weight: 500;
  color: ${(props) => props.color || "#343a40"};
  margin: ${(props) => props.margin || "0 0 20px"};
`;

export const H4 = styled.h4`
  font-family: "Roboto", sans-serif;
  font-size: 1.75rem;
  font-weight: 500;
  color: ${(props) => props.color || "#343a40"};
  margin: ${(props) => props.margin || "0 0 15px"};
`;

export const H5 = styled.h5`
  font-family: "Roboto", sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${(props) => props.color || "#343a40"};
  margin: ${(props) => props.margin || "0 0 10px"};
`;

// Reusable Paragraph Component with Roboto font
export const P = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: ${(props) => props.color || "#6c757d"};
  margin: ${(props) => props.margin || "0 0 15px"};
`;
