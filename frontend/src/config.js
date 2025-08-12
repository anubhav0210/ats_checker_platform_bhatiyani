// Toggle between real backend and mock server
// Always use environment variable in production
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";