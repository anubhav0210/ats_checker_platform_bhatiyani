// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("access_token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("access_token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("access_token");
    }
  }, [token]);

  // ensure token is read on mount (already in initial state), but you can decode or fetch user here
  useEffect(() => {
    if (token && !user) {
      // optional: fetch user profile if your backend exposes it
      // axios.get(`${BACKEND}/auth/me`).then(...).catch(...)
      setUser((u) => u || { /* minimal placeholder */ });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:8000"}/auth/login`, {
        email,
        password,
      });
      setToken(res.data.access_token);
      setUser({ email });
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

