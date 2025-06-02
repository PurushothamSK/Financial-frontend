import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../context/useAuth';
import { useSnackbar, } from '../../context/snackbar';
import { basicInfo } from '../../Services/LoginApi';
import {useNavigate } from 'react-router-dom';


const BasicInfoSchema = Yup.object().shape({
  currentAge: Yup.number().required('Required').min(18).max(100),
  retirementAge: Yup.number().required('Required').min(30).max(100),
  lifeExpectancy: Yup.number().required('Required').min(50).max(120),
});

const Basicinfo = () => {
  const { token } = useAuth();
  const { showSnackbar, showLoader, hideLoader } = useSnackbar();
  const navigate = useNavigate();


  const initialValues = {
    currentAge: '',
    retirementAge: '',
    lifeExpectancy: '',
    inflation: 6,
    capitalGainsTax: 20,
    incomeTax: 30,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      currentAge: values.currentAge,
      retirementAge: values.retirementAge,
      lifeExpectancy: values.lifeExpectancy,
      inflation: 6,
      capitalGainsTax: 20,
      incomeTax: 30,
    };

    try {
      showLoader();
      const response = await basicInfo(payload, token);
      hideLoader();
      if (response.success) {
        showSnackbar(response.res.message, 'success');
        navigate('/incomeinfo');
      } else {
        showSnackbar(response.message, 'error');
      }
    } catch (error) {
      console.error(error);
      showSnackbar('Login failed', 'error');      
    }
     
   
     

    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f4f6f8'
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          width: 500,
          borderRadius: 3,
          mt:7,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Basic Financial Info
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={BasicInfoSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              {['currentAge', 'retirementAge', 'lifeExpectancy'].map((field) => (
                <Field name={field} key={field}>
                  {({ field: f }) => (
                    <TextField
                      fullWidth
                      margin="normal"
                      type="number"
                      label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      {...f}
                      error={Boolean(errors[field] && touched[field])}
                      helperText={touched[field] && errors[field]}
                    />
                  )}
                </Field>
              ))}

              <TextField
                fullWidth
                margin="normal"
                type="number"
                label="Inflation"
                value={6}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="number"
                label="Capital Gains Tax"
                value={20}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                type="number"
                label="Income Tax"
                value={30}
                InputProps={{ readOnly: true }}
              />

              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 3 }}
              >
                Save
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Basicinfo;
