import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import { CaddieTurns } from '../components/CaddieTurns';
import './TurnsPage.css';

export const TurnsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <div className="turns-page-wrapper">
        <CaddieTurns />
      </div>
    </AppProvider>
  );
};
