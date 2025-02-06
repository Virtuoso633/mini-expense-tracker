// import { useState, useEffect, useCallback } from 'react';
// import {
//     Grid,
//     Paper,
//     Typography,
//     Box,
//     Button,
//     Dialog,
//     CircularProgress
// } from '@mui/material';
// import { BarChart } from '@mui/x-charts';
// import DashboardLayout from '../components/Layout/DashboardLayout';
// import ExpenseList from '../components/Expense/ExpenseList';
// import ExpenseForm from '../components/Expense/ExpenseForm';

// const Dashboard = () => {
//     const [loading, setLoading] = useState(true);
//     const [expenses, setExpenses] = useState([]);
//     const [page, setPage] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);
//     const [openForm, setOpenForm] = useState(false);
//     const [selectedExpense, setSelectedExpense] = useState(null);
//     const [chartData, setChartData] = useState([]);

//     const fetchExpenses = useCallback(async () => {
//         try {
//             const response = await fetch(
//                 `http://localhost:5000/api/expenses?page=${page + 1}`,
//                 { credentials: 'include' }
//             );
//             const data = await response.json();
//             setExpenses(data.expenses || []);
//             setTotalPages(data.totalPages || 0);
//         } catch (error) {
//             console.error('Error fetching expenses:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [page]);

//     const fetchChartData = useCallback(async () => {
//         try {
//             const response = await fetch(
//                 'http://localhost:5000/api/expenses/insights',
//                 { credentials: 'include' }
//             );
//             const data = await response.json();
//             setChartData(data || []);
//         } catch (error) {
//             console.error('Error fetching chart data:', error);
//         }
//     }, []);

//     useEffect(() => {
//         fetchExpenses();
//         fetchChartData();
//     }, [fetchExpenses, fetchChartData]);

//     const handleSubmit = async (formData) => {
//         try {
//             const url = selectedExpense
//                 ? `http://localhost:5000/api/expenses/${selectedExpense._id}`
//                 : 'http://localhost:5000/api/expenses';

//             const method = selectedExpense ? 'PUT' : 'POST';

//             await fetch(url, {
//                 method,
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify(formData)
//             });

//             setOpenForm(false);
//             setSelectedExpense(null);
//             fetchExpenses();
//             fetchChartData();
//         } catch (error) {
//             console.error('Error saving expense:', error);
//             throw new Error('Failed to save expense');
//         }
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this expense?')) {
//             try {
//                 await fetch(`http://localhost:5000/api/expenses/${id}`, {
//                     method: 'DELETE',
//                     credentials: 'include'
//                 });
//                 fetchExpenses();
//                 fetchChartData();
//             } catch (error) {
//                 console.error('Error deleting expense:', error);
//             }
//         }
//     };

//     if (loading) {
//         return (
//             <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <DashboardLayout>
//             <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                     <Box display="flex" justifyContent="space-between" alignItems="center">
//                         <Typography variant="h4">Dashboard</Typography>
//                         <Button
//                             variant="contained"
//                             onClick={() => {
//                                 setSelectedExpense(null);
//                                 setOpenForm(true);
//                             }}
//                         >
//                             Add Expense
//                         </Button>
//                     </Box>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <Paper elevation={3} sx={{ p: 2 }}>
//                         <Typography variant="h6" gutterBottom>
//                             Spending by Category
//                         </Typography>
//                         <Box sx={{ height: 300 }}>
//                             <BarChart
//                                 dataset={chartData}
//                                 xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
//                                 series={[{ dataKey: 'total', label: 'Amount ($)' }]}
//                                 height={250}
//                             />
//                         </Box>
//                     </Paper>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <ExpenseList
//                         expenses={expenses}
//                         onEdit={(expense) => {
//                             setSelectedExpense(expense);
//                             setOpenForm(true);
//                         }}
//                         onDelete={handleDelete}
//                         page={page}
//                         totalPages={totalPages}
//                         onPageChange={setPage}
//                     />
//                 </Grid>
//             </Grid>

//             <Dialog open={openForm} onClose={() => setOpenForm(false)}>
//                 <ExpenseForm
//                     expense={selectedExpense}
//                     onSubmit={handleSubmit}
//                     onClose={() => setOpenForm(false)}
//                 />
//             </Dialog>
//         </DashboardLayout>
//     );
// };

// export default Dashboard;



//code 2

// import { useState, useEffect, useCallback } from 'react';
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   useTheme,
//   useMediaQuery,
//   CircularProgress
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   TrendingUp,
//   AttachMoney,
//   ShowChart
// } from '@mui/icons-material';
// import { BarChart, PieChart } from '@mui/x-charts';
// import DashboardLayout from '../components/Layout/DashboardLayout';
// import ExpenseList from '../components/Expense/ExpenseList';
// import { useNavigate } from 'react-router-dom';

// const Dashboard = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const [loading, setLoading] = useState(true);
//   const [expenses, setExpenses] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalExpense, setTotalExpense] = useState(0);
//   const [chartData, setChartData] = useState([]);
//   const [recentTransactions, setRecentTransactions] = useState([]);

//   const fetchDashboardData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [expensesRes, insightsRes] = await Promise.all([
//         fetch(`http://localhost:5000/api/expenses?page=${page + 1}&limit=5`, {
//           credentials: 'include'
//         }),
//         fetch('http://localhost:5000/api/expenses/insights', {
//           credentials: 'include'
//         })
//       ]);

//       if (!expensesRes.ok || !insightsRes.ok) {
//         throw new Error('Failed to fetch data');
//       }

//       const expensesData = await expensesRes.json();
//       const insightsData = await insightsRes.json();

//       setExpenses(expensesData.expenses || []);
//       setTotalPages(expensesData.totalPages || 0);
//       setChartData(insightsData || []);
//       setTotalExpense(
//         Array.isArray(insightsData)
//           ? insightsData.reduce((sum, item) => sum + (item.total || 0), 0)
//           : 0
//       );
//       setRecentTransactions(
//         Array.isArray(expensesData.expenses)
//           ? expensesData.expenses.slice(0, 5)
//           : []
//       );
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setExpenses([]);
//       setChartData([]);
//       setTotalExpense(0);
//       setRecentTransactions([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [page]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   const handleEdit = (expense) => {
//     navigate(`/dashboard/edit/${expense._id}`, { state: { expense } });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this expense?')) {
//       try {
//         const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
//           method: 'DELETE',
//           credentials: 'include'
//         });

//         if (!response.ok) {
//           throw new Error('Failed to delete expense');
//         }

//         fetchDashboardData();
//       } catch (error) {
//         console.error('Error deleting expense:', error);
//       }
//     }
//   };

//   const StatCard = ({ title, value, icon, color }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box display="flex" alignItems="center" justifyContent="space-between">
//           <Box>
//             <Typography color="textSecondary" gutterBottom>
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div">
//               ${value.toFixed(2)}
//             </Typography>
//           </Box>
//           <Box
//             sx={{
//               backgroundColor: `${color}20`,
//               p: 1,
//               borderRadius: '50%',
//             }}
//           >
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
//           <CircularProgress />
//         </Box>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <Box sx={{ p: 3 }}>
//         <Grid container spacing={3}>
//           {/* Header */}
//           <Grid item xs={12}>
//             <Box display="flex" justifyContent="space-between" alignItems="center">
//               <Typography variant="h4">Dashboard</Typography>
//               <Button
//                 variant="contained"
//                 startIcon={<AddIcon />}
//                 onClick={() => navigate('/dashboard/add')}
//               >
//                 Add Expense
//               </Button>
//             </Box>
//           </Grid>

//           {/* Stats Cards */}
//           <Grid item xs={12} md={4}>
//             <StatCard
//               title="Total Expenses"
//               value={totalExpense}
//               icon={<AttachMoney color="primary" />}
//               color={theme.palette.primary.main}
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <StatCard
//               title="Monthly Average"
//               value={totalExpense / 12}
//               icon={<TrendingUp color="secondary" />}
//               color={theme.palette.secondary.main}
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <StatCard
//               title="Daily Average"
//               value={totalExpense / 30}
//               icon={<ShowChart color="success" />}
//               color={theme.palette.success.main}
//             />
//           </Grid>

//           {/* Charts */}
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 2, height: '100%' }}>
//               <Typography variant="h6" gutterBottom>
//                 Expense Distribution
//               </Typography>
//               {chartData.length > 0 ? (
//                 !isMobile ? (
//                   <PieChart
//                     series={[{
//                       data: chartData.map(item => ({
//                         id: item.category,
//                         value: item.total,
//                         label: item.category
//                       }))
//                     }]}
//                     height={300}
//                   />
//                 ) : (
//                   <BarChart
//                     dataset={chartData}
//                     xAxis={[{ scaleType: 'band', dataKey: 'category' }]}
//                     series={[{ dataKey: 'total', label: 'Amount ($)' }]}
//                     height={300}
//                   />
//                 )
//               ) : (
//                 <Box display="flex" justifyContent="center" alignItems="center" height="300px">
//                   <Typography color="textSecondary">No data available</Typography>
//                 </Box>
//               )}
//             </Paper>
//           </Grid>

//           {/* Recent Transactions */}
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 2, height: '100%' }}>
//               <Typography variant="h6" gutterBottom>
//                 Recent Transactions
//               </Typography>
//               <ExpenseList
//                 expenses={recentTransactions}
//                 compact
//                 hideActions
//               />
//             </Paper>
//           </Grid>

//           {/* Full Expense List */}
//           <Grid item xs={12}>
//             <Paper sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>
//                 All Expenses
//               </Typography>
//               <ExpenseList
//                 expenses={expenses}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 page={page}
//                 totalPages={totalPages}
//                 onPageChange={setPage}
//               />
//             </Paper>
//           </Grid>
//         </Grid>
//       </Box>
//     </DashboardLayout>
//   );
// };

// export default Dashboard;


//code 3

import { useState, useEffect, useCallback } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    CircularProgress
} from '@mui/material';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import {
  Add as AddIcon,
  TrendingUp,
  AttachMoney,
  ShowChart
} from '@mui/icons-material';
import { BarChart } from '@mui/x-charts';
import DashboardLayout from '../components/Layout/DashboardLayout';
import ExpenseList from '../components/Expense/ExpenseList';
import { useNavigate } from 'react-router-dom';

const ExpenseChart = ({ data }) => {
    const theme = useTheme();
    const { mode } = useAppTheme();

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <Typography color="textSecondary">No expense data available</Typography>
      </Box>
    );
  }

  // Transform data for the chart
  const chartData = data.map(item => ({
    category: item.category,
    amount: Number(item.total)
  }));

  return (
    <Box sx={{ width: '100%', height: 300, p: 2 }}>
      <BarChart
        dataset={chartData}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'category',
          tickLabelStyle: {
            angle: 45,
            textAnchor: 'start',
            fontSize: 12,
            fill: theme.palette.text.primary // Theme-aware text color
          }
        }]}
        series={[
          { 
            dataKey: 'amount',
            label: 'Amount ($)',
            valueFormatter: (value) => `$${value.toFixed(2)}`,
            color: theme.palette.primary.main // Theme-aware bar color
          }
        ]}
        height={250}
        margin={{ 
          top: 20,
          right: 20,
          bottom: 50,
          left: 60
        }}
        sx={{
          // Theme-aware chart styles
          '.MuiChartsAxis-label': {
            fill: theme.palette.text.primary,
          },
          '.MuiChartsAxis-tick': {
            fill: theme.palette.text.secondary,
          },
          backgroundColor: theme.palette.background.paper
        }}
      />
    </Box>
  );
};

const Dashboard = () => {
    const theme = useTheme();
    const { mode } = useAppTheme();
    const navigate = useNavigate();
    //const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // First, fetch expenses
      const expensesResponse = await fetch('http://localhost:5000/api/expenses', {
        credentials: 'include'
      });
      
      if (!expensesResponse.ok) {
        throw new Error('Failed to fetch expenses');
      }
      
      const expensesData = await expensesResponse.json();
      console.log('Expenses data:', expensesData); // Debug log

      // Then fetch insights
      const insightsResponse = await fetch('http://localhost:5000/api/expenses/insights', {
        credentials: 'include'
      });
      
      if (!insightsResponse.ok) {
        throw new Error('Failed to fetch insights');
      }
      
      const insightsData = await insightsResponse.json();
      console.log('Insights data:', insightsData); // Debug log

      // Update state with fetched data
      setExpenses(expensesData.expenses || []);
      setTotalPages(expensesData.totalPages || 0);
      setChartData(insightsData || []);
      
      // Calculate total expense
      const total = insightsData.reduce((sum, item) => sum + Number(item.total), 0);
      setTotalExpense(total);
      
      // Set recent transactions
      setRecentTransactions(expensesData.expenses?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setExpenses([]);
      setChartData([]);
      setTotalExpense(0);
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleEdit = (expense) => {
    navigate(`/dashboard/edit/${expense._id}`, { state: { expense } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/expenses/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to delete expense');
        }

        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              ${value.toFixed(2)}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              p: 1,
              borderRadius: '50%',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">Dashboard</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/dashboard/add')}
              >
                Add Expense
              </Button>
            </Box>
          </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
        <StatCard
          title="Total Expenses"
          value={totalExpense}
          icon={<AttachMoney color="primary" />}
          color={theme.palette.primary.main}
        />
        </Grid>
        <Grid item xs={12} md={4}>
            <StatCard
            title="Monthly Average"
            value={totalExpense / 12}
            icon={<TrendingUp color="secondary" />}
            color={theme.palette.secondary.main}
            />
        </Grid>
        <Grid item xs={12} md={4}>
            <StatCard
            title="Daily Average"
            value={totalExpense / 30}
            icon={<ShowChart color="success" />}
            color={theme.palette.success.main}
            />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
            Expense Distribution
            </Typography>
            <ExpenseChart data={chartData} />
        </Paper>
        </Grid>


          {/* Recent Transactions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <ExpenseList
                expenses={recentTransactions}
                compact
                hideActions
              />
            </Paper>
          </Grid>

          {/* Full Expense List */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                All Expenses
              </Typography>
              <ExpenseList
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
