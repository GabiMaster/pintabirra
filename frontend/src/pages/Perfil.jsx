import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [preferencias, setPreferencias] = useState([]);
  const [nuevaPref, setNuevaPref] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    api.get('/recomendaciones/preferencias').then((res) => setPreferencias(res.data));
  }, []);

  const agregarPreferencia = async () => {
    if (!nuevaPref.trim()) return;
    try {
      await api.post('/recomendaciones/preferencias', { tipo_bebida: nuevaPref });
      const res = await api.get('/recomendaciones/preferencias');
      setPreferencias(res.data);
      setNuevaPref('');
      setMensaje('Preferencia agregada');
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al agregar');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  const eliminarPreferencia = async (id) => {
    await api.delete(`/recomendaciones/preferencias/${id}`);
    setPreferencias(preferencias.filter((p) => p.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.volver} onClick={() => navigate('/')}>← Volver</button>
        <h2 style={styles.titulo}>Perfil</h2>
      </div>

      <div style={styles.avatarContainer}>
        <div style={styles.avatar}>{usuario?.nombre.charAt(0).toUpperCase()}</div>
        <h3 style={styles.nombre}>{usuario?.nombre}</h3>
        <p style={styles.email}>{usuario?.email}</p>
      </div>

      <div style={styles.seccion}>
        <h3 style={styles.tituloSeccion}>Mis preferencias</h3>
        <div style={styles.preferencias}>
          {preferencias.map((p) => (
            <div key={p.id} style={styles.tag}>
              <span>{p.tipo_bebida}</span>
              <button style={styles.eliminarBtn} onClick={() => eliminarPreferencia(p.id)}>✕</button>
            </div>
          ))}
        </div>
        <div style={styles.agregarPref}>
          <input
            style={styles.input}
            placeholder="Ej: cerveza, vino, fernet..."
            value={nuevaPref}
            onChange={(e) => setNuevaPref(e.target.value)}
          />
          <button style={styles.agregarBtn} onClick={agregarPreferencia}>Agregar</button>
        </div>
        {mensaje && <p style={styles.mensaje}>{mensaje}</p>}
      </div>

      <div style={styles.seccion}>
        <button style={styles.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#1C1A16', minHeight: '100vh', padding: '1.5rem', color: '#F5F0E8' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  volver: { backgroundColor: 'transparent', border: 'none', color: '#C47A1E', cursor: 'pointer', fontSize: '1rem' },
  titulo: { margin: 0, fontSize: '1.5rem' },
  avatarContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' },
  avatar: { backgroundColor: '#C47A1E', color: '#fff', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.75rem' },
  nombre: { margin: 0, fontSize: '1.3rem' },
  email: { margin: '0.25rem 0 0', color: '#9a9690', fontSize: '0.9rem' },
  seccion: { marginBottom: '2rem' },
  tituloSeccion: { color: '#C47A1E', marginBottom: '1rem' },
  preferencias: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' },
  tag: { backgroundColor: '#5C3A1E', padding: '0.3rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' },
  eliminarBtn: { backgroundColor: 'transparent', border: 'none', color: '#F5F0E8', cursor: 'pointer', fontSize: '0.75rem', padding: 0 },
  agregarPref: { display: 'flex', gap: '0.5rem' },
  input: { flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #5C3A1E', backgroundColor: '#2a2620', color: '#F5F0E8', fontSize: '1rem' },
  agregarBtn: { padding: '0.75rem 1rem', backgroundColor: '#C47A1E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  mensaje: { color: '#F0B429', fontSize: '0.9rem', marginTop: '0.5rem' },
  logoutBtn: { width: '100%', padding: '0.75rem', backgroundColor: 'transparent', border: '1px solid #5C3A1E', color: '#C47A1E', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
};