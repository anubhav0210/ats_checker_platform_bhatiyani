// src/components/Dashboard.js
import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';

const Dashboard = () => {
  return (
    <Box
      id="dashboard"
      sx={{
        py: 8,
        background: 'linear-gradient(to right, #e0f7fa, #f1f8e9)',
        minHeight: '100vh',
      }}
    >
      <Container>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 6 },
            backgroundColor: '#ffffffee',
            borderRadius: 3,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Candidate Dashboard
            </Typography>

            <Typography variant="body1" paragraph>
              View your resume statistics, previous uploads, and improvement history at a glance.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AssessmentIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Latest Score</Typography>
                    <Typography variant="body2">84% (Great fit)</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Keyword Match</Typography>
                    <Typography variant="body2">18/25 keywords matched</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <DescriptionIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">Resume Submissions</Typography>
                    <Typography variant="body2">3 uploads analyzed</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;