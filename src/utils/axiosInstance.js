import axios from "axios";
import { BASE_URL} from '../utils/config';
const api = axios.create({
  baseURL: BASE_URL
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(p => {
    error ? p.reject(error) : p.resolve();
  });
  failedQueue = [];
};

// Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("token");
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      console.log("retrived refresh token" + refreshToken)

      const response = await axios.post(
        `${BASE_URL}/auth/refresh`,
        { "refresh_token" : refreshToken }
      );

      const { accessToken, refresh_token } = response.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refresh_token", refresh_token);

      processQueue(null);
      return api(originalRequest);

    } catch (err) {
      processQueue(err);
      logout();
      return Promise.reject(err);

    } finally {
      isRefreshing = false;
    }
  }
);

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/";
}

export default api;