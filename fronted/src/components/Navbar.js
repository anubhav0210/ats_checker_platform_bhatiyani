// src/components/Navbar.js
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const [openAuth, setOpenAuth] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { text: 'About', path: '/about' },
    { text: 'Resume Upload', path: '/upload' },
    { text: 'Resume Preview', path: '/preview' },
    { text: 'Dashboard', path: '/dashboard' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleAuthClick = () => {
    if (token) {
      logout();
      navigate('/');
    } else {
      setOpenAuth(true);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Resume ATS Platform
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button key={item.path} color="inherit" onClick={() => handleNavClick(item.path)}>
                {item.text}
              </Button>
            ))}
            <Button color="inherit" onClick={handleAuthClick}>
              {token ? 'Logout' : 'Login'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <AuthModal open={openAuth} onClose={() => setOpenAuth(false)} />
    </>
  );
};

export default Navbar;
