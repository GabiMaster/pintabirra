import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [esRegistro, setEsRegistro] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (esRegistro) {
        await api.post('/auth/register', form);
        setEsRegistro(false);
      } else {
        const res = await api.post('/auth/login', form);
        login(res.data);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error en el servidor');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>PintaBirra</h1>
      <p style={styles.subtitulo}>Encontrate con tus amigos</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        {esRegistro && (
          <input
            style={styles.input}
            name="nombre"
            placeholder="Tu nombre"
            onChange={handleChange}
          />
        )}
        <input
          style={styles.input}
          name="email"
          type="email"
          placeholder="tu@email.com"
          onChange={handleChange}
        />
        <input
          style={styles.input}
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.boton} type="submit">
          {esRegistro ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </form>
      <p style={styles.link} onClick={() => setEsRegistro(!esRegistro)}>
        {esRegistro ? '¿Ya tenés cuenta? Ingresá' : '¿No tenés cuenta? Registrate'}
      </p>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#1C1A16', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  titulo: { color: '#F5F0E8', fontFamily: 'Georgia, serif', fontSize: '2.5rem', margin: 0 },
  subtitulo: { color: '#C47A1E', marginBottom: '2rem' },
  form: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '360px', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #5C3A1E', backgroundColor: '#2a2620', color: '#F5F0E8', fontSize: '1rem' },
  boton: { padding: '0.75rem', borderRadius: '6px', backgroundColor: '#C47A1E', color: '#fff', border: 'none', fontSize: '1rem', cursor: 'pointer' },
  error: { color: '#ff6b6b', fontSize: '0.9rem' },
  link: { color: '#C47A1E', marginTop: '1rem', cursor: 'pointer' },
};