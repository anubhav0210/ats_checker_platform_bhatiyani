// src/components/ResumeUpload.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import api from "../api";

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0 && acceptedFiles[0].type === "application/pdf") {
        setFile(acceptedFiles[0]);
        setError("");
      } else {
        setError("Please upload a PDF file");
      }
    },
    multiple: false,
    accept: "application/pdf",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!resumeName.trim()) return setError("Please enter resume name");
    if (!file) return setError("Please choose a PDF file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resume_name", resumeName);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      const res = await api.post("/api/resumes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/preview/${res.data.id}`, { replace: true });
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="md" sx={{ mx: "auto", p: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Upload Resume
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Resume Name"
            fullWidth
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <TextField
            label="Job Description (Optional)"
            fullWidth
            multiline
            rows={4}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "grey.400",
              borderRadius: 1,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              mb: 3,
              backgroundColor: isDragActive ? "action.hover" : "background.paper",
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>
              {isDragActive
                ? "Drop the PDF here"
                : "Drag & drop a PDF file, or click to select"}
            </Typography>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
            disabled={loading || !file}
            fullWidth
            size="large"
          >
            {loading ? "Uploading..." : "Upload Resume"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ResumeUpload;




