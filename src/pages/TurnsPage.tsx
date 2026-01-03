import React from 'react';
import { CaddieTurns } from '../components/CaddieTurns';
import './TurnsPage.css';

export const TurnsPage: React.FC = () => {
  return (
    <div className="turns-page-wrapper">
      <CaddieTurns />
    </div>
  );
};
