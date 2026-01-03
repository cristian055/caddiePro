import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './pages/RootLayout';
import { Dashboard } from './pages/Dashboard';
import { TurnsPage } from './pages/TurnsPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/caddies" element={<Dashboard />} />
          <Route path="/attendance" element={<Dashboard />} />
          <Route path="/messaging" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/turns" element={<TurnsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
