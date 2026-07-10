import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "https://api.plateforme-osci.org/api/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token de manière dynamique
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
    config.data || "",
  );
  return config;
});

// Intercepteur pour logguer les réponses
apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [API Response] ${response.status} ${response.config.url}`,
      JSON.stringify(response.data, null, 2),
    );
    return response;
  },
  (error) => {
    console.log(
      `❌ [API Error] ${error.response?.status || "Network Error"} ${error.config?.url}`,
      JSON.stringify(error.response?.data || error.message, null, 2),
    );
    return Promise.reject(error);
  },
);

export default apiClient;
