// import {
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     IconButton,
//     TablePagination,
//     Typography,
//     Box
//   } from '@mui/material';
//   import {
//     Edit as EditIcon,
//     Delete as DeleteIcon
//   } from '@mui/icons-material';
//   import { format } from 'date-fns';
  
//   const ExpenseList = ({
//     expenses,
//     onEdit,
//     onDelete,
//     page,
//     totalPages,
//     onPageChange
//   }) => {
//     const handlePageChange = (event, newPage) => {
//       onPageChange(newPage);
//     };
  
//     if (!expenses.length) {
//       return (
//         <Box sx={{ textAlign: 'center', py: 3 }}>
//           <Typography variant="h6" color="textSecondary">
//             No expenses found
//           </Typography>
//         </Box>
//       );
//     }
  
//     return (
//       <Paper elevation={3}>
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Date</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell align="right">Amount</TableCell>
//                 <TableCell align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {expenses.map((expense) => (
//                 <TableRow key={expense._id}>
//                   <TableCell>
//                     {format(new Date(expense.date), 'MMM dd, yyyy')}
//                   </TableCell>
//                   <TableCell>{expense.category}</TableCell>
//                   <TableCell>{expense.description}</TableCell>
//                   <TableCell align="right">
//                     ${expense.amount.toFixed(2)}
//                   </TableCell>
//                   <TableCell align="center">
//                     <IconButton
//                       size="small"
//                       onClick={() => onEdit(expense)}
//                       color="primary"
//                     >
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton
//                       size="small"
//                       onClick={() => onDelete(expense._id)}
//                       color="error"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           component="div"
//           count={totalPages * 10}
//           page={page}
//           onPageChange={handlePageChange}
//           rowsPerPage={10}
//           rowsPerPageOptions={[10]}
//         />
//       </Paper>
//     );
//   };
  
//   export default ExpenseList;
  


// src/components/Expense/ExpenseList.js
// src/components/Expense/ExpenseList.js
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Box,
    Chip,
    Paper
  } from '@mui/material';
  import {
    Edit as EditIcon,
    Delete as DeleteIcon
  } from '@mui/icons-material';
  import { format } from 'date-fns';
  
  const ExpenseList = ({
    expenses = [], // Provide default empty array
    onEdit,
    onDelete,
    compact = false,
    hideActions = false,
    page,
    totalPages,
    onPageChange
  }) => {
    // Check if expenses is undefined, null, or empty
    if (!expenses || expenses.length === 0) {
      return (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body1" color="textSecondary">
              No expenses found
            </Typography>
          </Box>
        </Paper>
      );
    }
  
    return (
      <TableContainer component={Paper}>
        <Table size={compact ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              {!compact && <TableCell>Description</TableCell>}
              <TableCell align="right">Amount</TableCell>
              {!hideActions && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense._id || Math.random()}>
                <TableCell>
                  {expense.date ? format(new Date(expense.date), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={expense.category || 'Uncategorized'}
                    size={compact ? "small" : "medium"}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                {!compact && <TableCell>{expense.description || '-'}</TableCell>}
                <TableCell align="right">
                  ${(expense.amount || 0).toFixed(2)}
                </TableCell>
                {!hideActions && (
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => onEdit && onEdit(expense)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDelete && onDelete(expense._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default ExpenseList;
  