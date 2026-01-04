import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './ui/Icon';
import './Reports.css';

export const Reports: React.FC = () => {
  const { state, exportToCSV, resetDaily } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const todayRecords = state.attendance.filter(r => r.date === state.currentDate);
  const totalTurns = todayRecords.reduce((sum, r) => sum + r.turnsCount, 0);
  const presentCount = todayRecords.filter(r => r.status === 'Presente').length;
  const lateCount = todayRecords.filter(r => r.status === 'Llegó tarde').length;
  const absentCount = todayRecords.filter(r => r.status === 'No vino').length;

  const handleResetDaily = async () => {
    await resetDaily();
    setShowConfirmReset(false);
  };

  return (
    <div className="reports">
      <h2><Icon name="chart" className="title-icon" /> Reportes y Cierre Diario</h2>

      <div className="date-info">
        <p><Icon name="chart" className="inline-icon" /> Fecha: <strong>{state.currentDate}</strong></p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4><Icon name="chart" className="inline-icon" /> Turnos Totales</h4>
          <p className="stat-value">{totalTurns}</p>
        </div>
        <div className="stat-card">
          <h4><Icon name="people" className="inline-icon" /> Presente</h4>
          <p className="stat-value">{presentCount}</p>
        </div>
        <div className="stat-card">
          <h4><Icon name="clipboard" className="inline-icon" /> Llegó Tarde</h4>
          <p className="stat-value">{lateCount}</p>
        </div>
        <div className="stat-card">
          <h4><Icon name="clipboard" className="inline-icon" /> No Vino</h4>
          <p className="stat-value">{absentCount}</p>
        </div>
      </div>

      <div className="attendance-table">
        <h3><Icon name="clipboard" className="inline-icon" /> Registro de Asistencia</h3>
        {todayRecords.length === 0 ? (
          <p className="empty-message">No hay registros de asistencia para hoy</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Lista</th>
                  <th>Hora Entrada</th>
                  <th>Estado</th>
                  <th>Turnos</th>
                  <th>Hora Salida</th>
                </tr>
              </thead>
              <tbody>
                {todayRecords.map(record => (
                  <tr key={record.id} className={`status-${record.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    <td>{record.caddieName}</td>
                    <td>Lista {record.listNumber}</td>
                    <td>{record.callTime.split('T')[1].substring(0, 5)}</td>
                    <td>{record.status}</td>
                    <td>{record.turnsCount}</td>
                    <td>{record.endTime ? record.endTime.split('T')[1].substring(0, 5) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="export-section">
        <h3><Icon name="clipboard" className="inline-icon" /> Exportar Datos</h3>
        <button onClick={async () => await exportToCSV()} className="btn btn-large btn-export">
          <Icon name="clipboard" className="btn-icon" /> Descargar CSV
        </button>
        <p className="help-text">El archivo CSV incluye todos los registros de asistencia y turnos del día.</p>
      </div>

      <div className="reset-section">
        <h3><Icon name="arrow-left" className="inline-icon" /> Cierre Diario</h3>
        {showConfirmReset ? (
          <div className="confirm-dialog">
            <p>¿Está seguro de que desea cerrar el día actual?</p>
            <p className="warning-text">Esta acción limpiará los turnos activos y reiniciará las listas para un nuevo día.</p>
            <div className="button-group">
              <button onClick={handleResetDaily} className="btn btn-danger">
                ✓ Confirmar Cierre
              </button>
              <button onClick={() => setShowConfirmReset(false)} className="btn btn-secondary">
                ✕ Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowConfirmReset(true)} className="btn btn-large btn-warning">
            <Icon name="lock" className="btn-icon" /> Cerrar Día
          </button>
        )}
      </div>
    </div>
  );
};
