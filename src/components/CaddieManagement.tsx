import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from './ui/Icon';
import type { ListNumber } from '../types';
import { createCaddieSchema, validateForm } from '../utils/validation';
import './CaddieManagement.css';

export const CaddieManagement: React.FC = () => {
  const { state, addCaddie, editCaddie, deleteCaddie } = useApp();
  const [name, setName] = useState('');
  const [selectedList, setSelectedList] = useState<ListNumber>(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editList, setEditList] = useState<ListNumber>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const handleAddCaddie = async () => {
    const validation = validateForm(createCaddieSchema, {
      name,
      listNumber: selectedList,
      phoneNumber: '',
      status: 'Disponible',
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    await addCaddie(name.trim(), selectedList);
    setName('');
    setSelectedList(1);
  };

  const handleEditStart = (id: string, currentName: string, currentList: ListNumber) => {
    setEditingId(id);
    setEditName(currentName);
    setEditList(currentList);
    setEditErrors({});
  };

  const handleEditSave = async (id: string) => {
    const validation = validateForm(createCaddieSchema, {
      name: editName,
      listNumber: editList,
      phoneNumber: '',
      status: 'Disponible',
    });

    if (!validation.valid) {
      setEditErrors(validation.errors);
      return;
    }

    setEditErrors({});
    await editCaddie(id, editName.trim(), editList);
    setEditingId(null);
  };

  const caddiesByList = {
    1: state.caddies.filter(c => c.listNumber === 1),
    2: state.caddies.filter(c => c.listNumber === 2),
    3: state.caddies.filter(c => c.listNumber === 3),
  };

  return (
    <div className="caddie-management">
      <h2><Icon name="clipboard" className="title-icon" /> Gestión de Caddies</h2>

      <div className="add-caddie-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del caddie"
          className={`input-field ${errors.name ? 'input-field--error' : ''}`}
          onKeyPress={(e) => e.key === 'Enter' && handleAddCaddie()}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="form-error">{errors.name}</span>
        )}
        <select
          value={selectedList}
          onChange={(e) => setSelectedList(Number(e.target.value) as ListNumber)}
          className="select-field"
        >
          <option value={1}>Lista 1</option>
          <option value={2}>Lista 2</option>
          <option value={3}>Lista 3</option>
        </select>
        <button onClick={handleAddCaddie} className="btn btn-primary">
          <Icon name="list" className="btn-icon" /> Agregar
        </button>
      </div>

      <div className="caddies-by-list">
        {[1, 2, 3].map(list => (
          <div key={list} className="list-section">
            <h3>Lista {list} ({caddiesByList[list as ListNumber].length})</h3>
            <div className="caddies-list">
              {caddiesByList[list as ListNumber].length === 0 ? (
                <p className="empty-message">Sin caddies</p>
              ) : (
                caddiesByList[list as ListNumber].map(caddie => (
                  <div key={caddie.id} className="caddie-item">
                    {editingId === caddie.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`input-field ${editErrors.name ? 'input-field--error' : ''}`}
                          aria-invalid={!!editErrors.name}
                        />
                        {editErrors.name && (
                          <span className="form-error">{editErrors.name}</span>
                        )}
                        <select
                          value={editList}
                          onChange={(e) => setEditList(Number(e.target.value) as ListNumber)}
                          className="select-field"
                        >
                          <option value={1}>Lista 1</option>
                          <option value={2}>Lista 2</option>
                          <option value={3}>Lista 3</option>
                        </select>
                        <button
                          onClick={() => handleEditSave(caddie.id)}
                          className="btn btn-sm btn-success"
                        >
                          ✓ Guardar
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-sm btn-secondary"
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="caddie-info">
                        <span className="caddie-name">{caddie.name}</span>
                        <span className={`status-badge status-${caddie.status.replace(/\s+/g, '-').toLowerCase()}`}>
                          {caddie.status}
                        </span>
                        <button
                          onClick={() => handleEditStart(caddie.id, caddie.name, caddie.listNumber as ListNumber)}
                          className="btn btn-sm btn-edit"
                        >
                          ✎ Editar
                        </button>
                        <button
                          onClick={async () => await deleteCaddie(caddie.id)}
                          className="btn btn-sm btn-danger"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
