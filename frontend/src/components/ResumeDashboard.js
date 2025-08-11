// src/components/ResumeDashboard.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { resumeAPI } from "../api";

const ResumeDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const { data } = await resumeAPI.getResumes();
      setResumes(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resumes");
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
      await resumeAPI.deleteResume(id);
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };
    const handleUpdate = (id) => {
    navigate(`/resume/new?edit=${id}`);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Your Resumes</Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => navigate("/resume/new")}
        >
          Upload New
        </Button>
      </Box>

      {resumes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>No resumes found</Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => navigate("/resume/new")}
            sx={{ mt: 2 }}
          >
            Upload Your First Resume
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {resumes.map((resume) => (
            <Grid item xs={12} sm={6} md={4} key={resume.id}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6">{resume.resume_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
                </Typography>
                
                <Chip
                  label={`Score: ${resume.score || 0}%`}
                  color={getScoreColor(resume.score)}
                  sx={{ my: 1 }}
                />
                
                <Stack direction="row" spacing={1}>
                  <Tooltip title="View">
                    <IconButton onClick={() => navigate(`/preview/${resume.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
      
                  <Tooltip title="Edit Resume">
                    <IconButton
                      color="info"
                      onClick={() => handleUpdate(resume.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Re-check Resume">
                    <IconButton
                      color="warning"
                      onClick={() => navigate(`/resume/new?edit=${resume.id}`)}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(resume.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ResumeDashboard;