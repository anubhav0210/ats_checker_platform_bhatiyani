import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const guestLinks = (
    <>
      <Button color="inherit" component={Link} to="/login">
        Login
      </Button>
      <Button color="inherit" component={Link} to="/register">
        Register
      </Button>
    </>
  );

  const authLinks = (
    <>
      <Button color="inherit" component={Link} to="/dashboard">
        Dashboard
      </Button>
      <Button color="inherit" component={Link} to="/resume/new">
        Upload
      </Button>
      <Button color="inherit" onClick={handleLogout}>
        Logout
      </Button>
    </>
  );

  const mobileMenuItems = !token
    ? [
       { text: 'Login', path: '/login' },
        { text: 'Register', path: '/register' },
        { text: 'About', path: '/' },
       
      ]
    : [
      { text: 'Logout', action: handleLogout },
        { text: 'About', path: '/' },
        { text: 'Dashboard', path: '/dashboard' },
        { text: 'Upload', path: '/resume/new' },
      ];

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        >
          Resume ATS
        </Typography>

        {/* Desktop View */}
        {!isMobile ? (
          <Box>
            <Button color="inherit" component={Link} to="/">
              About
            </Button>
            {token ? authLinks : guestLinks}
          </Box>
        ) : (
          // Mobile View: Hamburger or Profile Icon
          <>
            {!token ? (
              <IconButton
                color="inherit"
                edge="end"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <div>
                <IconButton
                  color="inherit"
                  onClick={handleMenu}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>Dashboard</MenuItem>
                  <MenuItem onClick={() => { navigate('/resume/new'); handleClose(); }}>Upload</MenuItem>
                  <MenuItem onClick={() => { handleLogout(); handleClose(); }}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </>
        )}
      </Toolbar>

      {/* Drawer for mobile guest users */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            {mobileMenuItems.map(({ text, path, action }, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  if (action) {
                    action();
                  } else {
                    navigate(path);
                  }
                }}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;




