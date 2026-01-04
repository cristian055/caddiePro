import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import './Login.css';

export const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loginAdmin } = useApp();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ok = await loginAdmin(password);
      if (ok) {
        setError(null);
        navigate('/dashboard');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h2>Acceso Administrador</h2>
        <p>Introduce la contraseña de administrador para acceder al panel.</p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          aria-label="Contraseña de administrador"
        />
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <Button type="submit" variant="primary">Entrar</Button>
        </div>
      </form>
    </div>
  );
};

// no default export; use named export `Login`
