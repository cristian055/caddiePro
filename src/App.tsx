import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { CaddieManagement } from './components/CaddieManagement';
import { ListManagement } from './components/ListManagement';
import { AttendanceCall } from './components/AttendanceCall';
import { Messaging } from './components/Messaging';
import { Reports } from './components/Reports';
import './App.css';

type Page = 'caddies' | 'lists' | 'attendance' | 'messaging' | 'reports';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('lists');

  return (
    <AppProvider>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <h1>⛳ CaddiePro MVP</h1>
            <p className="tagline">Sistema de Gestión de Turnos de Caddies</p>
          </div>
        </header>

        <nav className="main-nav">
          <button
            className={`nav-button ${currentPage === 'lists' ? 'active' : ''}`}
            onClick={() => setCurrentPage('lists')}
          >
            📊 Listas
          </button>
          <button
            className={`nav-button ${currentPage === 'caddies' ? 'active' : ''}`}
            onClick={() => setCurrentPage('caddies')}
          >
            👥 Caddies
          </button>
          <button
            className={`nav-button ${currentPage === 'attendance' ? 'active' : ''}`}
            onClick={() => setCurrentPage('attendance')}
          >
            📞 Llamado
          </button>
          <button
            className={`nav-button ${currentPage === 'messaging' ? 'active' : ''}`}
            onClick={() => setCurrentPage('messaging')}
          >
            💬 Mensajes
          </button>
          <button
            className={`nav-button ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reports')}
          >
            📈 Reportes
          </button>
        </nav>

        <main className="main-content">
          {currentPage === 'caddies' && <CaddieManagement />}
          {currentPage === 'lists' && <ListManagement />}
          {currentPage === 'attendance' && <AttendanceCall />}
          {currentPage === 'messaging' && <Messaging />}
          {currentPage === 'reports' && <Reports />}
        </main>

        <footer className="app-footer">
          <p>© 2025 CaddiePro - Sistema desarrollado por Berracode</p>
        </footer>
      </div>
    </AppProvider>
  );
};

export default App;
