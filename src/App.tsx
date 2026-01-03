import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { RootLayout } from './pages/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { TurnsPage } from './pages/TurnsPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            {/* Admin routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/caddies"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messaging"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Caddie route */}
            <Route
              path="/turns"
              element={
                <ProtectedRoute requiredRole="caddie">
                  <TurnsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
