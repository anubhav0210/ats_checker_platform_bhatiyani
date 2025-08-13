// src/api.js
import axios from "axios";

const API_BASE = window.location.href;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Add request interceptor to inject auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;