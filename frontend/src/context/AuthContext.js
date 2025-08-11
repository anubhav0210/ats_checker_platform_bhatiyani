// src/context/AuthContext.js
import { createContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem("access_token", data.access_token);
      setToken(data.access_token);
      await fetchUser(); // Fetch complete user data after login
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setToken("");
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };
    initializeAuth();
  }, [token, fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        fetchUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};