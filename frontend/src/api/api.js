// src/api.js
import axios from 'axios';

// Base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => 
    api.post('/auth/register', { username, email, password }),
  getMe: () => api.get('/auth/me'),
};

export const resumeAPI = {
  getResumes: () => api.get('/resumes'),
  getResume: (id) => api.get(`/resumes/${id}`),
  uploadResume: (formData) => 
    api.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteResume: (id) => api.delete(`/resumes/${id}`),
};

export default api;