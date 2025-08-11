// src/components/ResumePreview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Paper } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function ResumePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${BACKEND}/api/resumes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => ({}));
          throw new Error(payload.detail || "Failed to load resume");
        }
        const data = await res.json();
        setResume(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  if (!resume)
    return <Typography sx={{ mt: 4 }}>Resume not found</Typography>;

  // Chart.js data
  const atsScore = resume.score ?? 0;
  const chartData = {
    datasets: [
      {
        data: [atsScore, 100 - atsScore],
        backgroundColor: ["#42a5f5", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Box
      sx={{
        p: 5,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
      }}
    >
      {/* Left Side: Info + Chart */}
      <Paper sx={{ p: 2, flex: 1 }}>
        <Typography variant="h2">
          {resume.resume_name || resume.original_name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Uploaded: {resume.uploaded_at}
        </Typography>

        <Box
          sx={{
            width: 250,
            mx: "auto",
            position: "relative",
            mt: 4,
            mb: 3,
          }}
        >
          <Doughnut data={chartData} />
          <Typography
            variant="h4"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
          >
            {atsScore}%
          </Typography>
        </Box>

        <Typography variant="h4">
          Matched keywords:{" "}
          {resume.matched_keywords?.length
            ? resume.matched_keywords.join(", ")
            : "None"}
        </Typography>

        <Box mt={6}>
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Paper>

      {/* Right Side: Resume PDF */}
              <Paper
  sx={{
    flex: 1,
    height: { xs: "70vh", md: "calc(100vh - 100px)" },
    overflow: "hidden",
  }}
>
  {resume.file_url ? (
    <iframe
      src={`${resume.file_url}#view=FitH`}
      title="Resume"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
  ) : (
    <Typography sx={{ p: 2 }}>No file available</Typography>
  )}
</Paper>
    </Box>
  );
}


