import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Unauthorized from "./pages/Unauthorized"; // A page for unauthorized access
import RedirectHandler from "./services/RedirectHandler";
import LandingPage from "./pages/LandingPage";
import LearnPage from "./pages/LearnPage";

function App() {
  return (
    <Router basename="/blog-frontend">
      {/* This will handle any redirection logic */}
      <RedirectHandler />
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/learn" element={<LearnPage />} />
        {/* Unauthorized access route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
