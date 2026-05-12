import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Amigos() {
  const [amigos, setAmigos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/usuarios/amigos').then((res) => setAmigos(res.data));
  }, []);

  const buscarUsuarios = async (q) => {
    setBusqueda(q);
    if (q.trim().length < 2) return setResultados([]);
    const res = await api.get(`/usuarios/buscar?q=${q}`);
    setResultados(res.data);
  };

  const agregarAmigo = async (amigoId) => {
    try {
      await api.post('/usuarios/amigos', { amigoId });
      setMensaje('Solicitud enviada');
      setResultados([]);
      setBusqueda('');
      const res = await api.get('/usuarios/amigos');
      setAmigos(res.data);
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al agregar');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.volver} onClick={() => navigate('/')}>← Volver</button>
        <h2 style={styles.titulo}>Amigos</h2>
      </div>

      <input
        style={styles.input}
        placeholder="Buscar usuarios..."
        value={busqueda}
        onChange={(e) => buscarUsuarios(e.target.value)}
      />

      {mensaje && <p style={styles.mensaje}>{mensaje}</p>}

      {resultados.length > 0 && (
        <div style={styles.resultados}>
          {resultados.map((u) => (
            <div key={u.id} style={styles.resultadoItem}>
              <span>{u.nombre}</span>
              <button style={styles.agregarBtn} onClick={() => agregarAmigo(u.id)}>
                Agregar
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 style={styles.subtitulo}>Tus amigos ({amigos.length})</h3>
      <div style={styles.lista}>
        {amigos.map((a) => (
          <div key={a.id} style={styles.card}>
            <div style={styles.avatar}>{a.nombre.charAt(0).toUpperCase()}</div>
            <div>
              <p style={styles.nombre}>{a.nombre}</p>
              <p style={styles.estado}>{a.estado}</p>
            </div>
          </div>
        ))}
        {amigos.length === 0 && (
          <p style={styles.vacio}>Todavía no tenés amigos agregados</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#1C1A16', minHeight: '100vh', padding: '1.5rem', color: '#F5F0E8' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' },
  volver: { backgroundColor: 'transparent', border: 'none', color: '#C47A1E', cursor: 'pointer', fontSize: '1rem' },
  titulo: { margin: 0, fontSize: '1.5rem' },
  input: { width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #5C3A1E', backgroundColor: '#2a2620', color: '#F5F0E8', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' },
  mensaje: { color: '#F0B429', marginBottom: '1rem', fontSize: '0.9rem' },
  resultados: { backgroundColor: '#2a2620', borderRadius: '8px', marginBottom: '1rem', overflow: 'hidden' },
  resultadoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #3a3630' },
  agregarBtn: { backgroundColor: '#C47A1E', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem' },
  subtitulo: { color: '#C47A1E', marginBottom: '1rem' },
  lista: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: { backgroundColor: '#2a2620', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' },
  avatar: { backgroundColor: '#C47A1E', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
  nombre: { margin: 0, fontWeight: 'bold' },
  estado: { margin: '0.2rem 0 0', color: '#9a9690', fontSize: '0.8rem' },
  vacio: { color: '#9a9690', textAlign: 'center' },
};