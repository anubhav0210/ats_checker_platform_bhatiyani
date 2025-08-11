// Toggle between real backend and mock server
export const USE_MOCK_SERVER = true;

export const API_BASE_URL = USE_MOCK_SERVER
  ? "http://localhost:5000"
  : "http://localhost:8000"; // FastAPI backend
