import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert, Backdrop } from '@mui/material';
import FinancialLoader from '../components/Loader.jsx';

const SnackbarAndLoaderContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSnackbar = () => useContext(SnackbarAndLoaderContext);

export const SnackbarAndLoaderProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false); // ✅ Global loading state

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const hideSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <SnackbarAndLoaderContext.Provider value={{ showSnackbar, showLoader, hideLoader }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={hideSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Backdrop open={loading} sx={{ zIndex: 1300, color: '#fff' }}>
        <FinancialLoader />
      </Backdrop>
    </SnackbarAndLoaderContext.Provider>
  );
};
