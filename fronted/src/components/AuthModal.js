
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, IconButton,
  Typography, InputAdornment, Box, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';

const AuthModal = ({ open, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  // Top of AuthModal.js
  const [isResettingPassword, setIsResettingPassword] = useState(false);


  const toggleForm = () => setIsRegistering((prev) => !prev);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
     <DialogContent>
  {/* Toggle back to login or register if resetting password */}
  {isResettingPassword ? (
    <>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Enter your email address to receive password reset instructions.
      </Typography>
      <Box component="form" noValidate sx={{ mt: 2 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => {
            alert('Reset link sent to email (placeholder)');
            setIsResettingPassword(false);
          }}
        >
          Send Reset Link
        </Button>
        <Button
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => setIsResettingPassword(false)}
        >
          Back to Sign In
        </Button>
      </Box>
    </>
  ) : (
    <>
      {/* Login or Register Toggle */}
      <Typography variant="body2" sx={{ mb: 2 }}>
        {isRegistering
          ? "Already have an account? "
          : "Don't have an account? "}
        <Button variant="text" size="small" onClick={() => {
          setIsRegistering((prev) => !prev);
          setIsResettingPassword(false);
        }}>
          {isRegistering ? 'Sign in' : 'Register'}
        </Button>
      </Typography>

      {/* Social Icons */}
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
        <IconButton><GoogleIcon /></IconButton>

      </Box>

      <Divider>or</Divider>

      <Box component="form" noValidate sx={{ mt: 2 }}>
        {isRegistering && (
          <TextField
            margin="normal"
            fullWidth
            label="Full Name"
            type="text"
          />
        )}
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        {/* Forgot password logic */}
        {!isRegistering && (
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setIsResettingPassword(true);
                setIsRegistering(false);
              }}
            >
              Forgot your password?
            </Button>
          </Typography>
        )}
        <Button variant="contained" fullWidth>
          {isRegistering ? 'Register' : 'Sign In'}
        </Button>
      </Box>
    </>
  )}
  </DialogContent>

    </Dialog>
  );
};

export default AuthModal;
