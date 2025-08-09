// src/components/ResumeUpload.js
import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BACKEND = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ResumeUpload = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!selectedFile || !jobDescription) return alert('Please provide resume and job description');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('jd', jobDescription);

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND}/resume/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      // Navigate to preview and pass server response via state
      navigate('/resume-preview', { state: { scoreData: res.data.score_output, filename: res.data.filename } });
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper elevation={5} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Upload Resume & Job Description
        </Typography>

        <TextField
          label="Paste Job Description"
          multiline
          rows={6}
          fullWidth
          margin="normal"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #1976d2',
            p: 4,
            textAlign: 'center',
            backgroundColor: isDragActive ? '#e3f2fd' : '#fafafa',
            cursor: 'pointer',
            mb: 3,
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2' }} />
          <Typography variant="h6" mt={2}>
            {selectedFile ? selectedFile.name : 'Drag & drop resume here, or click to select'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
          size="large"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Get ATS Match %'}
        </Button>
      </Paper>
    </Container>
  );
};

export default ResumeUpload;
