import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './pages/RootLayout';
import { TurnsPage } from './pages/TurnsPage';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Navigation } from './components/Navigation';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ToastProvider';
import './App.css';

const App: React.FC = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route element={<RootLayout />}>
              {/* Navigation bar with user menu and admin access */}
              <Route path="/" element={<Navigation />} />

              {/* Main default page - Turns */}
              <Route index element={<TurnsPage />} />
              <Route path="/turns" element={<TurnsPage />} />

              {/* Login for admin */}
              <Route path="/login" element={<Login />} />

              {/* Dashboard pages - Admin access */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/caddies" element={<Dashboard />} />
              <Route path="/attendance" element={<Dashboard />} />
              <Route path="/messaging" element={<Dashboard />} />
              <Route path="/reports" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
};

export default App;
