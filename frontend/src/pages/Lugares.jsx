import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Lugares() {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/lugares').then((res) => setLugares(res.data));
  }, []);

  const filtrados = lugares.filter((l) =>
    l.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.volver} onClick={() => navigate('/')}>← Volver</button>
        <h2 style={styles.titulo}>Lugares</h2>
      </div>

      <input
        style={styles.input}
        placeholder="Buscar lugares..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div style={styles.lista}>
        {filtrados.map((l) => (
          <div key={l.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <p style={styles.nombre}>{l.nombre}</p>
              <span style={styles.rating}>⭐ {l.rating || '—'}</span>
            </div>
            <p style={styles.direccion}>{l.direccion}</p>
            <span style={styles.tipo}>{l.tipo}</span>
          </div>
        ))}
        {filtrados.length === 0 && (
          <p style={styles.vacio}>No se encontraron lugares</p>
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
  input: { width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #5C3A1E', backgroundColor: '#2a2620', color: '#F5F0E8', fontSize: '1rem', marginBottom: '1.5rem', boxSizing: 'border-box' },
  lista: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: { backgroundColor: '#2a2620', padding: '1rem', borderRadius: '8px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nombre: { margin: 0, fontWeight: 'bold', fontSize: '1rem' },
  rating: { color: '#F0B429', fontSize: '0.85rem' },
  direccion: { margin: '0.25rem 0', color: '#9a9690', fontSize: '0.85rem' },
  tipo: { backgroundColor: '#5C3A1E', color: '#F5F0E8', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' },
  vacio: { color: '#9a9690', textAlign: 'center' },
};