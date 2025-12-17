import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://zklgdfzp-7001.asse.devtunnels.ms/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 errors and refreshing token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("[API] 401 received, attempting token refresh...");

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Use plain axios to avoid interceptor loop
        const response = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        if (response.data.success && response.data.accessToken) {
          const newAccessToken = response.data.accessToken;
          console.log(
            "[API] Token refreshed successfully, retrying original request..."
          );

          Cookies.set("accessToken", newAccessToken);

          // Update refresh token if backend rotates it
          if (response.data.refreshToken) {
            Cookies.set("refreshToken", response.data.refreshToken);
          }

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error("Refresh response missing token");
        }
      } catch (refreshError) {
        console.error("[API] Token refresh failed:", refreshError);
        // Clear all tokens and redirect to login
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
