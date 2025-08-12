// src/pages/ResumeDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, CircularProgress, Grid, Paper, Stack, Chip, IconButton, Tooltip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ResumeDashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/resumes"); // uses auth headers in api.js
      setResumes(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`/api/resumes/${id}`); // metadata id
      fetchResumes();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Delete failed");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>📄 Your Resumes</Typography>
        <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => navigate("/resume/new")}>Upload New</Button>
      </Box>

      {resumes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>No resumes yet 📂</Typography>
          <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={() => navigate("/resume/new")}>Upload Resume</Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {resumes.map((r) => (
            <Grid item xs={12} md={6} lg={4} key={r.id}>
              <Paper sx={{ p:3, borderRadius:3, boxShadow:3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>{r.resume_name}</Typography>
                <Typography variant="body2" color="text.secondary">Uploaded: {r.uploaded_at ? new Date(r.uploaded_at).toLocaleString() : "N/A"}</Typography>
                <Chip label={`Score: ${r.score ?? "N/A"}%`} color={r.score ? getScoreColor(r.score) : "default"} sx={{ mt:1 }} />
                <Stack direction="row" spacing={1} mt={2}>
                  <Tooltip title="View Resume">
                    <IconButton color="primary" onClick={() => navigate(`/preview/${r.id}`)}><VisibilityIcon/></IconButton>
                  </Tooltip>
                  <Tooltip title="Re-check Resume">
                    <IconButton color="warning" onClick={() => navigate(`/resume/new?edit=${r.id}`)}><RefreshIcon/></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Resume">
                    <IconButton color="error" onClick={() => handleDelete(r.id)}><DeleteIcon/></IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
