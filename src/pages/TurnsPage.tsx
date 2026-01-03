import React from 'react';
import { AppProvider } from '../context/AppContext';
import { CaddieTurns } from '../components/CaddieTurns';
import './TurnsPage.css';

export const TurnsPage: React.FC = () => {

  return (
    <AppProvider>
      <div className="turns-page-wrapper">
        <CaddieTurns />
      </div>
    </AppProvider>
  );
};
