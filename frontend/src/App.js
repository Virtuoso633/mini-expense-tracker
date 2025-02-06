// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import CssBaseline from '@mui/material/CssBaseline';
// import { AuthProvider } from './contexts/AuthContext';
// import { ThemeProvider } from './contexts/ThemeContext';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import PrivateRoute from './components/PrivateRoute';
// import AddExpense from './pages/AddExpense';
// import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <Router>
//       <ThemeProvider>
//         <CssBaseline />
//         <AuthProvider>
//           <Routes>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route
//               path="/dashboard"
//               element={
//                 <PrivateRoute>
//                   <Dashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route path="/" element={<Navigate to="/login" />} />
//           </Routes>
//         </AuthProvider>
//       </ThemeProvider>
//     </Router>
//   );
// }

// export default App;


// code2
//import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';

function App() {
  return (
    //<BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    //</BrowserRouter>
  );
}

export default App;
