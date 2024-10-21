const baseURLs = {
  local: "http://localhost:3000/api",
  web: "https://api.kaaryaalaya.com/api", // Ensure the URL is correct and uses HTTPS in production
};

// Set the environment; you can switch between 'local' and 'web'
// const environment = process.env.NODE_ENV === "production" ? "web" : "local";
const environment = process.env.NODE_ENV === "production" ? "web" : "local";

export const getUrl = (url) => {
  return baseURLs[environment] + url;
};
