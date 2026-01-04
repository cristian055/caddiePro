import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './ui/Icon';
import type { ListNumber, AttendanceStatus } from '../types';
import './AttendanceCall.css';

export const AttendanceCall: React.FC = () => {
  const { state, updateAttendance } = useApp();
  const [selectedList, setSelectedList] = useState<ListNumber>(1);
  const [checkedCaddies, setCheckedCaddies] = useState<Record<string, AttendanceStatus>>({});

  const currentListSettings = state.listSettings.find(s => s.listNumber === selectedList);
  const listCaddies = state.caddies.filter(c => c.listNumber === selectedList);

  const handleMarkAttendance = async (caddieId: string, status: AttendanceStatus) => {
    setCheckedCaddies(prev => ({
      ...prev,
      [caddieId]: status,
    }));
    await updateAttendance(caddieId, status);
  };

  return (
    <div className="attendance-call">
      <h2><Icon name="phone" className="title-icon" /> Llamado a Lista</h2>

      <div className="list-selector">
        <label>Seleccionar Lista:</label>
        <select
          value={selectedList}
          onChange={(e) => setSelectedList(Number(e.target.value) as ListNumber)}
          className="select-field"
        >
          <option value={1}>Lista 1</option>
          <option value={2}>Lista 2</option>
          <option value={3}>Lista 3</option>
        </select>
      </div>

      <div className="time-display">
        <p>Hora de llamado Lista {selectedList}: <strong>{currentListSettings?.callTime}</strong></p>
      </div>

      <div className="attendance-list">
        <h3>Marcar Asistencia</h3>
        {listCaddies.length === 0 ? (
          <p className="empty-message">No hay caddies en esta lista</p>
        ) : (
          <div className="caddies-check">
            {listCaddies.map(caddie => (
              <div key={caddie.id} className="attendance-item">
                <span className="caddie-name">{caddie.name}</span>
                <div className="attendance-buttons">
                  <button
                    onClick={() => handleMarkAttendance(caddie.id, 'Presente')}
                    className={`btn btn-sm ${checkedCaddies[caddie.id] === 'Presente' ? 'active' : ''}`}
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    ✓ Presente
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(caddie.id, 'Llegó tarde')}
                    className={`btn btn-sm ${checkedCaddies[caddie.id] === 'Llegó tarde' ? 'active' : ''}`}
                    style={{ backgroundColor: '#FF9800' }}
                  >
                    🚨 Tarde
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(caddie.id, 'No vino')}
                    className={`btn btn-sm ${checkedCaddies[caddie.id] === 'No vino' ? 'active' : ''}`}
                    style={{ backgroundColor: '#F44336' }}
                  >
                    ✕ No vino
                  </button>
                  <button
                    onClick={() => handleMarkAttendance(caddie.id, 'Permiso')}
                    className={`btn btn-sm ${checkedCaddies[caddie.id] === 'Permiso' ? 'active' : ''}`}
                    style={{ backgroundColor: '#2196F3' }}
                  >
                    📝 Permiso
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
