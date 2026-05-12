import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Bebidas() {
  const [bebidas, setBebidas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todas');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bebidas').then((res) => setBebidas(res.data));
  }, []);

  const filtradas = bebidas.filter((b) => {
    const coincideNombre = b.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtro === 'todas' || b.tipo === filtro;
    return coincideNombre && coincideTipo;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.volver} onClick={() => navigate('/')}>← Volver</button>
        <h2 style={styles.titulo}>Bebidas</h2>
      </div>

      <input
        style={styles.input}
        placeholder="Buscar bebidas..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div style={styles.filtros}>
        {['todas', 'cerveza', 'otras'].map((f) => (
          <button
            key={f}
            style={{ ...styles.filtroBtm, ...(filtro === f ? styles.filtroActivo : {}) }}
            onClick={() => setFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.lista}>
        {filtradas.map((b) => (
          <div key={b.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <p style={styles.nombre}>{b.nombre}</p>
              <span style={styles.rating}>⭐ {b.rating || '—'}</span>
            </div>
            <p style={styles.detalle}>{b.tipo} · {b.porcentaje_alcohol}% alc.</p>
            <p style={styles.descripcion}>{b.descripcion}</p>
          </div>
        ))}
        {filtradas.length === 0 && (
          <p style={styles.vacio}>No se encontraron bebidas</p>
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
  filtros: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  filtroBtm: { padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid #5C3A1E', backgroundColor: 'transparent', color: '#F5F0E8', cursor: 'pointer', fontSize: '0.85rem' },
  filtroActivo: { backgroundColor: '#C47A1E', border: '1px solid #C47A1E' },
  lista: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: { backgroundColor: '#2a2620', padding: '1rem', borderRadius: '8px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  nombre: { margin: 0, fontWeight: 'bold', fontSize: '1rem' },
  rating: { color: '#F0B429', fontSize: '0.85rem' },
  detalle: { margin: '0.25rem 0', color: '#C47A1E', fontSize: '0.85rem' },
  descripcion: { margin: '0.25rem 0 0', color: '#9a9690', fontSize: '0.85rem' },
  vacio: { color: '#9a9690', textAlign: 'center' },
};