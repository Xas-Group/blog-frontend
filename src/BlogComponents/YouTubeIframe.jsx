import React, { useState } from "react";
import styled from "styled-components";
import { PuffLoader } from "react-spinners"; // Importing spinner

// Styled component for centering the iframe container horizontally
const CenteredContainer = styled.div`
  display: flex;
  justify-content: center; /* Centers horizontally */
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
  position: relative; /* For overlaying the loader */
`;

// Styled component for responsive iframe container
const IframeWrapper = styled.div`
  width: 50%;
  height: 0;
  padding-bottom: 28.125%; /* Aspect ratio 16:9 */
  position: relative;

  /* Full width on medium and smaller screens */
  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Styled component for iframe
const StyledIframe = styled.iframe`
  position: absolute;
  width: 100%;
  height: 100%;
  border: none;
`;

// Styled component for loader container
const LoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1; /* Ensure loader is on top */
`;

const YouTubeIframe = ({ src, special_class }) => {
  const [loading, setLoading] = useState(true);

  // Handle iframe load event
  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <CenteredContainer className={special_class}>
      {loading && (
        <LoaderWrapper>
          <PuffLoader color="#36d7b7" size={60} /> {/* Spinner component */}
        </LoaderWrapper>
      )}
      <IframeWrapper>
        <StyledIframe
          src={src}
          title="YouTube video player"
          onLoad={handleLoad} // Set loading to false once iframe loads
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </IframeWrapper>
    </CenteredContainer>
  );
};

export default YouTubeIframe;
