// src/components/ResumeUpload.jsx
import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Drag & Drop handling
  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const f = acceptedFiles[0];
    if (f.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    setError("");
    setFile(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!resumeName.trim()) return setError("Please enter resume name");
    if (!file) return setError("Please choose a PDF file");

    const token = localStorage.getItem("access_token");
    if (!token) return setError("Not authenticated");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resume_name", resumeName);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND}/api/resumes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(payload.detail || payload.message || "Upload failed");
      }

      const data = await res.json();
      navigate(`/preview/${data.id}`, { replace: true });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={800} mx="auto" mt={6} p={3}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
        <Typography variant="h4" mb={3} fontWeight="bold" color="primary">
          🚀 Upload Your Resume
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Resume Name"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          <TextField
            label="Job Description (optional)"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />

          {/* Drag & Drop Zone */}
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "grey.400",
              borderRadius: 3,
              p: 5,
              textAlign: "center",
              backgroundColor: isDragActive ? "primary.light" : "grey.50",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              mb: 3,
              "&:hover": {
                backgroundColor: "grey.100"
              }
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <Typography variant="h6" color="primary">
                Drop the file here...
              </Typography>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 50, color: "primary.main", mb: 1 }} />
                <Typography variant="body1">
                  Drag & Drop your PDF here, or click to select
                </Typography>
              </>
            )}
          </Box>

          {file && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              ✅ Selected: {file.name}
            </Typography>
          )}

          <Box mt={3} display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <UploadFileIcon />}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Resume"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}




