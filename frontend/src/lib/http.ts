import axios, { AxiosError } from "axios";

type FastApiError = {
  detail?: string;
};

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("Missing VITE_API_BASE_URL in .env");
}

export const http = axios.create({
  baseURL,
  timeout: 15000,
});

// Ready for auth later
http.interceptors.request.use((config) => {
  // const token = localStorage.getItem("token");
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<FastApiError>) => {
    const detail = error.response?.data?.detail;
    const message =
      (detail && typeof detail === "string" && detail) ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  },
);
