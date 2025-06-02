import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box
} from '@mui/material';
import { useAuth } from '../context/useAuth';
import { tableResult } from '../Services/LoginApi';

const SimulationTable = () => {
  const [tableData, setTableData] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
 
    fetchSimulation();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSimulation = async () => {
    try {
      // setLoading(true);
      // setError('');
      const response = await tableResult(token);
      console.log(response.res.data)
      if (response.success) {
        setTableData(response.res.data);
      } else {
        // setError(response.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Unexpected error occurred while fetching simulation results.', err);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: 5, marginTop: 8, borderRadius: 3, backgroundColor: '#f9fafb' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
        Retirement Simulation Results
      </Typography>

  
        <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                {[
                  'Age',
                  'Starting Saving',
                  'Planned Expenses (Post-Tax)',
                  'Additional Expenses (Post-Tax)',
                  'Additional Savings',
                  'Ending Savings',
                  'Status',
                  'Retirement Year',
                  'Warning'
                ].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', backgroundColor: '#1976d2', color: '#fff' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f0f4f8' : '#ffffff',
                    '&:hover': { backgroundColor: '#e0f7fa' },
                  }}
                >
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.startingSaving?.toLocaleString()}</TableCell>
                  <TableCell>{row.plannedExpenses?.toLocaleString()}</TableCell>
                  <TableCell>{row.additionalExpenses?.toLocaleString()}</TableCell>
                  <TableCell>{row.additionalSavings?.toLocaleString()}</TableCell>
                  <TableCell>{row.endingSaving?.toLocaleString()}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      color: row.status === 'Dead' ? 'error.main' : 'success.main',
                    }}
                  >
                    {row.status}
                  </TableCell>
                  <TableCell>{row.retirementYear}</TableCell>
                  <TableCell sx={{ color: row.warning ? 'error.main' : 'inherit' }}>
                    {row.warning}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      
    </Paper>
  );
};

export default SimulationTable;
