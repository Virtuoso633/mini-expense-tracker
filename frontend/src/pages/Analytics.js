// import { useState, useEffect } from 'react';
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   MenuItem,
//   TextField
// } from '@mui/material';
// import { PieChart } from '@mui/x-charts';
// import { DatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import DashboardLayout from '../components/Layout/DashboardLayout';

// const Analytics = () => {
//   const [insights, setInsights] = useState([]);
//   const [dateRange, setDateRange] = useState({
//     startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
//     endDate: new Date()
//   });
//   const [totalExpense, setTotalExpense] = useState(0);

//   useEffect(() => {
//     fetchInsights();
//   }, [dateRange]);

//   const fetchInsights = async () => {
//     try {
//       const params = new URLSearchParams({
//         startDate: dateRange.startDate.toISOString(),
//         endDate: dateRange.endDate.toISOString()
//       });

//       const response = await fetch(
//         `http://localhost:5000/api/expenses/insights?${params}`,
//         { credentials: 'include' }
//       );
//       const data = await response.json();
      
//       setInsights(data);
//       setTotalExpense(data.reduce((sum, item) => sum + item.total, 0));
//     } catch (error) {
//       console.error('Error fetching insights:', error);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Typography variant="h4" gutterBottom>
//             Expense Analytics
//           </Typography>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <LocalizationProvider dateAdapter={AdapterDateFns}>
//               <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                   <DatePicker
//                     label="Start Date"
//                     value={dateRange.startDate}
//                     onChange={(newDate) => setDateRange(prev => ({
//                       ...prev,
//                       startDate: newDate
//                     }))}
//                     renderInput={(params) => <TextField {...params} fullWidth />}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <DatePicker
//                     label="End Date"
//                     value={dateRange.endDate}
//                     onChange={(newDate) => setDateRange(prev => ({
//                       ...prev,
//                       endDate: newDate
//                     }))}
//                     renderInput={(params) => <TextField {...params} fullWidth />}
//                   />
//                 </Grid>
//               </Grid>
//             </LocalizationProvider>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Total Expenses
//             </Typography>
//             <Typography variant="h4">
//               ${totalExpense.toFixed(2)}
//             </Typography>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Expense Distribution
//             </Typography>
//             <Box sx={{ height: 400 }}>
//               <PieChart
//                 series={[{
//                   data: insights.map(item => ({
//                     id: item.category,
//                     value: item.total,
//                     label: `${item.category} (${((item.total/totalExpense)*100).toFixed(1)}%)`
//                   }))
//                 }]}
//                 height={350}
//               />
//             </Box>
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Category Breakdown
//             </Typography>
//             <Box sx={{ mt: 2 }}>
//               {insights.map((item) => (
//                 <Box
//                   key={item.category}
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     mb: 1
//                   }}
//                 >
//                   <Typography>
//                     {item.category}
//                   </Typography>
//                   <Typography>
//                     ${item.total.toFixed(2)}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </DashboardLayout>
//   );
// };

// export default Analytics;


import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PieChart } from '@mui/x-charts';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Analytics = () => {
  const [insights, setInsights] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [totalExpense, setTotalExpense] = useState(0);

  const fetchInsights = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      });

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(
        `${API_URL}/api/expenses/insights?${params}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      
      setInsights(data);
      setTotalExpense(data.reduce((sum, item) => sum + item.total, 0));
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsights([]);
      setTotalExpense(0);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Expense Analytics
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(newDate) => setDateRange(prev => ({
                      ...prev,
                      startDate: newDate
                    }))}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(newDate) => setDateRange(prev => ({
                      ...prev,
                      endDate: newDate
                    }))}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Total Expenses
            </Typography>
            <Typography variant="h4">
              ${totalExpense.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Expense Distribution
            </Typography>
            {insights.length > 0 ? (
              <Box sx={{ height: 400 }}>
                <PieChart
                  series={[{
                    data: insights.map(item => ({
                      id: item.category,
                      value: item.total,
                      label: `${item.category} (${((item.total/totalExpense)*100).toFixed(1)}%)`
                    }))
                  }]}
                  height={350}
                />
              </Box>
            ) : (
              <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary">
                  No data available for selected date range
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              {insights.map((item) => (
                <Box
                  key={item.category}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                    p: 1,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Typography>
                    {item.category}
                  </Typography>
                  <Typography>
                    ${item.total.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Analytics;
