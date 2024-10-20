import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Unauthorized from "./pages/Unauthorized"; // A page for unauthorized access
import RedirectHandler from "./services/RedirectHandler";
import LandingPage from "./pages/LandingPage";
import LearnPage from "./pages/LearnPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Router basename="/blog-frontend">
      {/* This will handle any redirection logic */}
      <RedirectHandler />
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Unauthorized access route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
