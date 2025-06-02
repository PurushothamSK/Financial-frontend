import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../context/useAuth";
import { useSnackbar } from "../../context/snackbar";
import { useNavigate } from "react-router-dom";
import { income } from "../../Services/LoginApi";

const Income = () => {
  const { token } = useAuth();
  const { showSnackbar, showLoader, hideLoader } = useSnackbar();
  const navigate = useNavigate();

  const fixedMonthly = ["salary", "income1", "income2"];
  const fixedYearly = ["y_income1", "y_income2", "y_income3"];

  const [monthlyFields, setMonthlyFields] = useState(fixedMonthly);
  const [yearlyFields, setYearlyFields] = useState(fixedYearly);

  const buildInitialValues = () => {
    const values = {};
    [...monthlyFields, ...yearlyFields].forEach((key) => (values[key] = ""));
    return values;
  };

  const buildValidationSchema = () => {
    const shape = {};
    [...monthlyFields, ...yearlyFields].forEach((key) => {
      shape[key] = Yup.number()
        .typeError("Must be a number")
        .min(0, "Must be positive")
        .nullable(); // not required
    });
    return Yup.object().shape(shape);
  };

  const validate = (values) => {
    const hasMonthly = monthlyFields.some((key) => Number(values[key]) > 0);
    const hasYearly = yearlyFields.some((key) => Number(values[key]) > 0);
    const errors = {};
    if (!hasMonthly || !hasYearly) {
      errors._global =
        "At least one Monthly and one Yearly income is required.";
    }
    return errors;
  };

const handleSubmit = async (values, { setSubmitting }) => {
  try {
    showLoader();

    const monthlyIncome = monthlyFields
      .map((key) => Number(values[key]))
      .filter((v) => !isNaN(v) && v > 0)
      .reduce((a, b) => a + b, 0);

    const yearlyIncome = yearlyFields
      .map((key) => Number(values[key]))
      .filter((v) => !isNaN(v) && v > 0)
      .reduce((a, b) => a + b, 0);

    const totalYearlyIncome = monthlyIncome * 12 + yearlyIncome;

    const payload = {
      monthlyIncome,
      yearlyIncome,
      totalYearlyIncome,
    };

    const response = await income(payload, token);

    hideLoader();
    if (response.success) {
      showSnackbar(response.res.message || "Income saved successfully!", "success");
      navigate("/expenseinfo");
    } else {
      showSnackbar(response.message, "error");
    }
  } catch (err) {
    hideLoader();
    showSnackbar("Failed to save income", err.message || err);
  }

  setSubmitting(false);
};




  const inputStyles = {
    "& .MuiInputBase-root": {
      height: 60,
      fontSize: "1.1rem",
    },
    "& .MuiInputLabel-root": {
      fontSize: "1rem",
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6f8",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 820, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Income Information
        </Typography>

        <Formik
          initialValues={buildInitialValues()}
          validationSchema={buildValidationSchema()}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            // setFieldValue,
            setValues,
          }) => {
            const monthlyTotal = monthlyFields.reduce(
              (sum, key) => sum + (Number(values[key]) || 0),
              0
            );
            const yearlyTotal = yearlyFields.reduce(
              (sum, key) => sum + (Number(values[key]) || 0),
              0
            );
            const totalYearlyIncome = monthlyTotal * 12 + yearlyTotal;

            const handleAddMonthly = () => {
              const next = `income${monthlyFields.length}`;
              if (!values[next]) {
                setValues({ ...values, [next]: "" });
              }
              setMonthlyFields((prev) => [...prev, next]);
            };

            const handleRemoveMonthly = (field) => {
              const { [field]: _, ...rest } = values;
              setValues(rest);
              setMonthlyFields((prev) => prev.filter((f) => f !== field));
            };

            const handleAddYearly = () => {
              const next = `y_income${yearlyFields.length + 1}`;
              if (!values[next]) {
                setValues({ ...values, [next]: "" });
              }
              setYearlyFields((prev) => [...prev, next]);
            };

            const handleRemoveYearly = (field) => {
              const { [field]: _, ...rest } = values;
              setValues(rest);
              setYearlyFields((prev) => prev.filter((f) => f !== field));
            };

            return (
              <Form>
                <Grid
                  container
                  spacing={4}
                  alignItems="center"
                  justifyContent="center"
                >
                  {/* Monthly Income */}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    display="flex"
                    justifyContent="center"
                  >
                    <Box sx={{ width: "100%", maxWidth: 390 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Monthly Income
                      </Typography>
                      {monthlyFields.map((field, idx) => (
                        <Grid
                          container
                          spacing={3}
                          alignItems="center"
                          key={field}
                          sx={{ mb: 1 }}
                        >
                          <Grid item xs>
                            <Field name={field}>
                              {({ field: f }) => (
                                <TextField
                                  fullWidth
                                  type="number"
                                  label={
                                    field === "salary"
                                      ? "Salary"
                                      : `Income ${idx}`
                                  }
                                  {...f}
                                  error={Boolean(
                                    errors[field] && touched[field]
                                  )}
                                  helperText={touched[field] && errors[field]}
                                  sx={inputStyles}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item>
                            {!fixedMonthly.includes(field) && (
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveMonthly(field)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      ))}
                      <IconButton color="success" onClick={handleAddMonthly}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <Box sx={{ mt: 1 }}>
                        <Typography>
                          <strong>Total:</strong> ₹{" "}
                          {monthlyTotal.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Yearly Income */}
                  <Grid
                    item
                    xs={12}
                    md={6}
                    display="flex"
                    justifyContent="center"
                  >
                    <Box sx={{ width: "100%", maxWidth: 390 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Yearly Income
                      </Typography>
                      {yearlyFields.map((field, idx) => (
                        <Grid
                          container
                          spacing={3}
                          alignItems="center"
                          key={field}
                          sx={{ mb: 1 }}
                        >
                          <Grid item xs>
                            <Field name={field}>
                              {({ field: f }) => (
                                <TextField
                                  fullWidth
                                  type="number"
                                  label={`Income ${idx + 1}`}
                                  {...f}
                                  error={Boolean(
                                    errors[field] && touched[field]
                                  )}
                                  helperText={touched[field] && errors[field]}
                                  sx={inputStyles}
                                />
                              )}
                            </Field>
                          </Grid>
                          <Grid item>
                            {!fixedYearly.includes(field) && (
                              <IconButton
                                color="error"
                                onClick={() => handleRemoveYearly(field)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      ))}
                      <IconButton color="success" onClick={handleAddYearly}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <Box sx={{ mt: 1 }}>
                        <Typography>
                          <strong>Total:</strong> ₹{" "}
                          {yearlyTotal.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Global Error */}
                {errors._global && (
                  <Box mt={2}>
                    <Typography color="error" align="center">
                      {errors._global}
                    </Typography>
                  </Box>
                )}

                <Box mt={4}>
                  <Typography variant="h6" align="center">
                    <strong>Total Yearly Income:</strong> ₹{" "}
                    {totalYearlyIncome.toLocaleString()}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ mt: 3 }}
                >
                  Save Income
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </Box>
  );
};

export default Income;
