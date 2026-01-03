import React from 'react';
import { useLocation } from 'react-router-dom';
import { CaddieManagement } from '../components/CaddieManagement';
import { ListManagement } from '../components/ListManagement';
import { AttendanceCall } from '../components/AttendanceCall';
import { Messaging } from '../components/Messaging';
import { Reports } from '../components/Reports';
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

  return <DashboardContent currentPage={currentPage} />;
};
