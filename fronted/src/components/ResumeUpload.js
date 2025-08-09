import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !jobDescription.trim()) {
      setMessage('Please select a PDF file and enter the job description.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);

      const res = await axios.post('http://localhost:8000/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const { score, parsed_text } = res.data;

      navigate('/preview', { state: { score, text: parsed_text } });
    } catch (error) {
      console.error(error);
      setMessage('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', border: '1px solid #ddd', borderRadius: 4 }}>
      <h2>Upload Your Resume</h2>
      <form onSubmit={handleUpload}>
        <div style={{ marginBottom: 12 }}>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <textarea
            rows={5}
            placeholder="Paste job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload & Analyze'}
        </button>
      </form>
      {message && <p style={{ color: 'red', marginTop: 12 }}>{message}</p>}
    </div>
  );
};

export default ResumeUpload;


