import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:5000/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

/* ── Request Interceptor: attach JWT ─────────────────────── */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err),
);

/* ── Response Interceptor: handle 401 ───────────────────── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

/* Helper: extract error message from any response shape */
export const getErrorMessage = (err) =>
  err?.response?.data?.errors?.[0] ||
  err?.response?.data?.message ||
  err?.message ||
  "Something went wrong. Please try again.";

export default api;
