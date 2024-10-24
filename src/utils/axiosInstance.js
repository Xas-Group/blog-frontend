// src/utils/axiosInstance.js
import axios from "axios";
import AuthService from "../services/authService";

const baseURLs = {
  local: "http://localhost:3000/api",
  web: "http://api.blog.kaaryaalaya.com/api", // Ensure the URL is correct and uses HTTPS in production
};

// Set the environment; you can switch between 'local' and 'web'
// const environment = process.env.NODE_ENV === "production" ? "web" : "local";
const environment = process.env.NODE_ENV === "production" ? "web" : "web";

const axiosInstance = axios.create({
  baseURL: baseURLs[environment], // Dynamically set the base URL based on the environment
  withCredentials: true, // Include cookies with requests to work with Express sessions
});

// Add an interceptor to include the API key in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const apiKey = AuthService.getApiKey(); // Get the API key from AuthService
    if (apiKey) {
      config.headers["x-api-key"] = apiKey; // Add the x-api-key header to the request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
