import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const FinancialLoader = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#f4f6f8',
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress size={80} thickness={4} color="success" />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AttachMoneyIcon sx={{ fontSize: 36, color: 'success.main' }} />
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
        Planning your financial future...
      </Typography>
    </Box>
  );
};

export default FinancialLoader;
