import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get("path");

    // If there's a path in the query and it's not the current route, navigate to it
    if (path && location.pathname !== path) {
      navigate(path);
    }
  }, [navigate, location]);

  return null;
}

export default RedirectHandler;
