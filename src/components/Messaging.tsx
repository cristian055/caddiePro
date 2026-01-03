import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { ListNumber } from '../types';
import './Messaging.css';

export const Messaging: React.FC = () => {
  const { getListCaddies } = useApp();
  const [selectedList, setSelectedList] = useState<ListNumber>(1);
  const [messageTemplate, setMessageTemplate] = useState('');

  const caddies = getListCaddies(selectedList);
  const nextCaddie = caddies[0];

  const generateMessage = () => {
    if (!nextCaddie) {
      return '⛳ *Turno Actual* - No hay caddies disponibles en esta lista';
    }
    return `⛳ *Turno Actual Lista ${selectedList}*: Va el caddie ${nextCaddie.name} 👍`;
  };

  const handleSendWhatsApp = () => {
    const message = messageTemplate || generateMessage();
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="messaging">
      <h2>💬 Comunicación WhatsApp</h2>

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

      {nextCaddie ? (
        <div className="message-section">
          <h3>⛳ Próximo Caddie en Lista {selectedList}</h3>
          <div className="caddie-highlight">
            <h2>{nextCaddie.name}</h2>
            <span className="list-badge">Lista {selectedList}</span>
          </div>

          <div className="message-preview">
            <h4>📝 Previsualización del Mensaje:</h4>
            <textarea
              value={messageTemplate || generateMessage()}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="message-textarea"
              placeholder="Edita el mensaje aquí si lo deseas..."
            />
          </div>

          <button onClick={handleSendWhatsApp} className="btn btn-large btn-whatsapp">
            📲 Enviar por WhatsApp
          </button>
        </div>
      ) : (
        <div className="empty-message">
          <p>No hay caddies disponibles en esta lista</p>
        </div>
      )}

      <div className="quick-templates">
        <h4>🎯 Plantillas Rápidas</h4>
        <div className="template-buttons">
          <button
            onClick={() => setMessageTemplate(`⛳ *Turno Actual Lista ${selectedList}*: Va el caddie ${nextCaddie?.name || 'Próximo'} 👍`)}
            className="btn btn-template"
          >
            Turno Simple
          </button>
          <button
            onClick={() => setMessageTemplate(`⛳ *RECORDATORIO* - Lista ${selectedList}: Próximo caddie es ${nextCaddie?.name || 'Próximo'}\n\nPor favor, prepararse para salir a cargar. ⏰`)}
            className="btn btn-template"
          >
            Recordatorio
          </button>
          <button
            onClick={() => setMessageTemplate(`📊 *Resumen de Turnos* - Lista ${selectedList}\n⏰ ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}\n\nProximos caddies preparados. ✅`)}
            className="btn btn-template"
          >
            Resumen
          </button>
        </div>
      </div>
    </div>
  );
};
