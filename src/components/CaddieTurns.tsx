import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './ui/Icon';
import type { ListNumber } from '../types';
import './CaddieTurns.css';

export const CaddieTurns: React.FC = () => {
  const { getListCaddies } = useApp();
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderListTurns = (listNumber: ListNumber) => {
    const caddies = getListCaddies(listNumber);

    if (caddies.length === 0) {
      return (
        <div key={listNumber} className="list-turn-section empty">
          <h2><Icon name="golf" className="inline-icon" /> Lista {listNumber}</h2>
          <p className="empty-message">No hay caddies en esta lista</p>
        </div>
      );
    }

    // Find current caddie (En campo)
    const currentCaddie = caddies.find(c => c.status === 'En campo');
    // Get next caddies in queue (Disponible)
    const queueCaddies = caddies.filter(c => c.status === 'Disponible').slice(0, 3);

    return (
      <div key={listNumber} className="list-turn-section">
        <div className="list-header">
          <h2><Icon name="golf" className="inline-icon" /> Lista {listNumber}</h2>
        </div>

        {/* Current Turn Section */}
        <div className="current-turn-wrapper">
          {currentCaddie ? (
            <div className="current-turn">
              <div className="current-label">EN TURNO</div>
              <div className="current-caddie-badge">
                <div className="caddie-name">{currentCaddie.name}</div>
                <div className="caddie-status">En campo</div>
              </div>
            </div>
          ) : (
            <div className="current-turn empty-turn">
              <div className="current-label">EN TURNO</div>
              <div className="current-caddie-badge empty">
                <div className="caddie-name">--</div>
                <div className="caddie-status">Sin turno activo</div>
              </div>
            </div>
          )}
        </div>

        {/* Queue Section */}
        {queueCaddies.length > 0 && (
          <div className="queue-section">
            <div className="queue-label">PRÓXIMOS EN COLA</div>
            <div className="queue-list">
              {queueCaddies.map((caddie, index) => (
                <div key={caddie.id} className="queue-item">
                  <div className="position-badge">{index + 1}</div>
                  <div className="queue-caddie-info">
                    <span className="queue-caddie-name">{caddie.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="caddie-turns-container" key={refreshKey}>
      <div className="turns-header">
        <h1><Icon name="clipboard" className="title-icon" size={22} /> Turnos Actuales</h1>
        <p className="subtitle">Estado en tiempo real de los caddies</p>
      </div>

      <div className="turns-grid">
        {renderListTurns(1)}
        {renderListTurns(2)}
        {renderListTurns(3)}
      </div>

      <div className="refresh-indicator">
        <span className="dot"></span> Actualizándose automáticamente
      </div>
    </div>
  );
};
