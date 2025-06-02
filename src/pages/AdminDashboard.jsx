import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Header from '../components/Header';

const AdminDashboard = () => {
  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)', // assuming Header height is 64px
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f9f9f9',
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 500,
            width: '100%',
            textAlign: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <AdminPanelSettingsIcon
            sx={{ fontSize: 60, color: '#00A76F', mb: 2 }}
          />
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This section is under progress. Please check back later!
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default AdminDashboard;
