// src/pages/ResumePreview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Paper } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import api from "../api";

export default function ResumePreview() {
  const { id } = useParams(); // metadata id
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/resumes/${id}`);
        setResume(res.data);
        setPdfUrl(res.data.file_url); // backend returns full URL
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (<Box sx={{ mt: 6, textAlign: "center" }}><CircularProgress /></Box>);
  if (error) return (<Box sx={{ mt: 4 }}><Typography color="error">{error}</Typography></Box>);
  if (!resume) return <Typography sx={{ mt: 4 }}>Resume not found</Typography>;

  const atsScore = resume.score ?? 0;
  const chartData = { datasets: [{ data: [atsScore, 100 - atsScore], borderWidth: 0 }] };

  return (
    <Box sx={{ p:5, display: "flex", gap:3 }}>
      <Paper sx={{ p:2, flex:1 }}>
        <Typography variant="h6">{resume.resume_name || resume.original_name}</Typography>
        <Typography variant="body1" color="text.secondary">Uploaded: {resume.uploaded_at}</Typography>
        <Box sx={{ width:200, mx:"auto", mt:4, mb:3 }}>
          <Doughnut data={chartData} />
          <Typography sx={{ textAlign:"center", fontWeight:"bold", mt:1 }}>{atsScore}%</Typography>
        </Box>
        <Typography>Matched keywords: {resume.matched_keywords?.length ? resume.matched_keywords.join(", ") : "None"}</Typography>
        <Box mt={4}><Button variant="contained" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button></Box>
      </Paper>

      <Paper sx={{ flex:1, height: { xs: "70vh", md: "80vh" }, overflow: "hidden" }}>
        {pdfUrl ? (
          <iframe src={pdfUrl} style={{ width: "100%", height: "100%", border: "none" }} title="Resume Preview" />
        ) : (
          <Typography sx={{ p:2 }}>No PDF available</Typography>
        )}
      </Paper>
    </Box>
  );
}
