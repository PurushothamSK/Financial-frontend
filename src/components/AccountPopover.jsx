import React, { useState } from 'react';
import {
  IconButton,
  Avatar,
  Popover,
  Typography,
  Box,
  Divider,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // your custom auth context
import image from '../assets/images/man.png';

const AccountPopover = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { signOut, role, user } = useAuth(); // assume user = 'John Doe', role = 'admin'

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ p: 0 }}>
        <Avatar alt={user} src={image} />
      </IconButton>

      <Popover
  open={open}
  anchorReference="anchorPosition"
  anchorPosition={{ top: 70, left: window.innerWidth - 90 }} // position it manually
  onClose={handleClose}
  PaperProps={{
    sx: {
      width: 220,
      // height: 300,
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }}
>

      
        <Avatar
          alt={user}
          src={image}
          sx={{ width: 64, height: 64, mb: 1 }}
        />

        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
          User: {user}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Role: {role}
        </Typography>

        <Divider sx={{ width: '100%', mb: 2 }} />

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Popover>
    </>
  );
};

export default AccountPopover;
