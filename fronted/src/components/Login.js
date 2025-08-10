import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const success = await login(email, password);
      setLoading(false);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setLoading(false);
      setError("Login failed. Please try again.");
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
          Sign in to your account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Don’t have an account?{" "}
          <Link component={RouterLink} to="/register" underline="hover">
            Register here
          </Link>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />

          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleShowPassword}
                    edge="end"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box textAlign="right" mt={1} mb={3}>
            <Link component={RouterLink} to="/forgot-password" underline="hover">
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;


