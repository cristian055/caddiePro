import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './ui/Icon';
import type { ListNumber, ListOrder } from '../types';
import './ListManagement.css';

interface ListConfig {
  isConfiguring: boolean;
  selectedOrder: ListOrder;
  rangeStart: string;
  rangeEnd: string;
}

export const ListManagement: React.FC = () => {
  const { state, getListCaddies, markSalioACargar, markRetorno, setListOrder, setListRange } = useApp();

  const [configs, setConfigs] = useState<Record<number, ListConfig>>({
    1: { isConfiguring: false, selectedOrder: 'ascendente', rangeStart: '', rangeEnd: '' },
    2: { isConfiguring: false, selectedOrder: 'ascendente', rangeStart: '', rangeEnd: '' },
    3: { isConfiguring: false, selectedOrder: 'ascendente', rangeStart: '', rangeEnd: '' },
  });

  const toggleConfiguring = (listNumber: ListNumber) => {
    setConfigs(prev => ({
      ...prev,
      [listNumber]: { ...prev[listNumber], isConfiguring: !prev[listNumber].isConfiguring },
    }));
  };

  const setSelectedOrder = (listNumber: ListNumber, order: ListOrder) => {
    setConfigs(prev => ({
      ...prev,
      [listNumber]: { ...prev[listNumber], selectedOrder: order },
    }));
  };

  const setRangeStart = (listNumber: ListNumber, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [listNumber]: { ...prev[listNumber], rangeStart: value },
    }));
  };

  const setRangeEnd = (listNumber: ListNumber, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [listNumber]: { ...prev[listNumber], rangeEnd: value },
    }));
  };

  const handleSaveConfig = (listNumber: ListNumber) => {
    const config = configs[listNumber];
    setListOrder(listNumber, config.selectedOrder);
    const start = config.rangeStart ? parseInt(config.rangeStart, 10) : undefined;
    const end = config.rangeEnd ? parseInt(config.rangeEnd, 10) : undefined;
    setListRange(listNumber, start, end);
    setConfigs(prev => ({
      ...prev,
      [listNumber]: { ...prev[listNumber], isConfiguring: false },
    }));
  };

  const handleClearRange = (listNumber: ListNumber) => {
    setConfigs(prev => ({
      ...prev,
      [listNumber]: { ...prev[listNumber], rangeStart: '', rangeEnd: '' },
    }));
    setListRange(listNumber);
  };

  const renderList = (listNumber: ListNumber) => {
    const caddies = getListCaddies(listNumber);
    const listSettings = state.listSettings.find(s => s.listNumber === listNumber);
    const totalCaddies = state.caddies.filter(c => c.list === listNumber && c.status !== 'Ausente').length;
    const config = configs[listNumber];
    const displayRangeStart = listSettings?.rangeStart?.toString() || '';
    const displayRangeEnd = listSettings?.rangeEnd?.toString() || '';

    return (
      <div key={listNumber} className="list-container">
        <div className="list-header-row">
          <h3><Icon name="golf" className="inline-icon" /> Lista {listNumber}</h3>
          <button
            onClick={() => toggleConfiguring(listNumber)}
            className="btn btn-sm btn-config"
          >
            <Icon name="settings" className="btn-icon" />
            {config.isConfiguring ? 'Cerrar' : 'Configurar'}
          </button>
        </div>

        {config.isConfiguring && (
          <div className="list-config">
            <div className="config-section">
              <h4><Icon name="settings" className="inline-icon" /> Orden de la Lista</h4>
              <div className="config-controls">
                <select
                  value={config.selectedOrder}
                  onChange={(e) => setSelectedOrder(listNumber, e.target.value as ListOrder)}
                  className="select-field"
                >
                  <option value="ascendente">Primeros a últimos</option>
                  <option value="descendente">Últimos a primeros</option>
                </select>
              </div>
            </div>

            <div className="config-section">
              <h4><Icon name="list" className="inline-icon" /> Rango de Caddies</h4>
              <div className="config-controls range-inputs">
                <span className="range-label">Del número:</span>
                <input
                  type="number"
                  min="1"
                  max={totalCaddies}
                  value={config.rangeStart}
                  onChange={(e) => setRangeStart(listNumber, e.target.value)}
                  className="input-field input-sm"
                  placeholder="Inicio"
                />
                <span className="range-label">al número:</span>
                <input
                  type="number"
                  min="1"
                  max={totalCaddies}
                  value={config.rangeEnd}
                  onChange={(e) => setRangeEnd(listNumber, e.target.value)}
                  className="input-field input-sm"
                  placeholder="Fin"
                />
                {(config.rangeStart || config.rangeEnd) && (
                  <button onClick={() => handleClearRange(listNumber)} className="btn btn-sm btn-secondary">
                    Limpiar rango
                  </button>
                )}
              </div>
              <p className="config-hint">
                Total caddies en lista: {totalCaddies} | Actualmente mostrados: {caddies.length}
              </p>
            </div>

            <div className="config-actions">
              <button onClick={() => handleSaveConfig(listNumber)} className="btn btn-primary">
                <Icon name="settings" className="btn-icon" /> Guardar Configuración
              </button>
            </div>
          </div>
        )}

        <div className="caddies-queue">
          {caddies.length === 0 ? (
            <p className="empty-message">
              {displayRangeStart || displayRangeEnd
                ? 'No hay caddies en el rango seleccionado'
                : 'No hay caddies disponibles'}
            </p>
          ) : (
            caddies.map((caddie, index) => (
              <div key={caddie.id} className={`queue-item position-${index + 1}`}>
                <div className="position-badge">{index + 1}</div>
                <div className="caddie-details">
                  <h4>{caddie.name}</h4>
                  <span className={`status-badge status-${caddie.status.replace(/\s+/g, '-').toLowerCase()}`}>
                    {caddie.status}
                  </span>
                </div>
                <div className="actions">
                      {caddie.status === 'Disponible' && index === 0 && (
                    <button
                      onClick={() => markSalioACargar(caddie.id)}
                      className="btn btn-large btn-success"
                    >
                      <Icon name="clipboard" className="btn-icon" /> Salió a Cargar
                    </button>
                  )}
                  {caddie.status === 'En campo' && (
                    <button
                      onClick={() => markRetorno(caddie.id)}
                      className="btn btn-large btn-warning"
                    >
                      <Icon name="arrow-left" className="btn-icon" /> Retorno
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="list-management">
      <h2><Icon name="chart" className="title-icon" /> Gestión de Listas y Turnos</h2>
      <div className="lists-grid">
        {renderList(1)}
        {renderList(2)}
        {renderList(3)}
      </div>
    </div>
  );
};
