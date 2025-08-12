import { Container, Grid, Typography, Box, Button, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SpeedIcon from '@mui/icons-material/Speed';
import InsightsIcon from '@mui/icons-material/Insights';
import { motion } from 'framer-motion';
import aboutImage from '../assets/about.png';
import { useNavigate } from 'react-router-dom';




/**
 * About Section of the Resume ATS Checker platform.
 * Provides information about platform features and benefits with animations and CTA.
 */
const About = () => {
  const navigate = useNavigate();
  return (
    <Box
      id="about"
      sx={{
        py: 10,
        background: 'linear-gradient(to right, #e3f2fd, #f8f9fa)',
      }}
    >
      <Container>
        <Grid container spacing={6} alignItems="center">
          {/* Hero Text Section with Animation */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                Power Your Resume with Our ATS Checker
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                Instantly analyze and improve your resume to get shortlisted by top companies.
              </Typography>
                <Button variant="contained" onClick={() =>  navigate("/resume/new")}>
                Upload Resume Now
              </Button>
            </motion.div>
          </Grid>

          {/* Illustration Image */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <img
                src={aboutImage}
                alt="Resume ATS Checker Illustration"
                style={{ width: '90%', borderRadius: 12 }}
                />
            </motion.div>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 8 }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <Typography variant="h4" gutterBottom>
              Why Choose Our Platform?
            </Typography>
            <Stack spacing={2} mt={3}>
              <Typography variant="body1">
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} /> ATS-optimized resume analysis for better job visibility.
              </Typography>
              <Typography variant="body1">
                <SpeedIcon color="primary" sx={{ mr: 1 }} /> Instant feedback on formatting, keywords, and readability.
              </Typography>
              <Typography variant="body1">
                <InsightsIcon color="primary" sx={{ mr: 1 }} /> Insights to align your resume with job descriptions.
              </Typography>
              <Typography variant="body1">
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} /> Designed for Indian job seekers with mobile-first approach.
              </Typography>
              <Typography variant="body1">
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} /> Free to use and constantly evolving with real recruiter input.
              </Typography>
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default About;