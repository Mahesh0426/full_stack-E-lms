import axios from "axios";

// USER API URL
const USER_API_URL = import.meta.env.VITE_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: USER_API_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    //save token in session storage
    const accessToken = sessionStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosInstance;
