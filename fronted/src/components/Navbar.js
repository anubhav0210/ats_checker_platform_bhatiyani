import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer,
  List, ListItem, ListItemText, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { text: 'About', path: '/about' },
    { text: 'Resume Upload', path: '/upload' },
    { text: 'Resume Preview', path: '/preview' },
    { text: 'Dashboard', path: '/dashboard' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setDrawerOpen(false); // close drawer if mobile
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate('/');
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Resume ATS Platform</Typography>

          {/* Desktop Nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button key={item.path} color="inherit" onClick={() => handleNavClick(item.path)}>
                {item.text}
              </Button>
            ))}
            <Button color="inherit" onClick={handleAuthClick}>
              {isLoggedIn ? 'Logout' : 'Sign In'}
            </Button>
          </Box>

          {/* Mobile Drawer Icon */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }}>
          <List>
            {navItems.map((item) => (
              <ListItem button key={item.path} onClick={() => handleNavClick(item.path)}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleAuthClick}>
              <ListItemText primary={isLoggedIn ? 'Logout' : 'Sign In'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;