import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Navbar from './components/Navbar';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import ApplyLeave from './components/ApplyLeave';
import MyLeaveHistory from './components/MyLeaveHistory';
import TeamLeaves from './components/TeamLeaves';
import LeaveBalance from './components/LeaveBalance';
import LeaveTypesAdmin from './components/LeaveTypesAdmin';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch(user.role) {
    case 'employee':
      return <EmployeeDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  
  return (
    <>
      {user && location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardRouter />
          </PrivateRoute>
        } />
        <Route path="/apply-leave" element={
          <PrivateRoute allowedRoles={['employee']}>
            <ApplyLeave />
          </PrivateRoute>
        } />
        <Route path="/my-leaves" element={
          <PrivateRoute allowedRoles={['employee']}>
            <MyLeaveHistory />
          </PrivateRoute>
        } />
        <Route path="/team-leaves" element={
          <PrivateRoute allowedRoles={['manager', 'admin']}>
            <TeamLeaves />
          </PrivateRoute>
        } />
        <Route path="/my-balance" element={
          <PrivateRoute>
            <LeaveBalance />
          </PrivateRoute>
        } />
        <Route path="/leave-types" element={
          <PrivateRoute allowedRoles={['admin']}>
            <LeaveTypesAdmin />
          </PrivateRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;