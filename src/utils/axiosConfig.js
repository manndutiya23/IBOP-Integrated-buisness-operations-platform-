import axios from "axios";

const normalizeApiBaseUrl = (value) => {
  if (!value) {
    return "http://localhost:5000/api";
  }

  try {
    const url = new URL(value, window.location.origin);

    if (url.hostname === "ibop-integrated-business-operations.onrender.com") {
      url.hostname = "ibop-integrated-buisness-operations.onrender.com";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return value;
  }
};

const API = axios.create({
  baseURL: normalizeApiBaseUrl(
    import.meta.env.VITE_API_BASE_URL
  ),
});


// attach token automatically
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {

    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export default API;