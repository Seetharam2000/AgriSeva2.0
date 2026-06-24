import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if available
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("agriseva_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor: clear token on 401 so user is sent to login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("agriseva_token");
      localStorage.removeItem("agriseva_user_name");
      if (typeof window !== "undefined" && !window.location.pathname.endsWith("/login")) {
        const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";
        const loginPath = base === "/" ? "/login" : base + "/login";
        window.location.replace(window.location.origin + loginPath);
      }
    }
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("Network Error: No response received", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default client;
