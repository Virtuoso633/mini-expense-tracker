// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import AddExpense from './pages/AddExpense';
// import Analytics from './pages/Analytics';
// import PrivateRoute from './components/PrivateRoute';

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route
//         path="/dashboard"
//         element={
//           <PrivateRoute>
//             <Dashboard />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/dashboard/add"
//         element={
//           <PrivateRoute>
//             <AddExpense />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/dashboard/analytics"
//         element={
//           <PrivateRoute>
//             <Analytics />
//           </PrivateRoute>
//         }
//       />
//       <Route path="/" element={<Navigate to="/dashboard" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/dashboard/add" element={<PrivateRoute><AddExpense /></PrivateRoute>} />
      <Route path="/dashboard/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
