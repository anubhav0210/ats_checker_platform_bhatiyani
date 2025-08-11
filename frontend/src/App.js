// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Login from "./components/Login";
import Footer from "./components/Footer";
import ResumeUpload from "./components/ResumeUpload";
import ResumePreview from "./components/ResumePreview";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import ResumeDashboard from "./components/ResumeDashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <ResumeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume/new"
          element={
            <PrivateRoute>
              <ResumeUpload />
            </PrivateRoute>
          }
        />
        <Route
          path="/preview/:id"
          element={
            <PrivateRoute>
              <ResumePreview />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;