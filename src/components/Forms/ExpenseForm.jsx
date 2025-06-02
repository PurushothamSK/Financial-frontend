import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  IconButton,
  Button,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { Formik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../../context/useAuth";
import { getIncome, postExpense } from "../../Services/LoginApi";
import { useSnackbar } from "../../context/snackbar";
import { useNavigate } from "react-router-dom";

const ExpensesForm = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [yearlyIncome, setYearlyIncome] = useState(0);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showLoader, hideLoader, showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchIncome = async () => {
      if (!token) return;
      showLoader();
      const response = await getIncome(token);
      hideLoader();
      if (response.success) {
        const { monthlyIncome, yearlyIncome } = response.data;
        setMonthlyIncome(monthlyIncome || 0);
        setYearlyIncome(yearlyIncome || 0);
        showSnackbar("Income data loaded", "success");
      } else {
        showSnackbar(response.message, "error");
      }
    };
    fetchIncome();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const initialValues = {
    monthlyExpenses: [
      { name: "", amount: "" },
      { name: "", amount: "" },
      { name: "", amount: "" },
    ],
    yearlyExpenses: [
      { name: "", amount: "" },
      { name: "", amount: "" },
      { name: "", amount: "" },
    ],
  };

  const validationSchema = Yup.object().shape({
    monthlyExpenses: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().trim(),
          amount: Yup.number()
            .typeError("Must be a number")
            .min(0, "Must be >= 0"),
        })
      )
      .test(
        "at-least-one-monthly",
        "At least one monthly expense must be filled",
        (arr) => arr.some((e) => e.name && e.amount !== "")
      ),
    yearlyExpenses: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().trim(),
          amount: Yup.number()
            .typeError("Must be a number")
            .min(0, "Must be >= 0"),
        })
      )
      .test(
        "at-least-one-yearly",
        "At least one yearly expense must be filled",
        (arr) => arr.some((e) => e.name && e.amount !== "")
      ),
  });

  const handleSubmit = async (values) => {
    // Filter out only filled fields
    const monthlyExpenses = values.monthlyExpenses.filter(
      (e) => e.name.trim() !== "" && e.amount !== ""
    );
    const yearlyExpenses = values.yearlyExpenses.filter(
      (e) => e.name.trim() !== "" && e.amount !== ""
    );

    const totalMonthly = monthlyExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const totalYearly = yearlyExpenses.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const monthlyExcess = monthlyIncome - totalMonthly;
    const yearlyExcess = yearlyIncome - totalYearly;

    const payload = {
      totalMonthlyExpense: totalMonthly,
      totalYearlyExpense: totalYearly,
      monthlyExcess,
      yearlyExcess,
      monthlyExpenses,
      yearlyExpenses,
    };

    console.log("Submitting payload:", payload);

    try {
      showLoader();
      const response = await postExpense(payload, token);
      hideLoader();
      if (response.success) {
        showSnackbar(response.res.message, "success");
        navigate('/investment');
      } else {
        showSnackbar(response.res.message, "error");
      }
    } catch (error) {
      hideLoader();
      showSnackbar("Failed to save expenses", "error");
      console.error(error);
    }
  };

  return (
    <Box height="100vh" width="100%" display="flex" justifyContent="center" alignItems="center">
      <Paper
        elevation={6}
        sx={{
          width: "85%",
          maxWidth: 1300,
          maxHeight: "93vh",
          p: 2,
          overflowY: "auto",
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" align="center" mb={4}>
          Expenses
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => {
            const { values, handleChange, handleSubmit, errors, touched } = formik;

            const totalMonthly = values.monthlyExpenses.reduce(
              (sum, item) => sum + Number(item.amount || 0),
              0
            );
            const totalYearly = values.yearlyExpenses.reduce(
              (sum, item) => sum + Number(item.amount || 0),
              0
            );
            const monthlyExcess = monthlyIncome - totalMonthly;
            const yearlyExcess = yearlyIncome - totalYearly;

            return (
              <FormikProvider value={formik}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={4} justifyContent="center">
                    {/* Monthly Expenses */}
                    <Grid item xs={12} md={5}>
                      <Typography variant="h6" align="center" gutterBottom>
                        Monthly Expenses
                      </Typography>
                      <FieldArray name="monthlyExpenses">
                        {({ remove, push }) => (
                          <>
                            {values.monthlyExpenses.map((exp, idx) => (
                              <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
                                <Grid item xs={6}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Category"
                                    name={`monthlyExpenses[${idx}].name`}
                                    value={exp.name}
                                    onChange={handleChange}
                                    error={
                                      touched.monthlyExpenses?.[idx]?.name &&
                                      Boolean(errors.monthlyExpenses?.[idx]?.name)
                                    }
                                    helperText={
                                      touched.monthlyExpenses?.[idx]?.name &&
                                      errors.monthlyExpenses?.[idx]?.name
                                    }
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Amount"
                                    type="number"
                                    name={`monthlyExpenses[${idx}].amount`}
                                    value={exp.amount}
                                    onChange={handleChange}
                                    error={
                                      touched.monthlyExpenses?.[idx]?.amount &&
                                      Boolean(errors.monthlyExpenses?.[idx]?.amount)
                                    }
                                    helperText={
                                      touched.monthlyExpenses?.[idx]?.amount &&
                                      errors.monthlyExpenses?.[idx]?.amount
                                    }
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  {idx >= 3 && (
                                    <IconButton onClick={() => remove(idx)} color="error">
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </Grid>
                              </Grid>
                            ))}
                            <Box textAlign="center" mt={1}>
                              <Button
                                onClick={() => push({ name: "", amount: "" })}
                                size="small"
                                startIcon={<AddIcon />}
                              >
                                Add
                              </Button>
                            </Box>
                            <Typography mt={2} fontWeight="bold">
                              Total: ₹{totalMonthly}
                            </Typography>
                          </>
                        )}
                      </FieldArray>
                    </Grid>

                    {/* Yearly Expenses */}
                    <Grid item xs={12} md={5}>
                      <Typography variant="h6" align="center" gutterBottom>
                        Yearly Expenses
                      </Typography>
                      <FieldArray name="yearlyExpenses">
                        {({ remove, push }) => (
                          <>
                            {values.yearlyExpenses.map((exp, idx) => (
                              <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
                                <Grid item xs={6}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Category"
                                    name={`yearlyExpenses[${idx}].name`}
                                    value={exp.name}
                                    onChange={handleChange}
                                    error={
                                      touched.yearlyExpenses?.[idx]?.name &&
                                      Boolean(errors.yearlyExpenses?.[idx]?.name)
                                    }
                                    helperText={
                                      touched.yearlyExpenses?.[idx]?.name &&
                                      errors.yearlyExpenses?.[idx]?.name
                                    }
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Amount"
                                    type="number"
                                    name={`yearlyExpenses[${idx}].amount`}
                                    value={exp.amount}
                                    onChange={handleChange}
                                    error={
                                      touched.yearlyExpenses?.[idx]?.amount &&
                                      Boolean(errors.yearlyExpenses?.[idx]?.amount)
                                    }
                                    helperText={
                                      touched.yearlyExpenses?.[idx]?.amount &&
                                      errors.yearlyExpenses?.[idx]?.amount
                                    }
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  {idx >= 3 && (
                                    <IconButton onClick={() => remove(idx)} color="error">
                                      <DeleteIcon />
                                    </IconButton>
                                  )}
                                </Grid>
                              </Grid>
                            ))}
                            <Box textAlign="center" mt={1}>
                              <Button
                                onClick={() => push({ name: "", amount: "" })}
                                size="small"
                                startIcon={<AddIcon />}
                              >
                                Add
                              </Button>
                            </Box>
                            <Typography mt={2} fontWeight="bold">
                              Total: ₹{totalYearly}
                            </Typography>
                          </>
                        )}
                      </FieldArray>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  {/* Excess Cards */}
                  <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={5}>
                      <Card sx={{ backgroundColor: "#e3f2fd", boxShadow: 3 }}>
                        <CardContent>
                          <Typography variant="h6" align="center">
                            Monthly Excess: ₹{monthlyExcess}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Card sx={{ backgroundColor: "#f1f8e9", boxShadow: 3 }}>
                        <CardContent>
                          <Typography variant="h6" align="center">
                            Yearly Excess: ₹{yearlyExcess}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Box textAlign="center" mt={4}>
                    <Button type="submit" variant="contained" color="primary" size="large">
                      Save Expenses
                    </Button>
                  </Box>
                </form>
              </FormikProvider>
            );
          }}
        </Formik>
      </Paper>
    </Box>
  );
};

export default ExpensesForm;
