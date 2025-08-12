// src/api/realBackend.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem("access_token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (username, email, password) => 
    api.post("/auth/register", { username, email, password }),
  getMe: () => api.get("/auth/me"),
};

const resumeAPI = {
  uploadResume: (formData) => api.post("/api/resumes", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getResumes: () => api.get("/api/resumes"),
  getResume: (id) => api.get(`/api/resumes/${id}`),
  deleteResume: (id) => api.delete(`/api/resumes/${id}`),
};

// Export as named exports for better tree-shaking
export const realBackend = {
  authAPI,
  resumeAPI
};

// For backward compatibility if needed
export default realBackend;