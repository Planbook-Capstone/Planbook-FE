import { refreshAuthToken } from "@/utils/authUtils";
import axios, { AxiosInstance } from "axios";

// Main API instance (default port)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOCAL_API_URL,
});

// Secondary API instance (different port)
const apiSecondary = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SECONDARY_URL,
});

// Third API instance (another different port)
const apiThird = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_THIRD_URL,
});

// Helper function to setup interceptors for both instances
const setupInterceptors = (axiosInstance: AxiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Prevent infinite retry loop

        try {
          const newToken = await refreshAuthToken();
          console.log("New token:", newToken);

          // Update both instances
          axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          // Redirect to login on refresh failure
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }
        }
      }

      return Promise.reject(error);
    }
  );
};

// Setup interceptors for all instances
setupInterceptors(api);
setupInterceptors(apiSecondary);
setupInterceptors(apiThird);

// Export all instances
export default api;
export { apiSecondary, apiThird };
