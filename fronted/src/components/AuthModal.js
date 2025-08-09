// src/components/AuthModal.js
import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BACKEND = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AuthModal = ({ open, onClose }) => {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await axios.post(`${BACKEND}/auth/register`, {
          username: form.username,
          email: form.email,
          password: form.password,
        });
        // after register, switch to login
        setIsRegister(false);
      } else {
        // login
        const res = await axios.post(`${BACKEND}/auth/login`, {
          email: form.email,
          password: form.password,
        });
        const token = res.data.access_token;
        login(token);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{isRegister ? 'Create an account' : 'Sign in'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {isRegister && (
            <TextField label="Username" value={form.username} onChange={handleChange('username')} fullWidth />
          )}
          <TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => setIsRegister((s) => !s)} color="inherit">
          {isRegister ? 'Have an account?' : 'Create account'}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {isRegister ? 'Register' : 'Login'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;

