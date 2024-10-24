import React from "react";
import styled from "styled-components";

// Styled component for the image
const ResponsiveImage = styled.img`
  max-width: 100%; /* Makes the image responsive */
  height: auto; /* Maintains aspect ratio */
  width: auto;
  display: block;
  margin: 0 auto; /* Center the image horizontally */
`;

const ImageComponent = ({ src, alt, special_class }) => {
  return <ResponsiveImage src={src} alt={alt} className={special_class} />;
};

export default ImageComponent;
