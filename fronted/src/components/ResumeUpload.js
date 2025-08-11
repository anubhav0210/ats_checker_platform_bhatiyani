// src/components/ResumeUpload.jsx
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    setError("");
    setFile(f);
  };

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
      // data.id and data.file_url are returned by backend
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
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={2}>
          Upload Resume
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Resume Name"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          <TextField
            label="Job Description (optional)"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <Button variant="outlined" component="label" sx={{ mb: 1 }}>
            <UploadFileIcon sx={{ mr: 1 }} />
            Choose PDF file
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {file && <Typography variant="body2">Selected: {file.name}</Typography>}

          <Box mt={3} display="flex" gap={2}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Uploading..." : "Upload Resume"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}




