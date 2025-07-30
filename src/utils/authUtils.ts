import api from "@/config/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (refreshToken) {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken: refreshToken,
    });

    const newAccessToken = response.data.data.token;
    console.log(newAccessToken);
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  }
  throw new Error("Refresh token not available");
};
