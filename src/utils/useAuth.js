import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getUserInfo(); // Retrieve user info from storage
    // console.log("Checking authentication status:", user);

    if (!user) {
      console.log("User is not authenticated, redirecting...");
      navigate("/"); // Redirect to login if not logged in
    }
  }, [navigate]);
};

export default useAuth;
