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
import EnrollmentsList from './pages/enrollments/EnrollmentsList';
import InstructorsList from './pages/instructors/InstructorsList';
import StudentPortal from './pages/students/StudentPortal';
import LearningProgress from './pages/progress/LearningProgress';

const HomeRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'Student') return <Navigate to="/student-portal" replace />;
  return <Navigate to="/dashboard" replace />;
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
              <Route path="/student-portal" element={<StudentPortal />} />
              <Route path="/progress" element={<LearningProgress />} />
              <Route path="/enrollments" element={<EnrollmentsList />} />
              <Route path="/instructors" element={<InstructorsList />} />
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
