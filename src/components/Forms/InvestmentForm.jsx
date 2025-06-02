import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Grid,
  Typography,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/snackbar";
import { postInvestment } from "../../Services/LoginApi";

const IRRs = {
  safe: 7,
  stock: {
    largecap: 12,
    stocks: 10,
    smallcap: 18,
  },
};

const initialValues = {
  totalInvestment: "",
  safeAssetPercent: "",
  stockAssetPercent: "",
  safeInvestments: {
    vpf: 0,
    rd: 0,
    bills: 0,
    gold: 0,
    bonds: 0,
  },
  stockInvestments: {
    largecap: 0,
    stocks: 0,
    smallcap: 0,
  },
};

const validationSchema = Yup.object().shape({
  totalInvestment: Yup.number().required("Required").min(0),
  safeAssetPercent: Yup.number().required("Required").min(0).max(100),
  stockAssetPercent: Yup.number()
    .required("Required")
    .min(0)
    .max(100)
    .test("sum", "Safe + Stock must be 100%", function (value) {
      return this.parent.safeAssetPercent + value === 100;
    }),
  safeInvestments: Yup.object().when("safeAssetPercent", {
    is: 0,
    then: (schema) =>
      schema.test("safe-all-zero", "All Safe Investments must be 0", (obj) =>
        Object.values(obj).every((v) => v === 0)
      ),
  }),
});

const AutoCalculateInvestments = ({ setBlendedReturn }) => {
  const { values, setFieldValue } = useFormikContext();

  React.useEffect(() => {
    const total = parseFloat(values.totalInvestment) || 0;
    const safePercent = parseFloat(values.safeAssetPercent) || 0;
    const stockPercent = parseFloat(values.stockAssetPercent) || 0;

    const safeTotal = (safePercent / 100) * total;
    const stockTotal = (stockPercent / 100) * total;

    const safeEach = safePercent === 0 ? 0 : parseFloat((safeTotal / 5).toFixed(2));
    const newSafe = {
      vpf: safeEach,
      rd: safeEach,
      bills: safeEach,
      gold: safeEach,
      bonds: safeEach,
    };

    const newStock = {
      largecap: stockPercent === 0 ? 0 : parseFloat((stockTotal * 0.4).toFixed(2)),
      stocks: stockPercent === 0 ? 0 : parseFloat((stockTotal * 0.35).toFixed(2)),
      smallcap: stockPercent === 0 ? 0 : parseFloat((stockTotal * 0.25).toFixed(2)),
    };

    Object.entries(newSafe).forEach(([key, value]) => {
      setFieldValue(`safeInvestments.${key}`, value);
    });
    Object.entries(newStock).forEach(([key, value]) => {
      setFieldValue(`stockInvestments.${key}`, value);
    });

    const safeReturn = safeTotal * IRRs.safe;
    const stockReturn =
      newStock.largecap * IRRs.stock.largecap +
      newStock.stocks * IRRs.stock.stocks +
      newStock.smallcap * IRRs.stock.smallcap;

    const blended = total > 0 ? ((safeReturn + stockReturn) / total).toFixed(2) : 0;

    setBlendedReturn(blended);
  }, [
    values.totalInvestment,
    values.safeAssetPercent,
    values.stockAssetPercent,
    setFieldValue,
    setBlendedReturn,
  ]);

  return null;
};

const InvestmentForm = () => {
  const [blendedReturn, setBlendedReturn] = useState(0);
  const {token} = useAuth();
  const navigate = useNavigate();
  const { showLoader, hideLoader, showSnackbar } = useSnackbar();


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f4f6f8"
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }} >
          Investment Planning
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
           onSubmit={async (values) => {
    try {
       const payload = {
       totalMonthlyInvestment: values.totalInvestment,       // ✅ correct mapping
  safeAssetPercentage: values.safeAssetPercent,         // ✅ correct mapping
  stockMarketPercentage: values.stockAssetPercent,      // ✅ correct mapping
  blendedReturn: blendedReturn,
  safeInvestments: values.safeInvestments,
  stockInvestments: values.stockInvestments,
    };
    console.log(payload);
      showLoader();
      const response = await postInvestment(payload, token);
      hideLoader();

      if (response.success) {
        showSnackbar(response.res.message, "success");
        navigate("/retirement-savings");
      } else {
        showSnackbar(response.message, "error");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      showSnackbar("Submission failed", "error");
    }
  }}
>
  
          {({ values }) => (
            <Form>
              <AutoCalculateInvestments setBlendedReturn={setBlendedReturn} />

              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={8}>
                  <Field
                    name="totalInvestment"
                    as={TextField}
                    label="Total Investment Per Month"
                    fullWidth
                    type="number"
                  />
                  <ErrorMessage name="totalInvestment" component="div" style={{ color: "red" }} />
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Field
                    name="safeAssetPercent"
                    as={TextField}
                    label="Safe Asset %"
                    fullWidth
                    type="number"
                  />
                </Grid>

                <Grid item xs={6} sm={4}>
                  <Field
                    name="stockAssetPercent"
                    as={TextField}
                    label="Stock Market %"
                    fullWidth
                    type="number"
                  />
                  <ErrorMessage name="stockAssetPercent" component="div" style={{ color: "red" }} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" align="center" sx={{ml:0, mr:3}}>
                    Safe Asset Investments
                  </Typography>
                </Grid>
                {Object.entries(values.safeInvestments).map(([key, val]) => (
                  <Grid item xs={6} sm={4} key={key}>
                    <TextField
                      label={key.toUpperCase()}
                      value={val}
                      fullWidth
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Typography variant="h6" align="center">
                    Stock Market Investments
                  </Typography>
                </Grid>
                {Object.entries(values.stockInvestments).map(([key, val]) => (
                  <Grid item xs={6} sm={4} key={key}>
                    <TextField
                      label={key.toUpperCase()}
                      value={val}
                      fullWidth
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Box
                    sx={{
                      backgroundColor: "#e3f2fd",
                      padding: 2,
                      borderRadius: 2,
                      textAlign: "center",
                      border: "1px solid #90caf9",
                      maxWidth: 500,
                      mx: "auto",
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      Blended Return: {blendedReturn}%
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center" >
                    <Button type="submit" variant="contained" color="primary" size="large">
                      Save Investment Plan
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default InvestmentForm;
