// src/components/ResumeDashboard.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Grid, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function ResumeDashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${BACKEND}/api/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load resumes");
      const data = await res.json();
      setResumes(data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load resumes");
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
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${BACKEND}/api/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 204) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.detail || "Delete failed");
      }
      fetchResumes();
    } catch (err) {
      console.error(err);
      alert(err.message || "Delete failed");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Your Resumes</Typography>
        <Button variant="contained" onClick={() => navigate("/resume/new")}>Upload New</Button>
      </Box>

      {resumes.length === 0 ? (
        <Typography>No resumes yet. Upload one!</Typography>
      ) : (
        <Grid container spacing={2}>
          {resumes.map(r => (
            <Grid item xs={12} md={6} key={r.id}>
              <Paper sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>{r.resume_name}</Typography>
                <Typography variant="body2" color="text.secondary">Uploaded: {r.uploaded_at}</Typography>
                <Typography variant="body2">Score: {r.score ?? "N/A"}%</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/preview/${r.id}`)}>View</Button>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/resume/new?edit=${r.id}`)}>Re-check</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(r.id)}>Delete</Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
