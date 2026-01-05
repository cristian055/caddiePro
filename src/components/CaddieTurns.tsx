import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { wsService } from '../services/websocket';
import { useCaddieUpdates } from '../hooks/useCaddieUpdates';
import type { CaddieUpdate, CaddieAddedData, CaddieDeletedData } from '../services/websocket';
import { Icon } from './ui/Icon';
import { SkeletonBlock } from './ui/Skeleton';
import type { ListNumber, Caddie, CaddieStatus } from '../types';
import './CaddieTurns.css';

export const CaddieTurns: React.FC = () => {
  const { getListCaddies, isLoading, updateCaddieLocal, addCaddieLocal, deleteCaddieLocal } = useApp();
  const [isConnected, setIsConnected] = useState(false);

  // Conectar WebSocket al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('caddiePro_token');
    if (token) {
      console.log('[CaddieTurns] Conectando WebSocket...');
      wsService.connect(token);
    }

    // Cleanup al desmontar
    return () => {
      console.log('[CaddieTurns] Desconectando WebSocket...');
      wsService.disconnect();
    };
  }, []);

  // Escuchar cambios de estado de conexión
  useEffect(() => {
    const cleanup = wsService.onConnectionChange((connected) => {
      console.log('[CaddieTurns] Estado de conexión:', connected);
      setIsConnected(connected);
    });

    return cleanup;
  }, []);

  // Handler para cambios de estado de caddie
  const handleStatusChanged = useCallback((update: CaddieUpdate) => {
    console.log('[WS] Status changed recibido:', update);
    
    if (!update.caddieId) {
      console.warn('[WS] Update sin caddieId:', update);
      return;
    }

    updateCaddieLocal(update.caddieId, {
      status: update.status as CaddieStatus,
      name: update.name,
      listNumber: update.listNumber,
    });
  }, [updateCaddieLocal]);

  // Handler para caddie agregado
  const handleCaddieAdded = useCallback((data: CaddieAddedData) => {
    console.log('[WS] Caddie agregado:', data);
    
    if (!data.caddieId) {
      console.warn('[WS] Added sin caddieId:', data);
      return;
    }

    const newCaddie: Caddie = {
      id: data.caddieId,
      name: data.name,
      listNumber: data.listNumber,
      status: data.status as CaddieStatus,
      phoneNumber: data.phoneNumber,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
    
    addCaddieLocal(newCaddie);
  }, [addCaddieLocal]);

  // Handler para caddie actualizado (nombre, lista, etc.)
  const handleCaddieUpdated = useCallback((update: CaddieUpdate) => {
    console.log('[WS] Caddie actualizado:', update);
    
    if (!update.caddieId) {
      console.warn('[WS] Updated sin caddieId:', update);
      return;
    }

    updateCaddieLocal(update.caddieId, {
      status: update.status as CaddieStatus,
      name: update.name,
      listNumber: update.listNumber,
    });
  }, [updateCaddieLocal]);

  // Handler para caddie eliminado
  const handleCaddieDeleted = useCallback((data: CaddieDeletedData) => {
    console.log('[WS] Caddie eliminado:', data);
    
    if (!data.caddieId) {
      console.warn('[WS] Deleted sin caddieId:', data);
      return;
    }

    deleteCaddieLocal(data.caddieId);
  }, [deleteCaddieLocal]);

  // Suscribirse a actualizaciones de WebSocket
  useCaddieUpdates({
    onStatusChanged: handleStatusChanged,
    onCaddieAdded: handleCaddieAdded,
    onCaddieUpdated: handleCaddieUpdated,
    onCaddieDeleted: handleCaddieDeleted,
  });

  // Renderizar indicador de estado de conexión
  const renderConnectionStatus = () => (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span className="status-dot"></span>
      {isConnected ? 'Conectado en tiempo real' : 'Reconectando...'}
    </div>
  );

  // Mostrar skeleton mientras se cargan los datos
  if (isLoading) {
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

  // Renderizar sección de turnos para una lista específica
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

    // Encontrar el caddie actual (En campo)
    // Usamos reverse() para encontrar el más reciente con status 'En campo'
    const currentCaddie = [...caddies].reverse().find(c => c.status === 'En campo');
    
    // Obtener los próximos en cola (Disponible)
    const queueCaddies = caddies.filter(c => c.status === 'Disponible').slice(0, 3);

    return (
      <div key={listNumber} className="list-turn-section">
        <div className="list-header">
          <h2><Icon name="golf" className="inline-icon" /> Lista {listNumber}</h2>
        </div>

        {/* Sección de turno actual */}
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

        {/* Sección de cola */}
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
        {renderConnectionStatus()}
      </div>

      <div className="turns-grid">
        {renderListTurns(1)}
        {renderListTurns(2)}
        {renderListTurns(3)}
      </div>
    </div>
  );
};
