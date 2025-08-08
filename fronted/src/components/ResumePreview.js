// src/components/ResumePreview.js

import React from 'react';
import { Box, Container, Paper, Typography, Divider } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import { useLocation } from 'react-router-dom';

const ResumePreview = () => {
  const location = useLocation();
  const scoreData = location.state?.scoreData || '';

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={5} sx={{ p: 5, borderRadius: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <InsightsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            ATS Analysis Result
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {scoreData ? (
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              ⭐ ATS Match Report
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {scoreData}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No data to preview. Please upload your resume first.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ResumePreview;


