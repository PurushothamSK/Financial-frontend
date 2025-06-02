import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../Services/LoginApi';
import { useSnackbar, } from '../context/snackbar';
import { useAuth } from '../context/useAuth';
import { IoEye, IoEyeOff } from "react-icons/io5";


const Login = () => {
  const navigate = useNavigate();
  const { showSnackbar, showLoader, hideLoader} = useSnackbar();
  const {setRoles, setTokens, setNames} = useAuth();
  const [showPassword, setShowPassword] = useState(false);



  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Email or Name is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema,
   onSubmit: async (values) => {
  try {
   showLoader();
    const response = await loginApi(values);
    console.log(response)
    hideLoader();
    if(response.success){
    showSnackbar(response.res.message, 'success');
    setRoles(response.res.role);
    setTokens(response.res.token);
    setNames(response.res.name);
    if (response.res.role === 'ADMIN') {
        navigate('/admindashboard');
        showSnackbar('Welcome Admin', 'success');
      } else if (response.res.role === 'USER') {
        showSnackbar(`Welcome ${response.res.name} `, 'success');
        navigate('/basicinfo');
      }
    } else {
      console.error('Login failed:', response.Message);
      showSnackbar(response.message, 'error');
    }
  } catch (error) {
    console.error('Login failed:', error);
    showSnackbar('Login failed', 'error');
  }
},

  });

 return (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f4f6f8', // Optional: subtle background
    }}
  >
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>


        <Box component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name or Email"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.name &&
              Boolean(formik.errors.name)
            }
            helperText={
              formik.touched.name && formik.errors.name
            }
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            // type="password"
            name="password"
            value={formik.values.password}
          type={showPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password && Boolean(formik.errors.password)
            }
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <IoEye style={{ height: '20px', width: '20px' }} /> : <IoEyeOff style={{ height: '20px', width: '20px' }} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Log In
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don’t have an account?{' '}
            <Link href="/register" underline="hover">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  </Box>
);
};

export default Login;
