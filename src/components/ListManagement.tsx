import React from 'react';
import { useApp } from '../context/AppContext';
import type { ListNumber } from '../types';
import './ListManagement.css';

export const ListManagement: React.FC = () => {
  const { getListCaddies, markSalioACargar, markRetorno } = useApp();

  const renderList = (listNumber: ListNumber) => {
    const caddies = getListCaddies(listNumber);

    return (
      <div key={listNumber} className="list-container">
        <h3>⛳ Lista {listNumber}</h3>
        <div className="caddies-queue">
          {caddies.length === 0 ? (
            <p className="empty-message">No hay caddies disponibles</p>
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
                      ✅ Salió a Cargar
                    </button>
                  )}
                  {caddie.status === 'En campo' && (
                    <button
                      onClick={() => markRetorno(caddie.id)}
                      className="btn btn-large btn-warning"
                    >
                      🔄 Retorno
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
      <h2>📊 Gestión de Listas y Turnos</h2>
      <div className="lists-grid">
        {renderList(1)}
        {renderList(2)}
        {renderList(3)}
      </div>
    </div>
  );
};
