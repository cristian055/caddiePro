import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CaddieManagement } from '../components/CaddieManagement';
import { ListManagement } from '../components/ListManagement';
import { AttendanceCall } from '../components/AttendanceCall';
import { Messaging } from '../components/Messaging';
import { Reports } from '../components/Reports';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import '../App.css';

type Page = 'caddies' | 'lists' | 'attendance' | 'messaging' | 'reports';

const DashboardContent: React.FC<{ currentPage: Page }> = ({ currentPage }) => {
  return (
    <>
      {currentPage === 'caddies' && <CaddieManagement />}
      {currentPage === 'lists' && <ListManagement />}
      {currentPage === 'attendance' && <AttendanceCall />}
      {currentPage === 'messaging' && <Messaging />}
      {currentPage === 'reports' && <Reports />}
    </>
  );
};

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map pathname to page type
  const getPageFromPath = (path: string): Page => {
    switch (path) {
      case '/caddies':
        return 'caddies';
      case '/attendance':
        return 'attendance';
      case '/messaging':
        return 'messaging';
      case '/reports':
        return 'reports';
      default:
        return 'lists';
    }
  };

  const currentPage = getPageFromPath(location.pathname);

  const pageTitles: Record<Page, string> = {
    caddies: 'Gestión de Caddies',
    lists: 'Configuración de Listas',
    attendance: 'Control de Asistencia',
    messaging: 'Mensajes',
    reports: 'Reportes',
  };

  return (
    <div className="dashboard-page">
      {/* Back button to return to main page */}
      <div className="dashboard__header">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="dashboard__back-btn"
          aria-label="Volver a Turnos"
        >
          <Icon name="arrow-left" size={20} />
          <span>Volver a Turnos</span>
        </Button>
        <h1 className="dashboard__title">{pageTitles[currentPage]}</h1>
      </div>

      <DashboardContent currentPage={currentPage} />
    </div>
  );
};
