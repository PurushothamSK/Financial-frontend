import React from 'react';
import {
  Box, Paper, Typography, TextField, Grid, Divider, Card, CardContent, Avatar, Button
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import ElderlyIcon from '@mui/icons-material/Elderly';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useFormik } from 'formik';
import { useSnackbar } from '../../context/snackbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { postRetirement } from '../../Services/LoginApi';
import SimulationTable from '../../pages/SimulationTable';

// Asset display component
const InvestmentCards = ({ data }) => {
  const colors = ['#e8f5e9', '#e3f2fd', '#fff3e0', '#fce4ec'];
  const icons = [
    <SavingsIcon />, <TrendingUpIcon />, <BarChartIcon />, <MonetizationOnIcon />
  ];

  return (
    <Grid container spacing={2} mt={1}>
      {data.map((item, index) => (
        <Grid item xs={12} sm={6} md={6} key={index}>
          <Card
            sx={{
              backgroundColor: colors[index % colors.length],
              borderLeft: '6px solid #1976d2',
              borderRadius: 2,
              boxShadow: 3,
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Box mr={1}>{icons[index % icons.length]}</Box>
                <Typography variant="h6">{item.name}</Typography>
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Return</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{item.return}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Tax</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{item.tax}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Share</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{item.share}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Amount</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">₹ {item.amount.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Default investment approach data
const defaultApproach = [
  { name: 'Fixed Returns', return: 7, tax: 30, share: 0 },
  { name: 'Large Cap Mutual Funds', return: 12, tax: 20, share: 40 },
  { name: 'Direct Stocks', return: 15, tax: 20, share: 35 },
  { name: 'Smallcap Mutual Funds', return: 18, tax: 20, share: 25 },
];



const RetirementPlanForm = () => {

  const { showSnackbar, showLoader, hideLoader } = useSnackbar();
  const navigate = useNavigate();
  const {token} = useAuth();
  const formik = useFormik({
    initialValues: {
      currentSavings: '',
      stepUp: 5,
      postRetirementMonthlyAmount: '',
      inflation: 6,
      currentApproach: defaultApproach,
      postApproach: [
        { ...defaultApproach[0], share: 50 },
        { ...defaultApproach[1], share: 50 },
        { ...defaultApproach[2], share: 0 },
        { ...defaultApproach[3], share: 0 },
      ],
    },
    onSubmit: async(values) => {
      const currentDistribution = calculateDistribution(values.currentSavings, values.currentApproach);
      const postDistribution = calculateDistribution(values.postRetirementMonthlyAmount, values.postApproach);

      const payload = {
        ...values,
        currentDistribution,
        postDistribution
        
      };
      try{
        showLoader();
        const response = await postRetirement(payload, token);
        if (response.success) {
          hideLoader();
          showSnackbar(response.res.message, "success");
          navigate("/table");
        } else {
          console.error("Login failed:", response.Message);
          showSnackbar(response.message, "error");
        }
      }catch (error) {
        console.error("Login failed:", error);
        showSnackbar("Login failed", "error");
      }

   
    }
  });

  const calculateDistribution = (amount, approach) => {
    return approach.map(asset => ({
      ...asset,
      amount: ((amount || 0) * asset.share) / 100,
    }));
  };

  const currentDist = calculateDistribution(formik.values.currentSavings, formik.values.currentApproach);
  const postDist = calculateDistribution(formik.values.postRetirementMonthlyAmount, formik.values.postApproach);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#e3f2fd">
      <Paper elevation={6} sx={{ p: 4, maxWidth: 1000, width: '100%', borderRadius: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="h4" align="center" gutterBottom color="primary.dark">
            🧮 Retirement Investment Planner
          </Typography>

          {/* Current Savings */}
          <Card sx={{ my: 3, background: '#f1f8e9' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ bgcolor: '#8bc34a' }}>
                    <SavingsIcon />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h6">Current Savings & Investment</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Current Savings Amount" name="currentSavings"
                    value={formik.values.currentSavings} onChange={formik.handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Step-up in savings per year (%)" name="stepUp"
                    value={formik.values.stepUp} onChange={formik.handleChange}
                    type="number"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" mt={2} gutterBottom>
                Investment Allocation
              </Typography>
              <InvestmentCards data={currentDist} />
            </CardContent>
          </Card>

          {/* Post-Retirement Section */}
          <Card sx={{ my: 3, background: '#fff8e1' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ bgcolor: '#ffb300' }}>
                    <ElderlyIcon />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h6">Post-Retirement Planning</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Monthly Post-Retirement Amount" name="postRetirementMonthlyAmount"
                    value={formik.values.postRetirementMonthlyAmount} onChange={formik.handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth label="Inflation Rate (%)" name="inflation"
                    value={formik.values.inflation} onChange={formik.handleChange}
                    type="number"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" mt={2} gutterBottom>
                Post-Retirement Investment Allocation
              </Typography>
              <InvestmentCards data={postDist} />
            </CardContent>
          </Card>

          <Divider sx={{ my: 3 }} />

          {/* Submit Button */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" color="primary" size="large" type="submit">
              Submit Retirement Plan
            </Button>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={2}>
            <Typography variant="caption" color="textSecondary">
              Frantiger Financial Planning Calculator
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RetirementPlanForm;
