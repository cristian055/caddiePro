import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from './ui/Icon';
import { SkeletonBlock } from './ui/Skeleton';
import type { ListNumber } from '../types';
import './CaddieTurns.css';

// Polling interval for real-time updates (2 seconds for fast updates across devices)
const POLLING_INTERVAL = 2000;

export const CaddieTurns: React.FC = () => {
  const { getListCaddies, isLoading, refreshData, state } = useApp();
  const isInitialMount = useRef(true);

  // Polling with actual data fetch
  useEffect(() => {
    // Initial data fetch on mount
    if (isInitialMount.current) {
      refreshData();
      isInitialMount.current = false;
    }

    // Set up polling interval to fetch fresh data
    const interval = setInterval(() => {
      refreshData();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [refreshData]);

  // Show loading skeleton while data is loading
  if (isLoading && state.caddies.length === 0) {
    return (
      <div className="caddie-turns-container">
        <div className="turns-header">
          <SkeletonBlock width={200} height={32} variant="light" />
          <SkeletonBlock width={280} height={20} variant="light" style={{ marginTop: 8 }} />
        </div>
        <div className="turns-grid">
          {[1, 2, 3].map(num => (
            <div key={num} className="list-turn-section">
              <SkeletonBlock width={120} height={28} variant="light" style={{ marginBottom: 16 }} />
              <SkeletonBlock width="100%" height={100} variant="light" />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
    <div className="caddie-turns-container">
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
