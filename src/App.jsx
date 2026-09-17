import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { LMSProvider } from './context/LMSContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import CoursesList from './pages/courses/CoursesList';
import StudentsList from './pages/students/StudentsList';

const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function App() {
  return (
    <AuthProvider>
      <LMSProvider>
        <Router>
          <Routes>
            {/* Default Root */}
            <Route path="/" element={<HomeRedirect />} />

            {/* Module 1 Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<CoursesList />} />
              <Route path="/students" element={<StudentsList />} />
            </Route>

            {/* Catch-All Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>

        {/* Global Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </LMSProvider>
    </AuthProvider>
  );
}

export default App;
