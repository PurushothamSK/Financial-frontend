import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { getUser } from '../Services/LoginApi';
import { useAuth } from '../context/useAuth';
import { useSnackbar } from '../context/snackbar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUser(token);
        setUsers(response.res.data);
        showSnackbar(response.res.message || 'Users loaded', 'success');
      } catch (error) {
        console.error('Error fetching users:', error);
        showSnackbar('Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token,]);

  return (
    <Box p={4} mt={8}>
      <Typography variant="h4" fontWeight="bold" mb={3} color="primary">
        All Registered Users
      </Typography>

      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background: 'linear-gradient(to right, #2196f3, #21cbf3)',
                  }}
                >
                  {['SL No', 'User Name', 'Email', 'Role', 'Date', 'Time'].map((header) => (
                    <TableCell key={header} sx={{ color: '#000', fontWeight: 'bold' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => {
                  const createdAt = new Date(user.createdAt);
                  return (
                    <TableRow
                      key={user._id}
                      sx={{
                        backgroundColor: index % 2 === 0 ? '#f0f7ff' : '#ffffff',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                        },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: user.role === 'admin' ? '#d32f2f' : '#388e3c',
                            color: '#fff',
                            borderRadius: 2,
                            fontSize: '0.8rem',
                            textTransform: 'capitalize',
                          }}
                        >
                          {user.role}
                        </Box>
                      </TableCell>
                      <TableCell>{createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminUsers;
