import React, { useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";

const ResumeUpload = ({
  buttonStyles = {},
  textFieldStyles = {},
  uploadBoxStyles = {},
}) => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setMessage("");
      } else {
        setMessage("Only PDF files are accepted.");
      }
      e.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setMessage("");
      } else {
        setMessage("Only PDF files are accepted.");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !jobDescription.trim()) {
      setMessage("Please select a PDF file and enter the job description.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      const res = await axios.post("http://localhost:8000/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { score, parsed_text } = res.data;

      navigate("/preview", { state: { score, text: parsed_text } });
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth={650}
      mx="auto"
      mt={6}
      p={4}
      sx={{
        bgcolor: "white",
        borderRadius: 4,
        boxShadow:
          "0 12px 20px -10px rgba(88, 99, 246, 0.3), 0 4px 20px 0px rgba(0,0,0,0.12), 0 7px 8px -5px rgba(88, 99, 246, 0.2)",
        fontFamily: "'Roboto', sans-serif",
        ...uploadBoxStyles.container,
      }}
    >
      <Typography
        variant="h3"
        mb={4}
        sx={{
          fontWeight: "700",
          background: "linear-gradient(45deg, #3f51b5, #7986cb)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: "none",
          ...uploadBoxStyles.header,
        }}
      >
        Upload Your Resume
      </Typography>

      <form onSubmit={handleUpload}>
        <Paper
          variant="outlined"
          sx={{
            p: 5,
            mb: 4,
            borderStyle: "dashed",
            borderColor: file ? "#3f51b5" : "#cfd8dc",
            bgcolor: file ? "rgba(63, 81, 181, 0.1)" : "transparent",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.4s ease",
            borderRadius: 3,
            "&:hover": {
              bgcolor: file ? "rgba(63, 81, 181, 0.15)" : "rgba(207, 216, 220, 0.3)",
              borderColor: "#3f51b5",
              boxShadow: "0 0 15px rgba(63, 81, 181, 0.4)",
            },
            ...uploadBoxStyles.dropArea,
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-input").click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              document.getElementById("file-input").click();
            }
          }}
        >
          <UploadFileIcon
            color="primary"
            sx={{
              fontSize: 60,
              mb: 2,
              filter: file ? "drop-shadow(0 0 3px #3f51b5)" : "none",
              transition: "filter 0.3s ease",
              ...uploadBoxStyles.icon,
            }}
          />
          <Typography
            variant="h6"
            color={file ? "primary" : "text.secondary"}
            sx={{ userSelect: "none", fontWeight: "600", ...uploadBoxStyles.text }}
          >
            {file
              ? file.name
              : "Drag & drop your PDF resume here, or click to select a file"}
          </Typography>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            id="file-input"
            style={{ display: "none" }}
          />
        </Paper>

        <TextField
          label="Job Description"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#f7f9fc",
              "&.Mui-focused": {
                backgroundColor: "white",
                boxShadow: "0 0 10px rgba(63, 81, 181, 0.3)",
                borderColor: "#3f51b5",
              },
            },
            ...textFieldStyles,
          }}
          placeholder="Paste the job description here..."
        />

        {message && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontWeight: "600" }}>
            {message}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{
            background: "linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)",
            fontWeight: "700",
            boxShadow: "0 4px 15px 0 rgba(63,81,181,.75)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(45deg, #283593 30%, #5c6bc0 90%)",
              boxShadow: "0 6px 20px 0 rgba(40,53,147,.9)",
            },
            ...buttonStyles,
          }}
          startIcon={loading && <CircularProgress size={22} color="inherit" />}
        >
          {loading ? "Uploading..." : "Upload & Analyze"}
        </Button>
      </form>
    </Box>
  );
};

export default ResumeUpload;

