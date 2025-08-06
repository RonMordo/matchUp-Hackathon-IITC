import axios, { type AxiosInstance } from "axios";

console.log("API_BASE_URL", import.meta.env.VITE_API_BASE_URL);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && config.url !== "/auth/login") {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isOtpVerify =
      error.config?.url?.includes("/auth/verify-otp") ||
      error.config?.url?.includes("/auth/request-otp");

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !isOtpVerify
    ) {
      document.cookie = "token=; Max-Age=0; path=/";
      localStorage.clear();

      window.location.href = "/signin";
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export function isAuthenticated(): boolean {
  const token = getCookie("token");
  return !!token;
}

export default axiosInstance;
