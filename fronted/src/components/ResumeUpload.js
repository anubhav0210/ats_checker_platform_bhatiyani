import React, { useState } from 'react';
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

const ResumeUpload = ({ setScoreData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': [] } });

const handleSubmit = async () => {
  if (!selectedFile || !jobDescription) return alert('Please provide both resume and job description');

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('jd', jobDescription);

  try {
    setLoading(true);
    const response = await axios.post('http://localhost:8000/score', formData);
    
    // ✅ Redirect to ResumePreview with scoreData passed as route state
    navigate('/resume-preview', { state: { scoreData: response.data.score_output } });

  } catch (error) {
    console.error('Error uploading:', error);
    alert('Upload failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={5} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Upload Resume & Job Description
        </Typography>

        <Box sx={{ mt: 3, mb: 3 }}>
          <TextField
            label="Paste Job Description"
            placeholder="Enter the job description here..."
            multiline
            rows={6}
            fullWidth
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </Box>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #2196f3',
            padding: 4,
            textAlign: 'center',
            backgroundColor: isDragActive ? '#e3f2fd' : '#f5f5f5',
            cursor: 'pointer',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 50, color: '#2196f3' }} />
          <Typography variant="body1" mt={2}>
            {selectedFile ? selectedFile.name : 'Drag and drop a PDF resume here or click to upload'}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Get ATS Match %'}
        </Button>
      </Paper>
    </Container>
  );
};

export default ResumeUpload;



