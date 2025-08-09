import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper } from "@mui/material";

const ResumePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, text } = location.state || {};

  if (!score) {
    return (
      <Container>
        <Typography variant="h6" color="error" sx={{ mt: 4 }}>
          No score available. Please upload your resume first.
        </Typography>
        <Button onClick={() => navigate("/upload")} sx={{ mt: 2 }} variant="contained">
          Go to Upload
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5">ATS Score: {score}%</Typography>
        <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-line" }}>
          {text}
        </Typography>
      </Paper>
    </Container>
  );
};

export default ResumePreview;


