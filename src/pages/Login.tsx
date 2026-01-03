import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../context/AuthContext';
import './Login.css';

export const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    setError('');
    setIsLoading(true);
    setSelectedRole(role);

    // Simulate a small delay for better UX
    setTimeout(() => {
      login(name, role);
      // Redirect based on role
      if (role === 'caddie') {
        navigate('/turns');
      } else {
        navigate('/');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>⛳ CaddiePro</h1>
          <p className="subtitle">Sistema de Gestión de Turnos de Caddies</p>
        </div>

        <div className="login-content">
          <div className="form-group">
            <label htmlFor="name">¿Cuál es tu nombre?</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  handleLogin('caddie');
                }
              }}
              placeholder="Ingresa tu nombre"
              className="name-input"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="role-selection">
            <p className="role-label">Selecciona tu rol:</p>
            <div className="role-buttons">
              <button
                onClick={() => handleLogin('caddie')}
                disabled={!name.trim() || isLoading}
                className={`role-button caddie-button ${
                  selectedRole === 'caddie' && isLoading ? 'loading' : ''
                }`}
              >
                <span className="role-icon">👨‍💼</span>
                <span className="role-text">Caddie</span>
              </button>
              <button
                onClick={() => handleLogin('admin')}
                disabled={!name.trim() || isLoading}
                className={`role-button admin-button ${
                  selectedRole === 'admin' && isLoading ? 'loading' : ''
                }`}
              >
                <span className="role-icon">👨‍💻</span>
                <span className="role-text">Administrador</span>
              </button>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>© 2025 CaddiePro - Sistema desarrollado por <a href="https://berracode.com/" target="_blank" rel="noopener noreferrer">Berracode</a></p>
        </div>
      </div>
    </div>
  );
};
