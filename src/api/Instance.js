// src/api/Instance.js
import axios from "axios";

// Fallback to live API if VITE_API_BASE_URL is not set
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://mvdapi-mxjdw.ondigitalocean.app/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Optional: Add interceptors to handle request/response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error globally
    console.error("API Error:", error.response || error.message);
    // Forward the error to the calling function
    return Promise.reject(error);
  }
);

export default api;
