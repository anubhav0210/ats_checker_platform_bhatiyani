import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:8000";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND}/auth/register`, form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Create a new account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Login here
          </Link>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={form.username}
            onChange={handleChange("username")}
            disabled={loading}
            autoComplete="username"
          />
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            disabled={loading}
            autoComplete="email"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            disabled={loading}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Register;

