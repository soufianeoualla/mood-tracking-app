
import useAuthStore from "@/store/useAuthStore";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data as { error?: string } | undefined;

    if (
      data?.error === "SESSION_EXPIRED" ||
      data?.error === "UNAUTHORIZED" ||
      status === 403
    ) {
      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);

export default api;
